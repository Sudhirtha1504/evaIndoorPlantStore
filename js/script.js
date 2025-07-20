

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const pagination = document.getElementById('pagination');

  let allProducts = [];
  let currentCategory = 'XL Indoor Plant'; // default
  let currentPage = 1;
  const itemsPerPage = 16;

  // Fetch JSON and set up everything
  fetch('json/data.json')
    .then(res => res.json())
    .then(data => {
      // Flatten categories
      allProducts = data.flatMap(cat =>
        cat.products.map(prod => ({ ...prod, category: cat.categories }))
      );

      // Load default category products
      displayProducts(filterByCategory(currentCategory), currentPage);

      // Setup category button click events
      const buttons = document.querySelectorAll('[data-category]');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          currentCategory = button.getAttribute('data-category');
          currentPage = 1;
          displayProducts(filterByCategory(currentCategory), currentPage);
        });
      });
    })
    .catch(error => {
      console.error('Failed to fetch products:', error);
      productList.innerHTML = `<p class="text-danger">Failed to load products.</p>`;
    });

  function filterByCategory(category) {
    return allProducts.filter(p => p.category === category);
  }

  function displayProducts(products, page = 1) {
    productList.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = products.slice(start, end);

    if (paginated.length === 0) {
      productList.innerHTML = '<p class="text-center">No products found.</p>';
      pagination.innerHTML = '';
      return;
    }

    paginated.forEach((product, index) => {
      const div = document.createElement('div');
      div.className = 'col-6 col-md-3 col-lg-3 mb-4';
      div.innerHTML = `
    <div class="card h-100 text-center">
<img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover; cursor: pointer;" onclick="location.href='imageview.html?id=${product.id}'">

      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">Brand: ${product.brand}</p>
        <p class="card-text fw-bold">Rs. ${product.price}</p>
        <button class="btn btn-success btn-sm me-2" onclick="addToCart(${product.id}, '${product.category}')">Add to Cart</button>
        <button class="btn btn-outline-danger btn-sm" onclick="wishlist(${product.id})">Wishlist</button>
      </div>
    </div>
  `;
      productList.appendChild(div);

      // Insert offer banner after the 8th item (index starts at 0)
      if (index === 7) {
        const offerDiv = document.createElement('div');
        offerDiv.className = "col-12 my-4 text-center";
        offerDiv.innerHTML = `
      <div class="promo-banner p-4 rounded bg-warning-subtle">
        <h3 class="mb-3"> Pick Any 5 Plants at ₹1549!</h3>
        <a href="#shop" class="btn btn-primary">Shop Now</a>
      </div>
    `;
        productList.appendChild(offerDiv);
      }
    });

    renderPagination(products.length, page);
  }


  function renderPagination(totalItems, currentPage) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = `btn btn-sm mx-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
      btn.textContent = i;
      btn.addEventListener('click', () => {
        displayProducts(filterByCategory(currentCategory), i);
      });
      pagination.appendChild(btn);
    }
  }
});
document.getElementById('profileBtn').addEventListener('click', () => {
  // Check if modal already exists
  if (!document.getElementById('profileModal')) {
    fetch('pop.html')
      .then(response => response.text())
      .then(html => {
        // Create a container and inject modal HTML
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        // Show modal using Bootstrap's modal API
        const modalEl = document.getElementById('profileModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      })
      .catch(err => console.error('Failed to load modal:', err));
  } else {
    // Modal already loaded - just show it
    const modalEl = document.getElementById('profileModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
});


// Dummy handlers
function addToCart(id, category) {
  alert(`Product ${id} from ${category} added to cart.`);
}

function wishlist(id) {
  alert(`Product ${id} added to wishlist.`);
}
