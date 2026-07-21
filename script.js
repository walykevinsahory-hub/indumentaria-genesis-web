const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();


async function loadProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  try {
    const response = await fetch('/data/products.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo cargar el catálogo');

    const data = await response.json();
    const products = (data.products || []).filter(product => product.available !== false);

    if (!products.length) {
      grid.innerHTML = '<p class="catalog-empty">Próximamente publicaremos nuevos productos.</p>';
      return;
    }

    grid.innerHTML = products.map(product => {
      const name = escapeHtml(product.name || 'Producto');
      const description = escapeHtml(product.description || '');
      const price = escapeHtml(product.price || 'Consultar');
      const category = escapeHtml(product.category || 'Producto');
      const image = product.image || '/assets/og-image.jpg';
      const message = encodeURIComponent(
        `Hola Indumentaria Génesis, quiero consultar por: ${product.name || 'un producto'}`
      );

      return `
        <article class="catalog-card ${product.featured ? 'is-featured' : ''}">
          <div class="catalog-image-wrap">
            <img class="catalog-image" src="${image}" alt="${name}" loading="lazy">
            <span class="catalog-category">${category}</span>
            ${product.featured ? '<span class="catalog-featured">Destacado</span>' : ''}
          </div>
          <div class="catalog-info">
            <h3>${name}</h3>
            ${description ? `<p>${description}</p>` : ''}
            <strong>${price}</strong>
            <a class="btn btn-primary catalog-btn"
               href="https://wa.me/543794590601?text=${message}"
               target="_blank" rel="noopener">
              Consultar por WhatsApp
            </a>
          </div>
        </article>
      `;
    }).join('');
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="catalog-empty">No se pudo cargar el catálogo.</p>';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[character]));
}

loadProducts();

if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user && window.location.hash.includes('invite_token')) {
      window.netlifyIdentity.open('signup');
    }
  });
}
