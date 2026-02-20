/* ================================
   Manjil Mart v2 - Pro Structure
================================= */

/* ---------- APP STATE ---------- */
const state = {
  products: [
    { id: 1, name: "Chilli Powder", price: 199 },
    { id: 2, name: "Turmeric Powder", price: 149 },
    { id: 3, name: "Dhaniya Powder", price: 129 },
    { id: 4, name: "Masala Mix", price: 229 }
  ],
  cart: [],
  search: "",
  priceFilter: "all"
};

/* ---------- SELECTORS ---------- */
const grid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("price-filter");
const cartCountDisplay = document.getElementById("cart-count");

/* ---------- NAVIGATION ---------- */
function handleRouting() {
  const hash = location.hash.replace("#", "") || "home";

  document.querySelectorAll(".page").forEach(section => {
    section.style.display = "none";
  });

  const active = document.getElementById(hash);
  if (active) active.style.display = "block";
}

window.addEventListener("hashchange", handleRouting);

/* ---------- FILTER LOGIC ---------- */
function getFilteredProducts() {
  let filtered = [...state.products];

  if (state.search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(state.search)
    );
  }

  if (state.priceFilter === "low") {
    filtered = filtered.filter(p => p.price < 150);
  } 
  else if (state.priceFilter === "mid") {
    filtered = filtered.filter(p => p.price >= 150 && p.price <= 200);
  } 
  else if (state.priceFilter === "high") {
    filtered = filtered.filter(p => p.price > 200);
  }

  return filtered;
}

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const products = getFilteredProducts();
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-name">${product.name}</div>
      <div class="price">₹${product.price}</div>
      <button class="add-btn" data-id="${product.id}">
        Add to Cart
      </button>
    `;

    grid.appendChild(card);
  });
}

/* ---------- CART LOGIC ---------- */
function addToCart(productId) {
  const existing = state.cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  updateCartCount();
}

function updateCartCount() {
  const total = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountDisplay.textContent = total;
}

/* ---------- EVENT LISTENERS ---------- */
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-btn")) {
    const id = Number(e.target.getAttribute("data-id"));
    addToCart(id);
  }
});

if (searchInput) {
  searchInput.addEventListener("input", function() {
    state.search = searchInput.value.toLowerCase();
    renderProducts();
  });
}

if (priceFilter) {
  priceFilter.addEventListener("change", function() {
    state.priceFilter = priceFilter.value;
    renderProducts();
  });
}

/* ---------- INIT ---------- */
function init() {
  handleRouting();
  renderProducts();
  updateCartCount();
}

init();
