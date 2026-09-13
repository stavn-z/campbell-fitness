// Catálogo agora vem do Supabase (tabelas produtos + variacoes_produto),
// carregado por loadProducts()
let products = [];

async function loadProducts() {
    const { data, error } = await window.supabase
        .from('produtos')
        .select('*, variacoes_produto(tamanho, estoque)')
        .eq('ativo', true);

    if (error) { console.error(error); return; }

    products = data.map(p => ({
        id: p.id,
        name: p.nome,
        category: p.categoria,
        price: p.preco,
        images: p.imagens || [],
        description: p.descricao || '',
        composicao: p.composicao_especificacoes || '',
        variacoes: (p.variacoes_produto || []).map(v => ({ tamanho: v.tamanho, estoque: v.estoque }))
    }));
}

// Texto de "Cuidados e Lavagem" é compartilhado entre todos os produtos
// (tabela configuracoes_loja, chave 'cuidados_lavagem') — carregado uma
// vez só e reaproveitado toda vez que um modal de produto abre, em vez de
// buscar de novo a cada clique.
let cuidadosLavagem = '';

async function loadConfiguracoesLoja() {
    const { data, error } = await window.supabase.from('configuracoes_loja').select('valor').eq('chave', 'cuidados_lavagem').maybeSingle();
    if (error) { console.error(error); return; }
    cuidadosLavagem = data?.valor || '';
}

let cart = [];
let currentModalProduct = null;
let selectedSize = null;

function showToast(title, msg) {
    const t = document.getElementById('success-toast');
    if(t) {
        document.getElementById('toast-title').innerText = title;
        document.getElementById('toast-msg').innerText = msg;
        t.classList.add('active');
        setTimeout(() => t.classList.remove('active'), 4000);
    }
}

window.showWarning = function(msg) {
    document.getElementById('warning-msg').innerText = msg;
    document.getElementById('warning-modal').classList.add('active');
};
window.closeWarning = function() { document.getElementById('warning-modal').classList.remove('active'); };

// LOGIN E PERFIL (Agora Salvando o Endereço Inteiro)
window.fazerLogin = async function() {
    document.getElementById('modal-login').classList.remove('active');
    // signInWithOAuth faz redirect de página inteira (sai do site e volta
    // autenticado) — diferente do popup do Firebase, é assim que o Supabase
    // Auth funciona. Não dá pra mostrar um toast de boas-vindas aqui porque
    // a página é descarregada antes da promise resolver; quem atualiza o
    // header depois do retorno é o handleAuthChange() em index.html.
    const { error } = await window.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (error) console.error(error);
};

// Placeholder para login com Apple — ativar quando o provider 'apple'
// estiver configurado no Supabase Dashboard e no Apple Developer.
// Descomente aqui e o botão correspondente em index.html.
// window.fazerLoginApple = async function() {
//     document.getElementById('modal-login').classList.remove('active');
//     const { error } = await window.supabase.auth.signInWithOAuth({
//         provider: 'apple',
//         options: { redirectTo: window.location.origin + window.location.pathname }
//     });
//     if (error) console.error(error);
// };

window.toggleUserProfile = function() { document.getElementById('user-menu').classList.toggle('active'); };

// LOGIN/CADASTRO POR E-MAIL E SENHA
let modoLoginCriarConta = false;

window.abrirModalLogin = function() {
    modoLoginCriarConta = false;
    document.getElementById('login-nome-group').style.display = 'none';
    document.getElementById('login-nome').value = '';
    document.getElementById('login-email').value = '';
    document.getElementById('login-senha').value = '';
    document.getElementById('login-erro').innerText = '';
    document.getElementById('login-modal-title').innerText = 'Entrar';
    document.getElementById('login-submit-btn').innerText = 'Entrar';
    document.getElementById('login-toggle-link').innerText = 'Não tem conta? Criar conta';
    document.getElementById('modal-login').classList.add('active');
};

window.alternarModoLogin = function(e) {
    if (e) e.preventDefault();
    modoLoginCriarConta = !modoLoginCriarConta;
    document.getElementById('login-nome-group').style.display = modoLoginCriarConta ? 'block' : 'none';
    document.getElementById('login-modal-title').innerText = modoLoginCriarConta ? 'Criar conta' : 'Entrar';
    document.getElementById('login-submit-btn').innerText = modoLoginCriarConta ? 'Criar conta' : 'Entrar';
    document.getElementById('login-toggle-link').innerText = modoLoginCriarConta ? 'Já tem conta? Entrar' : 'Não tem conta? Criar conta';
    document.getElementById('login-erro').innerText = '';
};

function mensagemErroAuth(error) {
    // Supabase Auth não usa códigos tipo "auth/wrong-password" como o Firebase —
    // o jeito confiável de identificar o erro é olhar o texto de error.message.
    const msg = (error && error.message) || '';
    if (/already registered/i.test(msg)) return 'Esse e-mail já está cadastrado. Tente entrar.';
    if (/invalid login credentials/i.test(msg)) return 'E-mail ou senha incorretos.';
    if (/password should be at least/i.test(msg)) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (/email not confirmed/i.test(msg)) return 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).';
    if (/rate limit/i.test(msg)) return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
    if (/unable to validate email address|invalid email/i.test(msg)) return 'E-mail inválido.';
    return 'Não foi possível concluir. Tente novamente.';
}

window.enviarLoginEmail = async function() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;
    const nome = document.getElementById('login-nome').value.trim();
    const erroEl = document.getElementById('login-erro');
    erroEl.innerText = '';

    if (!email || !senha) { erroEl.innerText = 'Preencha e-mail e senha.'; return; }
    if (modoLoginCriarConta && !nome) { erroEl.innerText = 'Preencha seu nome completo.'; return; }

    try {
        if (modoLoginCriarConta) {
            const { data, error } = await window.supabase.auth.signUp({
                email, password: senha,
                options: { data: { full_name: nome } }
            });
            if (error) throw error;

            // Se o projeto exigir confirmação por e-mail, o signUp não devolve
            // sessão ativa — não dá pra logar de primeira, precisa avisar.
            if (!data.session) {
                erroEl.innerText = 'Conta criada! Verifique seu e-mail para confirmar antes de entrar.';
                return;
            }

            window.userLogado = data.user;
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span class="login-label">${nome.split(' ')[0]}</span>`;
                loginBtn.setAttribute('aria-label', nome.split(' ')[0]);
            }
            showToast("Conta criada", `Bem-vindo(a), ${nome.split(' ')[0]}!`);
        } else {
            const { data, error } = await window.supabase.auth.signInWithPassword({ email, password: senha });
            if (error) throw error;
            const nomeExibido = data.user.user_metadata?.full_name || nome || email;
            showToast("Login", `Bem-vindo(a) de volta, ${nomeExibido.split(' ')[0]}!`);
        }
        document.getElementById('modal-login').classList.remove('active');
    } catch (e) {
        erroEl.innerText = mensagemErroAuth(e);
    }
};
window.fazerLogout = function() {
    window.supabase.auth.signOut().then(() => {
        document.getElementById('user-menu').classList.remove('active');
        showToast("Logout", "Você saiu da conta.");
        window.userProfile = null;
    });
};

function setProfileAvatarPreview(url) {
    const img = document.getElementById('profile-avatar-img');
    const fallback = document.getElementById('profile-avatar-fallback');
    if (url) {
        img.src = url; img.style.display = 'block'; fallback.style.display = 'none';
    } else {
        img.style.display = 'none'; fallback.style.display = 'flex';
    }
}

// Redimensiona/recorta a imagem (quadrado, lado = tamanho) e devolve como Blob
// JPEG comprimido, pronto pra subir no Supabase Storage.
function redimensionarImagemParaBlob(file, tamanho) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = tamanho; canvas.height = tamanho;
                const ctx = canvas.getContext('2d');
                const lado = Math.min(img.width, img.height);
                const sx = (img.width - lado) / 2;
                const sy = (img.height - lado) / 2;
                ctx.drawImage(img, sx, sy, lado, lado, 0, 0, tamanho, tamanho);
                canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Não foi possível gerar a imagem.')), 'image/jpeg', 0.85);
            };
            img.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
            img.src = e.target.result;
        };
        leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
        leitor.readAsDataURL(file);
    });
}

window.onProfilePhotoSelected = async function(input) {
    const file = input.files[0];
    if (!file || !window.userLogado) return;

    if (!file.type.startsWith('image/')) { showWarning("Selecione um arquivo de imagem."); input.value = ''; return; }
    if (file.size > 8 * 1024 * 1024) { showWarning("A imagem deve ter até 8MB."); input.value = ''; return; }

    const statusEl = document.getElementById('profile-avatar-status');
    statusEl.innerText = "Processando foto...";
    try {
        const blob = await redimensionarImagemParaBlob(file, 300);
        // Path fixo por usuário (upsert:true sobrescreve) — RLS do bucket
        // "avatares" só deixa cada um escrever na própria pasta.
        const path = `${window.userLogado.id}/avatar.jpg`;

        const { error: erroUpload } = await window.supabase.storage.from('avatares').upload(path, blob, { cacheControl: '3600', upsert: true, contentType: 'image/jpeg' });
        if (erroUpload) throw erroUpload;

        const { data } = window.supabase.storage.from('avatares').getPublicUrl(path);
        // "?v=" evita que o navegador continue mostrando a foto antiga em
        // cache depois de trocar (o path é sempre o mesmo).
        const photoURL = `${data.publicUrl}?v=${Date.now()}`;

        // Prioriza o nome já salvo no perfil — um upsert disparado só pela troca
        // de foto não pode sobrescrever um nome customizado com o nome do Google.
        const { error: erroPerfil } = await window.supabase.from('perfis').upsert({
            user_id: window.userLogado.id,
            nome: window.userProfile?.name || window.userLogado.user_metadata?.full_name || window.userLogado.user_metadata?.name || '',
            email: window.userLogado.email,
            foto_url: photoURL
        }, { onConflict: 'user_id' });
        if (erroPerfil) throw erroPerfil;

        window.userProfile = { ...(window.userProfile || {}), photoURL };
        setProfileAvatarPreview(photoURL);
        statusEl.innerText = "";
        showToast("Foto atualizada", "Sua foto de perfil foi salva.");
    } catch (e) {
        console.error(e);
        statusEl.innerText = "";
        showWarning("Erro ao processar a foto. Tente novamente.");
    }
    input.value = '';
};

// DDDs oficialmente atribuídos pela Anatel — usado pra rejeitar números com
// DDD inexistente (ex: 00, 20, 26), não só contar dígitos.
const DDDS_VALIDOS = new Set([
    11,12,13,14,15,16,17,18,19, 21,22,24, 27,28, 31,32,33,34,35,37,38,
    41,42,43,44,45,46,47,48,49, 51,53,54,55, 61,62,63,64,65,66,67,68,69,
    71,73,74,75,77,79, 81,82,83,84,85,86,87,88,89, 91,92,93,94,95,96,97,98,99
]);

// Formata progressivamente enquanto digita: (XX) XXXXX-XXXX. Limita a 11
// dígitos (DDD + celular com o 9º dígito), então o campo nunca aceita mais
// do que isso mesmo colando um número maior.
function mascararTelefone(valor) {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    if (digitos.length === 0) return '';
    if (digitos.length <= 2) return `(${digitos}`;
    if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7, 11)}`;
}

// Formato completo esperado: (XX) 9XXXX-XXXX — 11 dígitos, com o 9º dígito
// do celular presente, e DDD dentro do conjunto realmente atribuído.
function telefoneValido(valor) {
    const m = /^\((\d{2})\) 9\d{4}-\d{4}$/.exec(valor);
    return !!m && DDDS_VALIDOS.has(parseInt(m[1], 10));
}

const profilePhoneInput = document.getElementById('profile-phone');
if (profilePhoneInput) {
    profilePhoneInput.addEventListener('input', (e) => {
        e.target.value = mascararTelefone(e.target.value);
        document.getElementById('profile-phone-error').innerText = '';
    });
}

// Mesma máscara/validação no campo de telefone do carrinho, que só
// aparece quando o cliente ainda não tem telefone salvo no perfil.
const clientPhoneInput = document.getElementById('client-phone');
if (clientPhoneInput) {
    clientPhoneInput.addEventListener('input', (e) => {
        e.target.value = mascararTelefone(e.target.value);
        document.getElementById('client-phone-error').innerText = '';
    });
}

// Mostra o campo de telefone no carrinho só quando o perfil ainda não tem
// um telefone salvo — quem já tem não precisa digitar de novo.
function atualizarCampoTelefoneCarrinho() {
    const group = document.getElementById('client-phone-group');
    if (!group) return;
    // mascararTelefone() normaliza telefones salvos antes dessa máscara
    // existir (dígitos crus) — só considera "já tem telefone" quando o
    // valor normalizado passa na validação de verdade, não só presença.
    const telefoneSalvoValido = telefoneValido(mascararTelefone(window.userProfile?.phone || ''));
    group.style.display = telefoneSalvoValido ? 'none' : 'block';
}

window.openProfileModal = function() {
    if(!window.userLogado) return;
    // Nome salvo no perfil tem prioridade sobre o nome do Google — o Google
    // só serve de sugestão inicial pra quem ainda não editou o campo.
    document.getElementById('profile-name').value = window.userProfile?.name || window.userLogado.user_metadata?.full_name || window.userLogado.user_metadata?.name || '';
    document.getElementById('profile-email').value = window.userLogado.email || '';
    document.getElementById('profile-phone-error').innerText = '';
    setProfileAvatarPreview(window.userProfile?.photoURL || window.userLogado.user_metadata?.avatar_url || window.userLogado.user_metadata?.picture || null);

    if(window.userProfile) {
        document.getElementById('profile-cep').value = window.userProfile.cep || "";
        document.getElementById('profile-street').value = window.userProfile.street || "";
        document.getElementById('profile-number').value = window.userProfile.number || "";
        document.getElementById('profile-comp').value = window.userProfile.comp || "";
        document.getElementById('profile-neighborhood').value = window.userProfile.neighborhood || "";
        document.getElementById('profile-city').value = window.userProfile.city || "";
        document.getElementById('profile-uf').value = window.userProfile.uf || "";
        // mascararTelefone() normaliza telefones salvos antes dessa máscara
        // existir (ex: dígitos crus sem formatação) pro formato validável.
        document.getElementById('profile-phone').value = mascararTelefone(window.userProfile.phone || "");
    }
    document.getElementById('user-menu').classList.remove('active');
    document.getElementById('modal-profile').classList.add('active');
};

window.saveUserProfile = async function() {
    if (!window.userLogado) return;

    const name = document.getElementById('profile-name').value.trim();
    if (!name) { showWarning("Preencha seu nome."); return; }

    const phone = document.getElementById('profile-phone').value.trim();
    const phoneErrorEl = document.getElementById('profile-phone-error');
    if (phone && !telefoneValido(phone)) {
        phoneErrorEl.innerText = "Telefone incompleto ou inválido. Use o formato (XX) 9XXXX-XXXX com um DDD válido.";
        return;
    }
    phoneErrorEl.innerText = '';

    const telefoneAnterior = window.userProfile?.phone || '';

    const profileData = {
        cep: document.getElementById('profile-cep').value,
        street: document.getElementById('profile-street').value,
        number: document.getElementById('profile-number').value,
        comp: document.getElementById('profile-comp').value,
        neighborhood: document.getElementById('profile-neighborhood').value,
        city: document.getElementById('profile-city').value,
        uf: document.getElementById('profile-uf').value,
        phone: phone,
        email: window.userLogado.email,
        name: name,
        photoURL: window.userProfile?.photoURL || window.userLogado.user_metadata?.avatar_url || window.userLogado.user_metadata?.picture || null
    };

    try {
        const { error } = await window.supabase.from('perfis').upsert({
            user_id: window.userLogado.id,
            nome: profileData.name,
            email: profileData.email,
            telefone: profileData.phone,
            cep: profileData.cep,
            rua: profileData.street,
            numero: profileData.number,
            complemento: profileData.comp,
            bairro: profileData.neighborhood,
            cidade: profileData.city,
            uf: profileData.uf,
            foto_url: profileData.photoURL
        }, { onConflict: 'user_id' });
        if (error) throw error;
        window.userProfile = profileData;

        // Telefone mudou — sincroniza cliente_telefone dos pedidos ainda em
        // andamento (RLS/RPC restringe aos próprios pedidos do usuário),
        // pra o Kanban nunca ficar com um número desatualizado. Não bloqueia
        // o salvamento do perfil se isso falhar — é um passo secundário.
        if (phone && phone !== telefoneAnterior) {
            const { error: erroSync } = await window.supabase.rpc('sincronizar_telefone_pedidos', { p_telefone: phone });
            if (erroSync) console.error('Erro ao sincronizar telefone com pedidos em andamento:', erroSync);
        }

        // Atualiza o carrinho imediatamente se estiver aberto
        if(document.getElementById('client-cep')) {
            document.getElementById('client-cep').value = profileData.cep || "";
            document.getElementById('client-street').value = profileData.street || "";
            document.getElementById('client-number').value = profileData.number || "";
            document.getElementById('client-comp').value = profileData.comp || "";
            document.getElementById('client-neighborhood').value = profileData.neighborhood || "";
            document.getElementById('client-city').value = profileData.city || "";
            document.getElementById('client-uf').value = profileData.uf || "";
        }

        // Reflete o nome recém-salvo no header e no carrinho na hora, sem
        // esperar o próximo evento de auth (login/refresh) pra atualizar —
        // o nome salvo tem prioridade sobre o do Google em qualquer lugar
        // que ele apareça no site.
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span class="login-label">${name.split(' ')[0]}</span>`;
            loginBtn.setAttribute('aria-label', name.split(' ')[0]);
        }
        if (document.getElementById('client-name')) document.getElementById('client-name').value = name;

        showToast("Salvo", "Seus dados foram atualizados!");
        document.getElementById('modal-profile').classList.remove('active');
    } catch(e) {
        console.error(e); showWarning("Erro ao salvar dados.");
    }
};

// MEUS PEDIDOS
window.openMyOrders = async function() {
    if(!window.userLogado) return;
    const container = document.getElementById('orders-list-container');
    container.innerHTML = '<p style="color:#888; text-align:center;">Carregando...</p>';
    document.getElementById('user-menu').classList.remove('active');
    document.getElementById('modal-user-orders').classList.add('active');
    try {
        const { data, error } = await window.supabase
            .from('pedidos')
            .select('id, status, total, itens_pedido(produto_imagem)')
            .order('criado_em', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { container.innerHTML = '<p style="color:#ccc; text-align:center;">Você ainda não fez pedidos.</p>'; return; }

        let html = '';
        data.forEach((p) => {
            const statusClass = p.status === 'Pago' ? 'status-pago' : (p.status === 'Enviado' ? 'status-enviado' : 'status-novo');
            const itens = p.itens_pedido || [];
            const thumb = itens[0]?.produto_imagem || 'https://via.placeholder.com/60';

            html += `
            <div class="user-order-item">
                <div style="display:flex; gap:15px; align-items:center;">
                    <img src="${thumb}" style="width: 60px; height: 60px; border-radius: 5px; object-fit: cover; border: 1px solid #444;">
                    <div>
                        <div style="font-weight:bold; color:white; margin-bottom: 5px;">Pedido #${p.id.slice(0,4).toUpperCase()}</div>
                        <div style="font-size:0.8rem; color:#888;">${itens.length} itens - R$ ${Number(p.total).toFixed(2).replace('.', ',')}</div>
                    </div>
                </div>
                <div class="order-status ${statusClass}">${p.status}</div>
            </div>`;
        });
        container.innerHTML = html;
    } catch(e) { console.error(e); container.innerHTML = '<p style="color:red; text-align:center;">Erro ao buscar pedidos.</p>'; }
};

// CARRINHO, QUANTIDADES E CHECKOUT WHATSAPP
window.addToCart = function(isBuyNow) {
    if(!selectedSize) return showWarning("Selecione um tamanho antes de continuar!");
    const key = `${currentModalProduct.id}-${selectedSize}`;
    const item = cart.find(i => i.key === key);
    if(item) item.quantity++; else cart.push({...currentModalProduct, key, selectedSize, quantity: 1});
    updateCartUI();
    document.getElementById('product-modal').classList.remove('active');
    if (isBuyNow) toggleCart(true); else showToast("Adicionado", `${currentModalProduct.name} no carrinho!`);
};

window.changeQty = function(key, delta) {
    const item = cart.find(i => i.key === key);
    if(item) {
        item.quantity += delta;
        if(item.quantity <= 0) removeFromCart(key);
        else updateCartUI();
    }
};

window.removeFromCart = function(key) { 
    cart = cart.filter(i => i.key !== key); 
    updateCartUI(); 
};

window.checkoutWhatsApp = async function() {
    if(cart.length === 0) return showWarning("Seu carrinho está vazio!");
    
    const street = document.getElementById('client-street').value;
    const name = document.getElementById('client-name').value;
    const num = document.getElementById('client-number').value;
    const payment = document.getElementById('client-payment').value;
    const tipoEntrega = document.getElementById('client-tipo-entrega').value;

    if(!name) { document.getElementById('cart-sidebar').classList.add('open'); return showWarning("Por favor, preencha o seu Nome Completo!"); }
    if(!street || !num) { document.getElementById('cart-sidebar').classList.add('open'); return showWarning("Preencha seu Endereço (Rua e Número) para a entrega!"); }

    // Telefone: usa o já salvo no perfil, se existir e for válido depois de
    // normalizado (mascararTelefone() corrige telefones salvos antes dessa
    // máscara existir — dígitos crus). Se não tiver um válido, exige o
    // campo extra que aparece no carrinho (atualizarCampoTelefoneCarrinho)
    // e valida o formato antes de deixar finalizar — depois de criar o
    // pedido, salva esse número no perfil pra não pedir de novo (isso
    // também corrige o perfil de quem tinha um telefone em formato antigo).
    let telefone = mascararTelefone(window.userProfile?.phone || "");
    if (!telefoneValido(telefone)) telefone = "";
    let telefoneNovoPraSalvarNoPerfil = false;
    if (!telefone) {
        const phoneInput = document.getElementById('client-phone');
        const valorDigitado = phoneInput ? phoneInput.value.trim() : '';
        if (!telefoneValido(valorDigitado)) {
            document.getElementById('cart-sidebar').classList.add('open');
            document.getElementById('client-phone-error').innerText = 'Informe um telefone válido no formato (XX) 9XXXX-XXXX para finalizar o pedido.';
            phoneInput?.focus();
            return;
        }
        telefone = valorDigitado;
        telefoneNovoPraSalvarNoPerfil = true;
    }

    const btn = document.querySelector('.checkout-btn');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;

    const finalAddress = `${street}, ${num} - ${document.getElementById('client-neighborhood').value}, ${document.getElementById('client-city').value}/${document.getElementById('client-uf').value} - CEP: ${document.getElementById('client-cep').value}`;
    const total = cart.reduce((a,b)=>a+(b.price*b.quantity),0);

    // criar_pedido() insere pedido + itens_pedido numa transação só e valida
    // estrutura mínima (itens não-vazio, total>0, etc). Nunca fazer .insert()
    // direto em pedidos/itens_pedido — RLS bloqueia isso por design, só a
    // função (security definer) tem permissão pra escrever nessas tabelas.
    const itens = cart.map(i => ({
        produto_id: i.id,
        produto_nome: i.name,
        produto_imagem: i.images?.[0] || null,
        preco_unitario: i.price,
        tamanho: i.selectedSize,
        quantidade: i.quantity
    }));

    try {
        const { data: pedidoUuid, error } = await window.supabase.rpc('criar_pedido', {
            cliente_nome: name,
            cliente_telefone: telefone,
            cliente_endereco: finalAddress,
            total: total,
            pagamento: payment,
            tipo_entrega: tipoEntrega,
            itens: itens
        });
        if (error) throw error;

        // Primeira vez que esse usuário informa telefone (perfil não tinha
        // nenhum salvo) — grava no perfil pra não pedir de novo na próxima
        // compra. Só faz sentido pra quem está logado (perfil tem FK pro
        // usuário); visitante sem conta usa o telefone só nesse pedido mesmo.
        if (telefoneNovoPraSalvarNoPerfil && window.userLogado) {
            const { error: erroPerfil } = await window.supabase.from('perfis').upsert({
                user_id: window.userLogado.id,
                nome: window.userProfile?.name || window.userLogado.user_metadata?.full_name || window.userLogado.user_metadata?.name || '',
                email: window.userLogado.email,
                telefone: telefone
            }, { onConflict: 'user_id' });
            if (!erroPerfil) {
                window.userProfile = { ...(window.userProfile || {}), phone: telefone };
                atualizarCampoTelefoneCarrinho();
            }
        }

        const pedidoID = pedidoUuid.slice(0, 5).toUpperCase();
        const phone = "5532984192045";
        
        let msg = `Olá, Campbell Moda Fitness! Segue meu pedido feito pelo site (#${pedidoID}):\n\n`;
        msg += `*ITENS DO PEDIDO*\n`;
        cart.forEach(i => {
            msg += `- ${i.quantity}x ${i.name} (Tam: ${i.selectedSize}) — R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}\n`;
        });
        msg += `\n*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        msg += `---------------------------------\n`;
        msg += `*DADOS PARA ENTREGA*\n`;
        msg += `Nome: ${name}\n`;
        msg += `Tipo: ${tipoEntrega}\n`;
        msg += `Endereço: ${finalAddress}\n`;
        msg += `---------------------------------\n`;
        msg += `Forma de pagamento: ${payment}`;

        // encodeURIComponent garante que o WhatsApp vai ler espaços, quebras de linha e acentos sem dar erro
        const encodedMsg = encodeURIComponent(msg);
        
        window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
        
        cart = []; updateCartUI(); toggleCart(false);
        showToast("Enviado!", "Finalize o atendimento no WhatsApp.");
        btn.innerHTML = oldText; btn.disabled = false;
    } catch(e) { 
        console.error(e); 
        showWarning("Erro ao gerar pedido. Tente novamente."); 
        btn.disabled = false; 
        btn.innerHTML = oldText; 
    }
};

// UI E MODAL
function preloadImage(src) {
    if (!src || src.endsWith('.mp4') || src.endsWith('.webm')) return; // vídeo não precisa de preload via Image()
    const img = new Image();
    img.src = src;
}

// Pré-carrega a imagem seguinte e a anterior (com wrap-around) pra troca ficar instantânea nos dois sentidos
function preloadAdjacentImages(images, idx) {
    if (!images || images.length < 2) return;
    preloadImage(images[(idx + 1) % images.length]);
    preloadImage(images[(idx - 1 + images.length) % images.length]);
}

window.getMediaHTML = function(src, index, fn) {
    if(src.endsWith('.mp4')||src.endsWith('.webm')) return `<video class="product-image" data-index="${index}" autoplay muted loop playsinline onclick="${fn}"><source src="${src}" type="video/mp4"></video>`;
    return `<img src="${src}" class="product-image" data-index="${index}" onclick="${fn}">`;
};

window.createProductCard = function(p) {
    const arrows = p.images.length > 1 ? `<button class="slider-btn prev-btn" onclick="slideImage(event,'${p.id}',-1)">&#10094;</button><button class="slider-btn next-btn" onclick="slideImage(event,'${p.id}',1)">&#10095;</button>` : '';
    const media = window.getMediaHTML(p.images[0], 0, `openModal('${p.id}')`);
    preloadAdjacentImages(p.images, 0);
    return `<div class="product-card"><div class="image-slider">${arrows}${media}</div><div class="product-info"><span class="category">${p.category}</span><h3 class="title" onclick="openModal('${p.id}')">${p.name}</h3><span class="price">R$ ${p.price.toFixed(2).replace('.', ',')}</span><button class="add-btn" onclick="openModal('${p.id}')">VER DETALHES</button></div></div>`;
};

window.slideImage = function(e, pid, dir) {
    e.stopPropagation();
    const card = e.target.closest('.product-card'); const media = card.querySelector('.product-image'); const p = products.find(prod => prod.id === pid);
    let idx = parseInt(media.getAttribute('data-index')) + dir;
    if(idx < 0) idx = p.images.length -1; if(idx >= p.images.length) idx = 0;
    
    media.style.opacity = '0';
    setTimeout(() => {
        const wrapper = card.querySelector('.image-slider'); media.remove();
        const src = p.images[idx];
        let newMedia = (src.endsWith('.mp4')) ? document.createElement('video') : document.createElement('img');
        newMedia.className = 'product-image'; newMedia.setAttribute('data-index', idx); newMedia.onclick = () => openModal(pid);
        if(newMedia.tagName === 'VIDEO') { newMedia.autoplay = true; newMedia.muted = true; newMedia.loop = true; newMedia.innerHTML = `<source src="${src}">`; } else { newMedia.src = src; }
        wrapper.appendChild(newMedia); setTimeout(() => newMedia.style.opacity = '1', 10);
        preloadAdjacentImages(p.images, idx);
    }, 200);
};

window.openModal = function(id) {
    const p = products.find(prod => prod.id === id); currentModalProduct = p; selectedSize = null;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-category').innerText = p.category;
    document.getElementById('modal-price').innerText = `R$ ${p.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-desc').innerText = p.description;
    document.getElementById('modal-composicao').innerText = p.composicao || 'Nenhuma informação técnica cadastrada para este produto.';
    document.getElementById('modal-cuidados').innerText = cuidadosLavagem || 'Consulte as instruções na etiqueta da peça.';
    switchProductTab('descricao'); // sempre volta pra 1ª aba ao abrir um produto novo

    const container = document.getElementById('main-media-container'); container.innerHTML = '';
    const src = p.images[0];
    if(src.endsWith('.mp4')) container.innerHTML = `<video class="main-modal-img" autoplay muted loop playsinline><source src="${src}"></video>`;
    else container.innerHTML = `<img src="${src}" class="main-modal-img" id="modal-img">`;

    document.getElementById('modal-thumbnails').innerHTML = p.images.map((img, i) => {
        if(img.endsWith('.mp4')) return `<video src="${img}" class="thumb ${i===0?'active':''}" muted onclick="changeModalMedia('${img}', this, ${i})"></video>`;
        return `<img src="${img}" class="thumb ${i===0?'active':''}" onclick="changeModalMedia('${img}', this, ${i})">`;
    }).join('');

    document.getElementById('modal-sizes').innerHTML = p.variacoes.map(v => v.estoque > 0
        ? `<button class="size-btn" onclick="selectSize('${v.tamanho}', this)">${v.tamanho}</button>`
        : `<button class="size-btn esgotado" disabled title="Esgotado">${v.tamanho}<span class="esgotado-label">Esgotado</span></button>`
    ).join('');
    document.getElementById('fit-result').style.display = 'none';
    document.getElementById('product-modal').classList.add('active');
    preloadAdjacentImages(p.images, 0);
};

window.changeModalMedia = function(src, thumb, idx) {
    const c = document.getElementById('main-media-container'); c.innerHTML='';
    if(src.endsWith('.mp4')) c.innerHTML=`<video class="main-modal-img" autoplay muted loop><source src="${src}"></video>`; else c.innerHTML=`<img src="${src}" class="main-modal-img">`;
    document.querySelectorAll('.thumb').forEach(t=>t.classList.remove('active')); thumb.classList.add('active');
    if (currentModalProduct) preloadAdjacentImages(currentModalProduct.images, idx);
};

window.switchProductTab = function(tab) {
    document.querySelectorAll('.product-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    document.querySelectorAll('.product-tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === 'tab-panel-' + tab));
};

window.selectSize = function(s, btn) { selectedSize = s; document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); };
window.closeModal = function() { document.getElementById('product-modal').classList.remove('active'); };
window.openInstitutional = function(id) { document.getElementById(id).classList.add('active'); };
window.closeInstitutional = function(id) { document.getElementById(id).classList.remove('active'); };
window.onclick = e => { if(e.target.classList.contains('info-modal-overlay') || e.target.classList.contains('modal-overlay')) e.target.classList.remove('active'); };

window.buscarCep = function(type) {
    // Agora aceita tanto o campo do Carrinho ('client') quanto do Perfil ('profile')
    const prefix = type === 'profile' ? 'profile' : 'client';
    const cep = document.getElementById(`${prefix}-cep`).value.replace(/\D/g, '');
    
    if (cep.length === 8) {
        document.getElementById(`${prefix}-street`).value = "Buscando...";
        fetch(`https://viacep.com.br/ws/${cep}/json/`).then(res => res.json()).then(data => {
            if (!data.erro) {
                document.getElementById(`${prefix}-street`).value = data.logradouro;
                document.getElementById(`${prefix}-neighborhood`).value = data.bairro;
                document.getElementById(`${prefix}-city`).value = data.localidade;
                document.getElementById(`${prefix}-uf`).value = data.uf;
                document.getElementById(`${prefix}-number`).focus();
            } else { showWarning("CEP não encontrado."); document.getElementById(`${prefix}-street`).value = ""; }
        }).catch(() => showWarning("Erro ao buscar CEP."));
    }
};

window.updatePaymentNote = function() {
    const payment = document.getElementById('client-payment').value;
    const note = document.getElementById('payment-note');
    if (payment === 'Cartão') {
        note.innerText = 'Sujeito a taxa da maquininha.';
        note.style.display = 'block';
    } else {
        note.innerText = '';
        note.style.display = 'none';
    }
};

window.toggleMobileNav = function() {
    document.querySelector('header nav').classList.toggle('mobile-open');
};
document.querySelectorAll('header nav a').forEach(a => a.addEventListener('click', () => {
    document.querySelector('header nav').classList.remove('mobile-open');
}));

window.toggleCart = function(open) {
    const sb = document.getElementById('cart-sidebar'); const ov = document.getElementById('overlay');
    if(typeof open === 'boolean'){ if(open){sb.classList.add('open');ov.classList.add('active');}else{sb.classList.remove('open');ov.classList.remove('active');}}
    else{ sb.classList.toggle('open'); ov.classList.toggle('active'); }
    atualizarCampoTelefoneCarrinho();
};

window.calculateSize = function() {
    const h = parseFloat(document.getElementById('fit-height').value); const w = parseFloat(document.getElementById('fit-weight').value); const r = document.getElementById('fit-result');
    if(!h||!w) { r.style.display='block'; r.innerText="Preencha altura e peso"; r.style.color="var(--primary)"; return; }
    let s="U"; if(w<53)s="P"; else if(w<64)s="M"; else if(w<74)s="G"; else if(w<95)s="GG"; else s="Consulte";
    r.style.display='block'; r.innerHTML = s==="Consulte" ? "Fale conosco." : `✨ Ideal: <strong>${s}</strong>`; r.style.color = "#25D366";
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((a, b) => a + b.quantity, 0);
    document.getElementById('cart-items').innerHTML = cart.map(i => {
        const img = i.images[0].endsWith('.mp4') ? `<video src="${i.images[0]}" style="width:60px;height:60px;object-fit:cover;border-radius:5px"></video>` : `<img src="${i.images[0]}" style="width:60px;height:60px;object-fit:cover;border-radius:5px">`;
        return `
        <div class="cart-item">
            ${img}
            <div class="cart-item-info">
                <h4>${i.name}</h4>
                <p>Tam: ${i.selectedSize}</p>
                <div class="cart-item-qty">
                    <button onclick="changeQty('${i.key}', -1)">-</button>
                    <span>${i.quantity}</span>
                    <button onclick="changeQty('${i.key}', 1)">+</button>
                </div>
                <p>R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}</p>
                <span class="remove-item" onclick="removeFromCart('${i.key}')">Remover</span>
            </div>
        </div>`;
    }).join('');
    document.getElementById('cart-total').innerText = `R$ ${cart.reduce((a,b)=>a+(b.price*b.quantity),0).toFixed(2).replace('.', ',')}`;
}

async function initStore() {
    await Promise.all([loadProducts(), loadConfiguracoesLoja()]);
    const render = (id, fn) => { const el = document.getElementById(id); if(el) el.innerHTML = products.filter(fn).map(window.createProductCard).join(''); }

    render('grid-destaques', ()=>true);
    render('grid-macacoes', p=>p.category==='Macacões e Macaquinhos');
    render('grid-conjuntos-calca', p=>p.category==='Conjuntos de Calça e Legging');
    render('grid-conjuntos-shorts', p=>p.category==='Conjuntos de Shorts e Bermuda');
    render('grid-pecas-avulsas', p=>p.category==='Peças Avulsas');
}
initStore();
