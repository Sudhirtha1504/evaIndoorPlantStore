document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartHeader = document.querySelector('h1');
  const emptyMsg = document.querySelector('p');
  const discountBtn = document.querySelector('.discount-btn');
  const noSavingsBtn = document.querySelector('.no-savings');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartHeader.textContent = 'Shopping Cart (0)';
    emptyMsg.style.display = 'block';
    discountBtn.style.display = 'none';
    noSavingsBtn.style.display = 'block';
    return;
  }

  // Fetch product info
  fetch('json/data.json')
    .then(res => res.json())
    .then(data => {
      const allProducts = data.flatMap(cat =>
        cat.products.map(prod => ({ ...prod, category: cat.categories }))
      );

      cartHeader.textContent = `Shopping Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
      emptyMsg.style.display = 'none';
      noSavingsBtn.style.display = 'none';
      discountBtn.style.display = 'block';

      cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (!product) return;

        const productDiv = document.createElement('div');
        productDiv.className = 'cart-product';
        productDiv.style.marginBottom = '1rem';
        productDiv.innerHTML = `
          <div style="display:flex; align-items:center; gap:1rem;">
            <img src="${product.image}" alt="${product.name}" width="80" />
            <div>
              <h4>${product.name}</h4>
              <p>Qty: ${item.quantity}</p>
              <p>Price: ₹${product.price}</p>
              <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(productDiv);
      });
    });
});

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload(); // reload to update view
}
