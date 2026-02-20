/* ================================
   Manjil Mart v3 - Premium UI
================================= */

const CART_KEY = "manjil_cart";

/* ---------- APP STATE ---------- */
const state = {
  products: [
    { id: 1, name: "Chilli Powder", price: 199 },
    { id: 2, name: "Turmeric Powder", price: 149 },
    { id: 3, name: "Dhaniya Powder", price: 129 },
    { id: 4, name: "Masala Mix", price: 229 }
  ],
  cart: JSON.parse(localStorage.getItem(CART_KEY)) || [],
  search: "",
  priceFilter: "all"
};

/* ---------- SELECTORS ---------- */
const grid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("price-filter");
const cartCountDisplay = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");

/* ---------- ROUTING ---------- */
function handleRouting() {
  const hash = location.hash.replace("#", "") || "home";
  document.querySelectorAll(".page").forEach(sec => sec.style.display = "none");
  const active = document.getElementById(hash);
  if (active) active.style.display = "block";
}

window.addEventListener("hashchange", handleRouting);

/* ---------- TOAST SYSTEM ---------- */
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ---------- FILTER ---------- */
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
    filtered = filtered.filter(p => p.price <= 200 && p.price >= 150);
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

/* ---------- CART ---------- */
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function addToCart(productId) {
  const existing = state.cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast("Added to cart ✔");
}

function updateCartCount() {
  const total = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountDisplay.textContent = total;
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML =
      `<p style="text-align:center;color:#777;padding:20px">
        Your cart is empty 🛒
       </p>`;
    cartTotalDisplay.textContent = "₹0";
    updateCartCount();
    return;
  }

  let total = 0;

  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.id);
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div><strong>${product.name}</strong></div>
      <div>
        <button class="decrease" data-id="${item.id}">-</button>
        ${item.quantity}
        <button class="increase" data-id="${item.id}">+</button>
      </div>
      <div>₹${itemTotal}</div>
      <button class="remove" data-id="${item.id}">✕</button>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotalDisplay.textContent = "₹" + total;
  updateCartCount();
}

/* ---------- EVENTS ---------- */
document.addEventListener("click", function(e) {

  if (e.target.classList.contains("add-btn")) {
    addToCart(Number(e.target.dataset.id));
  }

  if (e.target.id === "cart-btn") {
    cartModal.setAttribute("aria-hidden", "false");
  }

  if (e.target.id === "close-cart") {
    cartModal.setAttribute("aria-hidden", "true");
  }

  if (e.target.classList.contains("increase")) {
    const item = state.cart.find(i => i.id === Number(e.target.dataset.id));
    item.quantity++;
    saveCart();
    renderCart();
  }

  if (e.target.classList.contains("decrease")) {
    const item = state.cart.find(i => i.id === Number(e.target.dataset.id));
    if (item.quantity > 1) item.quantity--;
    saveCart();
    renderCart();
  }

  if (e.target.classList.contains("remove")) {
    state.cart = state.cart.filter(i => i.id !== Number(e.target.dataset.id));
    saveCart();
    renderCart();
    showToast("Item removed ❌");
  }

  if (e.target.id === "clear-cart") {
    state.cart = [];
    saveCart();
    renderCart();
    showToast("Cart cleared 🗑");
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
  renderCart();
}

init();
