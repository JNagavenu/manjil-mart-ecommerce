const CART_KEY = "manjil_cart";
const ORDERS_KEY = "manjil_orders";
const THEME_KEY = "manjil_theme";

const state = {
  products: [
    { id: 1, name: "Chilli Powder", price: 199 },
    { id: 2, name: "Turmeric Powder", price: 149 },
    { id: 3, name: "Dhaniya Powder", price: 129 },
    { id: 4, name: "Masala Mix", price: 229 }
  ],
  cart: JSON.parse(localStorage.getItem(CART_KEY)) || [],
  orders: JSON.parse(localStorage.getItem(ORDERS_KEY)) || []
};

const grid = document.getElementById("products-grid");
const cartContainer = document.getElementById("cart-container");
const checkoutSummary = document.getElementById("checkout-summary");
const ordersContainer = document.getElementById("orders-container");
const cartCountDisplay = document.getElementById("cart-count");
const themeToggle = document.getElementById("theme-toggle");

/* ROUTING */
function handleRouting() {
  const hash = location.hash || "#home";
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");

  const page = document.getElementById(hash.replace("#",""));
  if (page) page.style.display = "block";

  if (hash === "#cart") renderCart();
  if (hash === "#checkout") renderCheckout();
  if (hash === "#orders") renderOrders();
}
window.addEventListener("hashchange", handleRouting);

/* PRODUCTS */
function renderProducts() {
  const searchValue = document.getElementById("search-input")?.value?.toLowerCase() || "";
  const sortValue = document.getElementById("sort-select")?.value || "default";

  let filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(searchValue)
  );

  if (sortValue === "low-high") filtered.sort((a,b)=>a.price-b.price);
  if (sortValue === "high-low") filtered.sort((a,b)=>b.price-a.price);

  grid.innerHTML = "";

  filtered.forEach(product => {
    grid.innerHTML += `
      <div class="card">
        <p><strong>${product.name}</strong></p>
        <p>₹${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

/* CART */
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function addToCart(id) {
  const existing = state.cart.find(i => i.id === id);
  if (existing) existing.quantity++;
  else state.cart.push({ id, quantity: 1 });
  saveCart();
  updateCartCount();
}

function increaseQty(id) {
  const item = state.cart.find(i => i.id === id);
  item.quantity++;
  saveCart();
  renderCart();
}

function decreaseQty(id) {
  const item = state.cart.find(i => i.id === id);
  if (item.quantity > 1) item.quantity--;
  else state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function updateCartCount() {
  const total = state.cart.reduce((s,i)=>s+i.quantity,0);
  cartCountDisplay.textContent = total;
}

function renderCart() {
  if (state.cart.length === 0) {
    cartContainer.innerHTML = "<p>Cart is empty</p>";
    updateCartCount();
    return;
  }

  let total = 0;
  let html = "";

  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.id);
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="card">
        <p>${product.name}</p>
        <p>₹${product.price} × ${item.quantity} = ₹${itemTotal}</p>
        <button onclick="decreaseQty(${item.id})">-</button>
        <button onclick="increaseQty(${item.id})">+</button>
      </div>
    `;
  });

  html += `<h3>Total: ₹${total}</h3>
           <button onclick="placeOrder()">Place Order</button>`;

  cartContainer.innerHTML = html;
  updateCartCount();
}

/* CHECKOUT */
function renderCheckout() {
  if (state.cart.length === 0) {
    checkoutSummary.innerHTML = "<p>No items to checkout</p>";
    return;
  }

  let total = 0;
  let html = "";

  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.id);
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    html += `<p>${product.name} x ${item.quantity} = ₹${itemTotal}</p>`;
  });

  html += `<h3>Total: ₹${total}</h3>`;
  checkoutSummary.innerHTML = html;
}

/* ORDERS */
function saveOrders() {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
}

function placeOrder() {
  if (state.cart.length === 0) return;

  const order = {
    id: "ORD" + Date.now(),
    items: [...state.cart],
    date: new Date().toLocaleString()
  };

  state.orders.push(order);
  saveOrders();

  state.cart = [];
  saveCart();
  updateCartCount();

  location.hash = "#orders";
}

function renderOrders() {
  if (state.orders.length === 0) {
    ordersContainer.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  let html = "";

  state.orders.forEach(order => {
    html += `
      <div class="card">
        <p><strong>${order.id}</strong></p>
        <p>${order.date}</p>
      </div>
    `;
  });

  ordersContainer.innerHTML = html;
}

/* DARK MODE */
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
}

themeToggle.addEventListener("click", () => {
  const current = localStorage.getItem(THEME_KEY) || "light";
  const newTheme = current === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
});

applyTheme(localStorage.getItem(THEME_KEY) || "light");

/* SEARCH + SORT EVENTS */
document.addEventListener("input", e => {
  if (e.target.id === "search-input") renderProducts();
});

document.addEventListener("change", e => {
  if (e.target.id === "sort-select") renderProducts();
});

/* INIT */
function init() {
  renderProducts();
  updateCartCount();
  handleRouting();
}
init();
