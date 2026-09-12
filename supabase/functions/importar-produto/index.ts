// Edge Function: importar-produto
//
// Recebe um texto bruto (colado pelo admin a partir da página de um
// fornecedor) e usa a API da Anthropic pra extrair título, descrição,
// preço e tamanhos num JSON estruturado, pronto pra pré-preencher o
// formulário de "Novo Produto" no admin.html.
//
// ANTHROPIC_API_KEY é um secret da função (nunca chega no client) —
// configurar com: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

const ANTHROPIC_MODEL = "claude-sonnet-5";
const ANTHROPIC_MAX_TOKENS = 1000;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

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

interface ProdutoExtraido {
  nome: string;
  descricao: string;
  precoFornecedor: number;
  tamanhosDisponiveis: string[];
  confianca: "baixa" | "alta";
}

function validarProdutoExtraido(obj: unknown): obj is ProdutoExtraido {
  if (typeof obj !== "object" || obj === null) return false;
  const p = obj as Record<string, unknown>;
  return (
    typeof p.nome === "string" &&
    typeof p.descricao === "string" &&
    typeof p.precoFornecedor === "number" &&
    Array.isArray(p.tamanhosDisponiveis) &&
    p.tamanhosDisponiveis.every((t) => typeof t === "string") &&
    (p.confianca === "baixa" || p.confianca === "alta")
  );
}

// A IA às vezes envolve o JSON em ```json ... ``` mesmo quando instruída
// a não fazer isso — removemos a cerca de código antes de tentar o parse.
function extrairJson(texto: string): string {
  const semCerca = texto
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return semCerca;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido. Use POST." }, 405);
  }

  const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicApiKey) {
    return jsonResponse(
      { error: "ANTHROPIC_API_KEY não configurada nos secrets da função." },
      500,
    );
  }

  let texto: string;
  try {
    const body = await req.json();
    texto = body?.texto;
  } catch {
    return jsonResponse({ error: "Corpo da requisição precisa ser JSON válido." }, 400);
  }

  if (typeof texto !== "string" || texto.trim().length === 0) {
    return jsonResponse(
      { error: "Campo 'texto' é obrigatório e precisa ser uma string não vazia." },
      400,
    );
  }

  const prompt =
    `Extraia as informações de produto do texto abaixo, colado manualmente da ` +
    `página de um fornecedor de roupas fitness. Responda SOMENTE com um JSON ` +
    `válido, sem nenhum texto antes ou depois, sem markdown, no formato exato:\n\n` +
    `{"nome": string, "descricao": string, "precoFornecedor": number, "tamanhosDisponiveis": string[], "confianca": "baixa" | "alta"}\n\n` +
    `Regras:\n` +
    `- "precoFornecedor" é sempre um number (ponto decimal, sem "R$", sem vírgula).\n` +
    `- "tamanhosDisponiveis" é um array de strings curtas, ex: ["P","M","G"].\n` +
    `- Se algum campo não estiver claro no texto, faça sua melhor inferência razoável ` +
    `em vez de inventar dados; nunca deixe de retornar o campo.\n\n` +
    `- "confianca" avalia se o texto colado É DE FATO uma descrição real de produto ` +
    `de roupa vinda de um fornecedor (tem sinais concretos como nome de peça, tecido, ` +
    `modelagem, tamanho ou preço). Retorne "baixa" quando o texto for vago demais, ` +
    `genérico, claramente não relacionado a um produto de roupa (ex: lorem ipsum, ` +
    `texto aleatório, frase solta sem nenhuma informação de produto), ou quando você ` +
    `precisou inventar a maior parte dos campos por falta de informação real no texto. ` +
    `Retorne "alta" apenas quando o texto claramente descreve um produto de roupa real, ` +
    `com informação suficiente pra extrair os campos com confiança.\n\n` +
    `Texto do fornecedor:\n"""\n${texto}\n"""`;

  let anthropicRes: Response;
  try {
    anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: ANTHROPIC_MAX_TOKENS,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (err) {
    return jsonResponse(
      { error: "Falha ao chamar a API da Anthropic.", detalhe: String(err) },
      502,
    );
  }

  if (!anthropicRes.ok) {
    const detalhe = await anthropicRes.text();
    return jsonResponse(
      { error: "API da Anthropic retornou erro.", status: anthropicRes.status, detalhe },
      502,
    );
  }

  const anthropicData = await anthropicRes.json();
  const textoResposta: string | undefined = anthropicData?.content?.[0]?.text;

  if (typeof textoResposta !== "string") {
    return jsonResponse(
      { error: "Resposta da IA não veio no formato esperado.", detalhe: anthropicData },
      502,
    );
  }

  let produto: unknown;
  try {
    produto = JSON.parse(extrairJson(textoResposta));
  } catch {
    return jsonResponse(
      {
        error: "A IA não retornou um JSON válido.",
        respostaCrua: textoResposta,
      },
      422,
    );
  }

  if (!validarProdutoExtraido(produto)) {
    return jsonResponse(
      {
        error:
          "O JSON retornado pela IA não tem o formato esperado " +
          "(nome: string, descricao: string, precoFornecedor: number, tamanhosDisponiveis: string[]).",
        respostaCrua: produto,
      },
      422,
    );
  }

  return jsonResponse(produto, 200);
});
