/* ======================================================= */
/* =============== BEST SELLER PRODUCTS ================== */
/* ======================================================= */


const bestSellerProducts = [
  { img: "assets/images/bestSeller/bestSeller1.png", brand: "Beauty of Joseon", name: "Relief Sun : Rice + Probiotics SPF50+ PA++++" },
  { img: "assets/images/bestSeller/bestSeller2.png", brand: "Dr.Althea", name: "345 Relief Cream" },
  { img: "assets/images/bestSeller/bestSeller3.png", brand: "SKIN1004", name: "Madagascar Centella Ampoule" },
  { img: "assets/images/bestSeller/bestSeller4.png", brand: "Anua", name: "Heartleaf Pore Control Cleansing Oil" },
  { img: "assets/images/bestSeller/bestSeller5.png", brand: "Beauty of Joseon", name: "Revive Eye Serum : Ginseng + Retinal" },
  { img: "assets/images/bestSeller/bestSeller6.png", brand: "Beauty of Joseon", name: "Dynasty Cream" },
  { img: "assets/images/bestSeller/bestSeller7.png", brand: "Anua", name: "Niacinamide 10 TXA 4 Serum" }
];

/* ======= Render da lista de produtos ======= */
const container = document.getElementById('product-list');

function renderBestSellers() {
  if (!container) {
    console.error("Erro: Elemento com ID 'product-list' não encontrado.");
    return;
  }

  const html = bestSellerProducts.map((item, idx) => {
    // tabindex=0 para que cada card seja focável por teclado
    return `
      <article class="card" role="listitem" tabindex="0" aria-label="${escapeHtml(item.brand)} - ${escapeHtml(item.name)}" data-index="${idx}">
        <img src="${item.img}" alt="${escapeHtml(item.brand)} - ${escapeHtml(item.name)}">
        <div class="brand">${escapeHtml(item.brand)}</div>
        <h3>${escapeHtml(item.name)}</h3>
      </article>
    `;
  }).join('');
  container.innerHTML = html;
}

/* util para escapar texto */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

renderBestSellers();

/* ============================================================================================== */
/* ============================================================================================== */
/* ============================================================================================== */
/* ============================================================================================== */
/* ============================================================================================== */


/* ======================================================= */
/* =============== MUST POPULLAR PRODUCTS ================ */
/* ======================================================= */

const mustPopularProducts = [
  { img: "assets/images/mustPopullar/mustPopullar1.png", brand: "EQQUALBERRY"},
  { img: "assets/images/mustPopullar/mustPopullar2.png", brand: "CELIMAX"},
  { img: "assets/images/mustPopullar/mustPopullar3.png", brand: "MEDICUBE"},
  { img: "assets/images/mustPopullar/mustPopullar4.png", brand: "SOME BY MI"}
];

/* ======= Render da lista de produtos ======= */
const containerMustPopullar = document.getElementById('mustPopullar-list');

function renderMustPopullar() {
  if (!containerMustPopullar) {
    console.error("Erro: Elemento com ID 'mustPopullar-list' não encontrado.");
    return;
  }

  const html = mustPopularProducts.map((item, idx) => {
    return `
      <article class="card" role="listitem" tabindex="0" aria-label="${escapeHtml(item.brand)}" data-index="${idx}">
        <img src="${item.img}" alt="${escapeHtml(item.brand)}">
        <div class="brand">${escapeHtml(item.brand)}</div>
      </article>
    `;
  }).join('');

  containerMustPopullar.innerHTML = html;
}

/* util para escapar texto */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

renderMustPopullar();


/* ======= Controles prev / next ======= */
const btnPrev = document.getElementById('scroll-prev');
const btnNext = document.getElementById('scroll-next');

if (btnPrev && btnNext && container) {
  const getGap = () => {
    const cs = getComputedStyle(container);
    const gap = parseFloat(cs.gap || cs['column-gap'] || 24);
    return isNaN(gap) ? 24 : gap;
  };

  function scrollByCard(direction = 'next') {
    const card = container.querySelector('.card');
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = getGap();
    const amount = Math.round(cardWidth + gap);
    const target = direction === 'next' ? container.scrollLeft + amount : container.scrollLeft - amount;
    container.scrollTo({ left: target, behavior: 'smooth' });
  }

  btnPrev.addEventListener('click', () => scrollByCard('prev'));
  btnNext.addEventListener('click', () => scrollByCard('next'));

  function updateButtons() {
    if (!container) return;
    btnPrev.disabled = container.scrollLeft <= 2;
    btnNext.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 2;
  }

  container.addEventListener('scroll', debounce(updateButtons, 50));
  window.addEventListener('resize', debounce(updateButtons, 120));
  // inicial
  updateButtons();
}

/* ======= Keyboard support (left / right) ======= */
/* Se o foco estiver dentro do product-list ou num card, as setas movem a lista */
if (container) {
  container.addEventListener('keydown', (e) => {
    // We only handle ArrowLeft/ArrowRight
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByKey('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByKey('prev');
    } else if (e.key === 'Home') {
      e.preventDefault();
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
      e.preventDefault();
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    }
  });

  function scrollByKey(direction='next') {
    const card = container.querySelector('.card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(container).gap || 24);
    const amount = Math.round(card.getBoundingClientRect().width + (isNaN(gap) ? 24 : gap));
    const target = direction === 'next' ? container.scrollLeft + amount : container.scrollLeft - amount;
    container.scrollTo({ left: target, behavior: 'smooth' });
  }
}

/* ======= Drag-to-scroll (mouse/touch/pointer) ======= */
if (container) {
  let isDown = false;
  let startX;
  let scrollStart;
  let isDragging = false;

  container.addEventListener('pointerdown', (e) => {
    isDown = true;
    isDragging = false;
    container.classList.add('dragging');
    startX = e.clientX;
    scrollStart = container.scrollLeft;
    container.setPointerCapture(e.pointerId);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const x = e.clientX;
    const walk = x - startX;
    if (Math.abs(walk) > 5) isDragging = true;
    container.scrollLeft = scrollStart - walk;
  });

  container.addEventListener('pointerup', (e) => {
    isDown = false;
    container.classList.remove('dragging');
    try { container.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });

  container.addEventListener('pointercancel', () => {
    isDown = false;
    container.classList.remove('dragging');
  });

  // Prevent click activation on cards immediately after dragging
  container.addEventListener('click', (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
}

/* ======= Utility: debounce ======= */
function debounce(fn, wait = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ======= Inicialização final: atualiza estados ======= */
window.addEventListener('load', () => {
  // Trigger a small update on buttons if exist
  if (typeof updateButtons === 'function') {
    try { updateButtons(); } catch(e) {}
  }
});
