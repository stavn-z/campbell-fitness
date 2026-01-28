// 1. PRODUTOS (Exemplos)
const products = [
    { 
        id: 1, 
        name: "Conjunto Power Sculpt - Preto", 
        category: "Conjuntos", 
        price: 249.90, 
        images: ["https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800", "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800"], 
        description: "Tecido de alta compressão. Tecnologia DryFit.", sizes: ["P", "M", "G", "GG"], paymentLink: "#"
    },
    { 
        id: 2, 
        name: "Legging Neon", 
        category: "Leggings", 
        price: 129.90, 
        images: ["https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800"], 
        description: "Brilha na luz negra.", sizes: ["P", "M", "G"], paymentLink: "#" 
    },
    { 
        id: 3, 
        name: "Top Cross Back", 
        category: "Tops", 
        price: 89.90, 
        images: ["https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800"], 
        description: "Alta sustentação.", sizes: ["P", "M", "G"], paymentLink: "#" 
    }
];

let cart = [];
let currentModalProduct = null;
let selectedSize = null;

// AUXILIARES
function getMediaHTML(src, index, fn) {
    if(src.endsWith('.mp4')||src.endsWith('.webm')) return `<video class="product-image" data-index="${index}" autoplay muted loop playsinline onclick="${fn}"><source src="${src}" type="video/mp4"></video>`;
    return `<img src="${src}" class="product-image" data-index="${index}" onclick="${fn}">`;
}

// 2. BUSCA DE CEP (ViaCEP API)
function buscarCep() {
    const cep = document.getElementById('client-cep').value.replace(/\D/g, '');
    if (cep.length === 8) {
        // Feedback visual
        document.getElementById('client-street').value = "Buscando...";
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('client-street').value = data.logradouro;
                    document.getElementById('client-neighborhood').value = data.bairro;
                    document.getElementById('client-city').value = data.localidade;
                    document.getElementById('client-uf').value = data.uf;
                    document.getElementById('client-number').focus(); // Pula para o número
                } else {
                    alert("CEP não encontrado.");
                    document.getElementById('client-street').value = "";
                }
            })
            .catch(() => alert("Erro ao buscar CEP."));
    }
}

// 3. RENDERIZAÇÃO
function createProductCard(p) {
    const arrows = p.images.length > 1 ? `<button class="slider-btn prev-btn" onclick="slideImage(event,${p.id},-1)">&#10094;</button><button class="slider-btn next-btn" onclick="slideImage(event,${p.id},1)">&#10095;</button>` : '';
    const media = getMediaHTML(p.images[0], 0, `openModal(${p.id})`);
    return `<div class="product-card"><div class="image-slider">${arrows}${media}</div><div class="product-info"><span class="category">${p.category}</span><h3 class="title" onclick="openModal(${p.id})">${p.name}</h3><span class="price">R$ ${p.price.toFixed(2).replace('.', ',')}</span><button class="add-btn" onclick="openModal(${p.id})">VER DETALHES</button></div></div>`;
}

function slideImage(e, pid, dir) {
    e.stopPropagation();
    const card = e.target.closest('.product-card');
    const media = card.querySelector('.product-image');
    const p = products.find(prod => prod.id === pid);
    let idx = parseInt(media.getAttribute('data-index')) + dir;
    if(idx < 0) idx = p.images.length -1; if(idx >= p.images.length) idx = 0;
    
    media.style.opacity = '0';
    setTimeout(() => {
        const wrapper = card.querySelector('.image-slider');
        media.remove();
        const src = p.images[idx];
        let newMedia = (src.endsWith('.mp4')) ? document.createElement('video') : document.createElement('img');
        newMedia.className = 'product-image';
        newMedia.setAttribute('data-index', idx);
        newMedia.onclick = () => openModal(pid);
        if(newMedia.tagName === 'VIDEO') { newMedia.autoplay = true; newMedia.muted = true; newMedia.loop = true; newMedia.innerHTML = `<source src="${src}">`; } else { newMedia.src = src; }
        wrapper.appendChild(newMedia);
        setTimeout(() => newMedia.style.opacity = '1', 10);
    }, 200);
}

function initStore() {
    const render = (id, fn) => { const el = document.getElementById(id); if(el) el.innerHTML = products.filter(fn).map(createProductCard).join(''); }
    render('grid-destaques', ()=>true); render('grid-conjuntos', p=>p.category==='Conjuntos'); render('grid-tops', p=>p.category==='Tops'); render('grid-leggings', p=>p.category==='Leggings');
}

// 4. MODAL & CARRINHO
function openModal(id) {
    const p = products.find(prod => prod.id === id);
    currentModalProduct = p; selectedSize = null;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-category').innerText = p.category;
    document.getElementById('modal-price').innerText = `R$ ${p.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-desc').innerText = p.description;
    
    const buyBtn = document.getElementById('modal-buy-link');
    if(p.paymentLink && p.paymentLink !== "#") { buyBtn.href = p.paymentLink; buyBtn.style.display='flex'; } else { buyBtn.style.display='none'; }

    const container = document.getElementById('main-media-container');
    container.innerHTML = '';
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
}

function closeModal() { document.getElementById('product-modal').classList.remove('active'); }
function changeModalMedia(src, thumb) {
    const c = document.getElementById('main-media-container'); c.innerHTML='';
    if(src.endsWith('.mp4')) c.innerHTML=`<video class="main-modal-img" autoplay muted loop><source src="${src}"></video>`; else c.innerHTML=`<img src="${src}" class="main-modal-img">`;
    document.querySelectorAll('.thumb').forEach(t=>t.classList.remove('active')); thumb.classList.add('active');
}
function selectSize(s, btn) { selectedSize = s; document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); }

function calculateSize() {
    const h = parseFloat(document.getElementById('fit-height').value); const w = parseFloat(document.getElementById('fit-weight').value); const r = document.getElementById('fit-result');
    if(!h||!w) { r.style.display='block'; r.innerText="Preencha altura e peso"; r.style.color="red"; return; }
    let s="U"; if(w<53)s="P"; else if(w<64)s="M"; else if(w<74)s="G"; else if(w<95)s="GG"; else s="Consulte";
    r.style.display='block'; r.innerHTML = s==="Consulte" ? "Fale conosco." : `✨ Ideal: <strong>${s}</strong>`; r.style.color = "#25D366";
}

function addModalToCart() {
    if(!selectedSize) { document.getElementById('warning-modal').classList.add('active'); return; }
    const key = `${currentModalProduct.id}-${selectedSize}`;
    const item = cart.find(i=>i.key===key);
    if(item) item.quantity++; else cart.push({...currentModalProduct, key, selectedSize, quantity:1});
    updateCartUI(); closeModal(); toggleCart(true);
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((acc,i)=>acc+i.quantity,0);
    document.getElementById('cart-items').innerHTML = cart.map(i => {
        const img = i.images[0].endsWith('.mp4') ? `<video src="${i.images[0]}" style="width:60px;height:60px;object-fit:cover;border-radius:5px"></video>` : `<img src="${i.images[0]}">`;
        return `<div class="cart-item">${img}<div class="cart-item-info"><h4>${i.name}</h4><p>Tam: ${i.selectedSize}</p><p>${i.quantity}x R$ ${i.price.toFixed(2)}</p><span class="remove-item" onclick="removeFromCart('${i.key}')">Remover</span></div></div>`;
    }).join('');
    document.getElementById('cart-total').innerText = `R$ ${cart.reduce((acc,i)=>acc+(i.price*i.quantity),0).toFixed(2).replace('.', ',')}`;
}
function removeFromCart(key) { cart=cart.filter(i=>i.key!==key); updateCartUI(); }
function toggleCart(open) { const sb=document.getElementById('cart-sidebar'); const ov=document.getElementById('overlay'); if(open){sb.classList.add('open');ov.classList.add('active');}else{sb.classList.toggle('open');ov.classList.toggle('active');} }

// 5. CHECKOUT WHATSAPP COMPLETO
function checkoutWhatsApp() {
    if(cart.length===0) { alert("Carrinho vazio!"); return; }
    
    // Captura campos
    const name = document.getElementById('client-name').value;
    const cep = document.getElementById('client-cep').value;
    const street = document.getElementById('client-street').value;
    const num = document.getElementById('client-number').value;
    const comp = document.getElementById('client-comp').value;
    const neigh = document.getElementById('client-neighborhood').value;
    const city = document.getElementById('client-city').value;
    const uf = document.getElementById('client-uf').value;
    const payment = document.getElementById('client-payment').value;

    if(!name || !cep || !street || !num || !payment) { alert("Por favor, preencha todos os dados de entrega!"); return; }

    const phone = "5532984192045";
    let msg = `Olá Campbell! Novo pedido pelo site:%0A%0A*--- ITENS ---*%0A`;
    cart.forEach(i => msg += `▪️ ${i.quantity}x ${i.name} (Tam: ${i.selectedSize}) | R$ ${i.price.toFixed(2)}%0A`);
    
    const total = cart.reduce((acc,i)=>acc+(i.price*i.quantity),0);
    msg += `%0A*💰 TOTAL: R$ ${total.toFixed(2)}*%0A`;
    msg += `---------------------------------%0A*📦 DADOS DE ENTREGA:*%0A`;
    msg += `👤 *Nome:* ${name}%0A`;
    msg += `📍 *Endereço:* ${street}, ${num} ${comp ? '- ' + comp : ''}%0A`;
    msg += `🏙️ *Bairro:* ${neigh} | ${city}-${uf}%0A`;
    msg += `📮 *CEP:* ${cep}%0A`;
    msg += `---------------------------------%0A`;
    msg += `💳 *PAGAMENTO:* ${payment}`;

    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// 6. UTILITÁRIOS
function closeWarning() { document.getElementById('warning-modal').classList.remove('active'); }
function openInstitutional(id) { document.getElementById(id).classList.add('active'); }
function closeInstitutional(id) { document.getElementById(id).classList.remove('active'); }
window.onclick = e => { 
    if(e.target.classList.contains('info-modal-overlay') || e.target.classList.contains('warning-overlay')) e.target.classList.remove('active'); 
    if(e.target.classList.contains('modal-overlay')) closeModal(); 
};

initStore();