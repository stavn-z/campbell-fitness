// BANCO DE PRODUTOS COMPLETO (EXEMPLOS COM NOVAS CATEGORIAS)
const products = [
    { id: 1, name: "Macaquinho Natalia Compressão Gengibre + Açaí", category: "Macacões", price: 170.00, images: ["https://i.postimg.cc/59KjCcqd/1e64bbb7ee39ae439e921abed84b1a90-6998ae1153843-mini.webp","https://i.postimg.cc/nVSMD8YJ/f7add2eb7d9af7daab30e68f5e5dbcac-6998ae107717c-mini.webp","https://i.postimg.cc/x112yq0N/f7add2eb7d9af7daab30e68f5e5dbcac-6998ae107717c-mini.webp"], description: "Macaquinho Natalia Compressão Gengibre + Açaí é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M"], paymentLink: "#" },
    { id: 2, name: "Macaquinho Layla Compressão Verde Flúor + Preto", category: "Macacões", price: 170.00, images: ["https://i.postimg.cc/qMjfR08z/c1b83c73dcf3140f53786cff0fa8189a-6998968487f7a-mini.webp","https://i.postimg.cc/NfphMY12/c82658b1aa68c467c0d90c3218acbdac-699896839dd0f-mini.webp","https://i.postimg.cc/MKdkTxyj/e2d842bf17e73fdd488cbf551822e21c-69989682d3196-mini.webp"], description: "Macaquinho Layla Compressão Verde Flúor + Preto é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" },
    { id: 3, name: "Conjunto Legging Básica Mariana Pérola + Garapa", category: "Conjuntos de Calça e Legging", price: 190.00, images: ["https://i.postimg.cc/5ysPx4Dk/0e2080fcce87874caa68b0b897a9ba70-699895b120da4-mini.webp","https://i.postimg.cc/j2M8sxB3/21cd3253452c0ba3ba1abd8880a46ca8-699895b021e6b-mini.webp","https://i.postimg.cc/Hn6SpYFS/e70b15c6f13f8ec0bbdebe2b980f1715-699895b215e31-mini.webp"], description: "Conjunto Legging Básica Mariana Pérola + Garapa é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" },
    { id: 4, name: "Conjunto Legging Básica Martina Compressão Sideral", category: "Conjuntos de Calça e Legging", price: 190.00, images: ["https://i.postimg.cc/sXyK7GzQ/363f4016bec9b5ba9c92267a069c6663-699895794a59d-mini.webp","https://i.postimg.cc/503g399f/448e4addda1afab2376f6de7b3624d54-6998957856dd4-mini.webp","https://i.postimg.cc/fLZ5mSsJ/a36380fca719fcd680815bb6bfd38e95-6998957a4baf5-mini.webp"], description: "Conjunto Legging Básica Martina Compressão Sideral é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M"], paymentLink: "#" },
    { id: 5, name: "Conjunto Short Básico Nala Branco + Preto", category: "Conjuntos de Shorts e Bermuda", price: 170.00, images: ["https://i.postimg.cc/WbDmDwZ9/32d4a6fc75084359b12c75119d84c5c7-698f3d59ce92a-mini.webp","https://i.postimg.cc/Fs2y0kby/5c5b39224797737c7ee4addac9eca42d-698f3d5817ca0-mini.webp","https://i.postimg.cc/VL3qX099/da23c13f94c17e31ed56e83bf73c4d13-698f3d58ef812-mini.webp"], description: "O Conjunto Short Básico Nala Branco + Preto é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" },
    { id: 6, name: "Conjunto Short Básico Fernanda Cacau + Mocca + Pérola", category: "Conjuntos de Shorts e Bermuda", price: 170.00, images: ["https://i.postimg.cc/y8yTBYcB/91f93a0f91304b55a4481ec85f25fb53-6998966ed2f43-mini.webp","https://i.postimg.cc/K8D5FvB2/a1c014ec3bb75e488f877b191ec4e1ca-6998966fad754-mini.webp","https://i.postimg.cc/bw9R8NkP/bfa0faf4d4e8a2251e88c627f89b777d-6998966e27089-mini.webp"], description: "Conjunto Short Básico Fernanda Cacau + Mocca + Pérola é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" },
    { id: 7, name: "Macaquinho Natalia Compressão Gengibre + Açaí", category: "Macacões", price: 170.00, images: ["https://i.postimg.cc/59KjCcqd/1e64bbb7ee39ae439e921abed84b1a90-6998ae1153843-mini.webp","https://i.postimg.cc/nVSMD8YJ/f7add2eb7d9af7daab30e68f5e5dbcac-6998ae107717c-mini.webp","https://i.postimg.cc/x112yq0N/f7add2eb7d9af7daab30e68f5e5dbcac-6998ae107717c-mini.webp"], description: "Macaquinho Natalia Compressão Gengibre + Açaí é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M"], paymentLink: "#" },
    { id: 8, name: "Macaquinho Layla Compressão Verde Flúor + Preto", category: "Macacões", price: 170.00, images: ["https://i.postimg.cc/qMjfR08z/c1b83c73dcf3140f53786cff0fa8189a-6998968487f7a-mini.webp","https://i.postimg.cc/NfphMY12/c82658b1aa68c467c0d90c3218acbdac-699896839dd0f-mini.webp","https://i.postimg.cc/MKdkTxyj/e2d842bf17e73fdd488cbf551822e21c-69989682d3196-mini.webp"], description: "Macaquinho Layla Compressão Verde Flúor + Preto é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" },
    { id: 9, name: "Conjunto Legging Básica Mariana Pérola + Garapa", category: "Conjuntos de Calça e Legging", price: 190.00, images: ["https://i.postimg.cc/5ysPx4Dk/0e2080fcce87874caa68b0b897a9ba70-699895b120da4-mini.webp","https://i.postimg.cc/j2M8sxB3/21cd3253452c0ba3ba1abd8880a46ca8-699895b021e6b-mini.webp","https://i.postimg.cc/Hn6SpYFS/e70b15c6f13f8ec0bbdebe2b980f1715-699895b215e31-mini.webp"], description: "Conjunto Legging Básica Mariana Pérola + Garapa é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" },
    { id: 10, name: "Conjunto Legging Básica Martina Compressão Sideral", category: "Conjuntos de Calça e Legging", price: 190.00, images: ["https://i.postimg.cc/sXyK7GzQ/363f4016bec9b5ba9c92267a069c6663-699895794a59d-mini.webp","https://i.postimg.cc/503g399f/448e4addda1afab2376f6de7b3624d54-6998957856dd4-mini.webp","https://i.postimg.cc/fLZ5mSsJ/a36380fca719fcd680815bb6bfd38e95-6998957a4baf5-mini.webp"], description: "Conjunto Legging Básica Martina Compressão Sideral é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M"], paymentLink: "#" },
    { id: 11, name: "Conjunto Short Básico Nala Branco + Preto", category: "Conjuntos de Shorts e Bermuda", price: 170.00, images: ["https://i.postimg.cc/WbDmDwZ9/32d4a6fc75084359b12c75119d84c5c7-698f3d59ce92a-mini.webp","https://i.postimg.cc/Fs2y0kby/5c5b39224797737c7ee4addac9eca42d-698f3d5817ca0-mini.webp","https://i.postimg.cc/VL3qX099/da23c13f94c17e31ed56e83bf73c4d13-698f3d58ef812-mini.webp"], description: "O Conjunto Short Básico Nala Branco + Preto é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" },
    { id: 12, name: "Conjunto Short Básico Fernanda Cacau + Mocca + Pérola", category: "Conjuntos de Shorts e Bermuda", price: 170.00, images: ["https://i.postimg.cc/y8yTBYcB/91f93a0f91304b55a4481ec85f25fb53-6998966ed2f43-mini.webp","https://i.postimg.cc/K8D5FvB2/a1c014ec3bb75e488f877b191ec4e1ca-6998966fad754-mini.webp","https://i.postimg.cc/bw9R8NkP/bfa0faf4d4e8a2251e88c627f89b777d-6998966e27089-mini.webp"], description: "Conjunto Short Básico Fernanda Cacau + Mocca + Pérola é aquela peça que além de linda, oferece suporte e sustentação pra você pegar pesado no treino! Aposte nesse modelo e deixe seu Look Fitness mais moderno. Elaborado em Poliamida, esse conjunto fitness tem ajuste perfeito e é super confortável.", sizes: ["M","G"], paymentLink: "#" }
];

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
window.fazerLogin = function() {
    window.signInWithPopup(window.auth, window.provider)
        .then(res => showToast("Login", `Bem vindo(a), ${res.user.displayName.split(' ')[0]}!`))
        .catch(e => console.error(e));
};
window.toggleUserProfile = function() { document.getElementById('user-menu').classList.toggle('active'); };
window.fazerLogout = function() {
    window.signOut(window.auth).then(() => {
        document.getElementById('user-menu').classList.remove('active');
        showToast("Logout", "Você saiu da conta.");
        window.userProfile = null;
    });
};

window.openProfileModal = function() {
    if(!window.userLogado) return;
    document.getElementById('profile-name').value = window.userLogado.displayName;
    document.getElementById('profile-email').value = window.userLogado.email;
    
    if(window.userProfile) {
        document.getElementById('profile-cep').value = window.userProfile.cep || "";
        document.getElementById('profile-street').value = window.userProfile.street || "";
        document.getElementById('profile-number').value = window.userProfile.number || "";
        document.getElementById('profile-comp').value = window.userProfile.comp || "";
        document.getElementById('profile-neighborhood').value = window.userProfile.neighborhood || "";
        document.getElementById('profile-city').value = window.userProfile.city || "";
        document.getElementById('profile-uf').value = window.userProfile.uf || "";
        document.getElementById('profile-phone').value = window.userProfile.phone || "";
    }
    document.getElementById('user-menu').classList.remove('active');
    document.getElementById('modal-profile').classList.add('active');
};

window.saveUserProfile = async function() {
    const profileData = {
        cep: document.getElementById('profile-cep').value,
        street: document.getElementById('profile-street').value,
        number: document.getElementById('profile-number').value,
        comp: document.getElementById('profile-comp').value,
        neighborhood: document.getElementById('profile-neighborhood').value,
        city: document.getElementById('profile-city').value,
        uf: document.getElementById('profile-uf').value,
        phone: document.getElementById('profile-phone').value,
        email: window.userLogado.email,
        name: window.userLogado.displayName
    };
    
    try {
        await window.setDoc(window.doc(window.db, "users", window.userLogado.uid), profileData, { merge: true });
        window.userProfile = profileData;
        
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
        const q = window.query(window.collection(window.db, "pedidos"), window.where("cliente.uid", "==", window.userLogado.uid));
        const querySnapshot = await window.getDocs(q);
        if(querySnapshot.empty) { container.innerHTML = '<p style="color:#ccc; text-align:center;">Você ainda não fez pedidos.</p>'; return; }
        
        let html = '';
        querySnapshot.forEach((doc) => {
            const p = doc.data();
            const statusClass = p.status === 'Pago' ? 'status-pago' : (p.status === 'Enviado' ? 'status-enviado' : 'status-novo');
            const thumb = (p.itens && p.itens.length > 0 && p.itens[0].images) ? p.itens[0].images[0] : 'https://via.placeholder.com/60';
            
            html += `
            <div class="user-order-item">
                <div style="display:flex; gap:15px; align-items:center;">
                    <img src="${thumb}" style="width: 60px; height: 60px; border-radius: 5px; object-fit: cover; border: 1px solid #444;">
                    <div>
                        <div style="font-weight:bold; color:white; margin-bottom: 5px;">Pedido #${doc.id.slice(0,4).toUpperCase()}</div>
                        <div style="font-size:0.8rem; color:#888;">${p.itens.length} itens - R$ ${p.total.toFixed(2).replace('.', ',')}</div>
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
    
    if(!name) { document.getElementById('cart-sidebar').classList.add('open'); return showWarning("Por favor, preencha o seu Nome Completo!"); }
    if(!street || !num) { document.getElementById('cart-sidebar').classList.add('open'); return showWarning("Preencha seu Endereço (Rua e Número) para a entrega!"); }

    const btn = document.querySelector('.checkout-btn');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;

    const finalAddress = `${street}, ${num} - ${document.getElementById('client-neighborhood').value}, ${document.getElementById('client-city').value}/${document.getElementById('client-uf').value} - CEP: ${document.getElementById('client-cep').value}`;
    const total = cart.reduce((a,b)=>a+(b.price*b.quantity),0);

    const pedido = {
        cliente: { nome: name, uid: window.userLogado ? window.userLogado.uid : 'anonimo', endereco: finalAddress, telefone: window.userProfile?.phone || "Não informado" },
        itens: cart, total: total, pagamento: payment, status: "Novo", data: new Date().toISOString()
    };

    try {
        let pedidoID = "WHATS-" + Math.floor(Math.random()*1000);
        if(window.addDoc) {
            const docRef = await window.addDoc(window.collection(window.db, "pedidos"), pedido);
            pedidoID = docRef.id.slice(0, 5).toUpperCase();
        }

        const phone = "5532984192045";
        
        // MENSAGEM CORRIGIDA E CODIFICADA PERFEITAMENTE
        let msg = `Olá Campbell modas fitness! Novo pedido pelo site (#${pedidoID}):\n\n`;
        msg += `*--- ITENS ---*\n`;
        cart.forEach(i => {
            msg += `🔸 ${i.quantity}x ${i.name} (Tam: ${i.selectedSize}) | R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}\n`;
        });
        msg += `\n*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        msg += `---------------------------------\n`;
        msg += `*DADOS DE ENTREGA:*\n`;
        msg += `👤 Nome: ${name}\n`;
        msg += `📍 Endereço: ${finalAddress}\n`;
        msg += `---------------------------------\n`;
        msg += `💳 PAGAMENTO: ${payment}`;

        // encodeURIComponent garante que o Whatsapp vai ler os espaços, quebras de linha e emojis sem dar o erro ""
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
window.getMediaHTML = function(src, index, fn) {
    if(src.endsWith('.mp4')||src.endsWith('.webm')) return `<video class="product-image" data-index="${index}" autoplay muted loop playsinline onclick="${fn}"><source src="${src}" type="video/mp4"></video>`;
    return `<img src="${src}" class="product-image" data-index="${index}" onclick="${fn}">`;
};

window.createProductCard = function(p) {
    const arrows = p.images.length > 1 ? `<button class="slider-btn prev-btn" onclick="slideImage(event,${p.id},-1)">&#10094;</button><button class="slider-btn next-btn" onclick="slideImage(event,${p.id},1)">&#10095;</button>` : '';
    const media = window.getMediaHTML(p.images[0], 0, `openModal(${p.id})`);
    return `<div class="product-card"><div class="image-slider">${arrows}${media}</div><div class="product-info"><span class="category">${p.category}</span><h3 class="title" onclick="openModal(${p.id})">${p.name}</h3><span class="price">R$ ${p.price.toFixed(2).replace('.', ',')}</span><button class="add-btn" onclick="openModal(${p.id})">VER DETALHES</button></div></div>`;
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
    }, 200);
};

window.openModal = function(id) {
    const p = products.find(prod => prod.id === id); currentModalProduct = p; selectedSize = null;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-category').innerText = p.category;
    document.getElementById('modal-price').innerText = `R$ ${p.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-desc').innerText = p.description;
    
    const container = document.getElementById('main-media-container'); container.innerHTML = '';
    const src = p.images[0];
    if(src.endsWith('.mp4')) container.innerHTML = `<video class="main-modal-img" autoplay muted loop playsinline><source src="${src}"></video>`;
    else container.innerHTML = `<img src="${src}" class="main-modal-img" id="modal-img">`;

    document.getElementById('modal-thumbnails').innerHTML = p.images.map((img, i) => {
        if(img.endsWith('.mp4')) return `<video src="${img}" class="thumb ${i===0?'active':''}" muted onclick="changeModalMedia('${img}', this)"></video>`;
        return `<img src="${img}" class="thumb ${i===0?'active':''}" onclick="changeModalMedia('${img}', this)">`;
    }).join('');

    document.getElementById('modal-sizes').innerHTML = p.sizes.map(s => `<button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>`).join('');
    document.getElementById('fit-result').style.display = 'none';
    document.getElementById('product-modal').classList.add('active');
};

window.changeModalMedia = function(src, thumb) {
    const c = document.getElementById('main-media-container'); c.innerHTML='';
    if(src.endsWith('.mp4')) c.innerHTML=`<video class="main-modal-img" autoplay muted loop><source src="${src}"></video>`; else c.innerHTML=`<img src="${src}" class="main-modal-img">`;
    document.querySelectorAll('.thumb').forEach(t=>t.classList.remove('active')); thumb.classList.add('active');
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

window.toggleCart = function(open) { 
    const sb = document.getElementById('cart-sidebar'); const ov = document.getElementById('overlay');
    if(typeof open === 'boolean'){ if(open){sb.classList.add('open');ov.classList.add('active');}else{sb.classList.remove('open');ov.classList.remove('active');}}
    else{ sb.classList.toggle('open'); ov.classList.toggle('active'); }
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

function initStore() {
    const render = (id, fn) => { const el = document.getElementById(id); if(el) el.innerHTML = products.filter(fn).map(window.createProductCard).join(''); }
    
    render('grid-destaques', ()=>true); 
    render('grid-macacoes', p=>p.category==='Macacões'); 
    render('grid-conjuntos-calca', p=>p.category==='Conjuntos de Calça e Legging'); 
    render('grid-conjuntos-shorts', p=>p.category==='Conjuntos de Shorts e Bermuda');
}
initStore();
