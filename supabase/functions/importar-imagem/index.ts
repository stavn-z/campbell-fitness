// Edge Function: importar-imagem
//
// Recebe a URL direta de uma imagem hospedada no CDN de um fornecedor
// (não a página do produto — só o arquivo de imagem em si) e baixa essa
// imagem no servidor, sem as restrições de CORS/anti-robô que o
// navegador do admin enfrentaria tentando isso direto do client. Faz
// upload pro mesmo bucket "produtos" do Supabase Storage que o upload
// manual usa, e devolve a URL pública — o client trata isso como se o
// admin tivesse escolhido o arquivo manualmente.
//
// Autorização: repassa o header Authorization de quem chamou pro
// cliente Supabase criado aqui dentro, em vez de usar a service role
// key. Quem não for admin recai no mesmo bloqueio de sempre — RLS de
// storage.objects já exige is_admin() pra INSERT no bucket "produtos" —
// então a checagem de permissão não precisa ser reimplementada aqui.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.116.0";

const MAX_BYTES = 8 * 1024 * 1024; // mesmo limite do upload manual em admin.html
const FETCH_TIMEOUT_MS = 15000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

const EXTENSAO_POR_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function extensaoDaUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

// Alguns CDNs de fornecedor (ex: assets.sistemawbuy.com.br, usado pela
// Dalu) servem imagens de verdade com content-type genérico
// (application/octet-stream ou vazio) — o navegador exibe normal porque
// ignora o header e detecta o formato pelos bytes. Fazemos o mesmo aqui:
// content-type genérico não é motivo de rejeição sozinho, só quando NEM
// o header NEM a assinatura dos bytes indicam uma imagem conhecida.
function detectarTipoImagemPorAssinatura(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer);
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  // WEBP = container RIFF; "WEBP" fica nos bytes 8-11 (bytes 0-3 são "RIFF").
  if (bytes.length >= 12 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return "image/webp";
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido. Use POST." }, 405);
  }

  // SUPABASE_URL / SUPABASE_ANON_KEY são injetadas automaticamente pela
  // plataforma em toda Edge Function — não são secrets configurados
  // manualmente, não confundir com ANTHROPIC_API_KEY em importar-produto.
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authHeader = req.headers.get("Authorization");

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse({ error: "Configuração do Supabase ausente na função." }, 500);
  }
  if (!authHeader) {
    return jsonResponse({ error: "Sessão ausente — faça login novamente." }, 401);
  }

  let imageUrlRaw: string;
  try {
    const body = await req.json();
    imageUrlRaw = body?.url;
  } catch {
    return jsonResponse({ error: "Corpo da requisição precisa ser JSON válido." }, 400);
  }

  if (typeof imageUrlRaw !== "string" || imageUrlRaw.trim().length === 0) {
    return jsonResponse({ error: "Campo 'url' é obrigatório." }, 400);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrlRaw.trim());
  } catch {
    return jsonResponse({ error: "URL inválida." }, 400);
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return jsonResponse({ error: "URL precisa começar com http:// ou https://." }, 400);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let imgRes: Response;
  try {
    imgRes = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        // alguns CDNs recusam requisições sem um User-Agent "de navegador"
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
  } catch (err) {
    const abortado = err instanceof Error && err.name === "AbortError";
    return jsonResponse(
      {
        error: abortado
          ? "Tempo esgotado baixando a imagem dessa URL."
          : "Não foi possível baixar a imagem dessa URL (bloqueio, domínio incorreto ou fora do ar).",
      },
      502,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!imgRes.ok) {
    return jsonResponse(
      { error: `O servidor da imagem respondeu com erro (HTTP ${imgRes.status}).` },
      502,
    );
  }

  const contentType = (imgRes.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const pareceImagemPeloHeader = contentType.startsWith("image/");
  const contentTypeGenerico = contentType === "" || contentType === "application/octet-stream";

  // Content-type explicitamente não-imagem (ex: text/html de uma página
  // de produto colada por engano) — rejeita sem nem baixar o corpo.
  // Genérico (vazio ou octet-stream) não rejeita aqui; só decide depois
  // de olhar os bytes de verdade.
  if (!pareceImagemPeloHeader && !contentTypeGenerico) {
    return jsonResponse(
      {
        error:
          `Essa URL não retornou uma imagem (content-type: "${contentType}"). ` +
          `Confirme que é o link direto do arquivo de imagem, não da página do produto.`,
      },
      422,
    );
  }

  const contentLength = imgRes.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BYTES) {
    return jsonResponse({ error: "Imagem passa de 8MB." }, 413);
  }

  const buffer = await imgRes.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) {
    return jsonResponse({ error: "Imagem passa de 8MB." }, 413);
  }
  if (buffer.byteLength === 0) {
    return jsonResponse({ error: "A URL retornou uma imagem vazia." }, 422);
  }

  // Content-type genérico só passa se os bytes baixados baterem com uma
  // assinatura de imagem conhecida — o content-type deixa de ser a
  // palavra final quando ele já não diz nada de útil.
  let contentTypeFinal = contentType;
  if (!pareceImagemPeloHeader) {
    const detectado = detectarTipoImagemPorAssinatura(buffer);
    if (!detectado) {
      return jsonResponse(
        {
          error:
            `Essa URL não retornou uma imagem reconhecível (content-type: "${contentType || "vazio"}", ` +
            `e os bytes do arquivo não correspondem a nenhum formato de imagem suportado). ` +
            `Confirme que é o link direto do arquivo de imagem, não da página do produto.`,
        },
        422,
      );
    }
    contentTypeFinal = detectado;
  }

  const extensao =
    EXTENSAO_POR_CONTENT_TYPE[contentTypeFinal] || extensaoDaUrl(parsedUrl.toString()) || "jpg";
  const path = `${crypto.randomUUID()}/importada.${extensao}`;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { error: uploadError } = await supabase.storage
    .from("produtos")
    .upload(path, buffer, { contentType: contentTypeFinal, upsert: false });

  if (uploadError) {
    const negado = /row-level security|permission|not authorized/i.test(uploadError.message);
    return jsonResponse(
      {
        error: negado
          ? "Sem permissão para enviar imagens (é preciso estar logado como admin)."
          : `Erro ao enviar a imagem pro Storage: ${uploadError.message}`,
      },
      negado ? 403 : 500,
    );
  }

  const { data: publicUrlData } = supabase.storage.from("produtos").getPublicUrl(path);

  return jsonResponse({ url: publicUrlData.publicUrl }, 200);
});
