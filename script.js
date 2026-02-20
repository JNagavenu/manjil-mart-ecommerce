const CART_KEY = "manjil_cart";
const ORDERS_KEY = "manjil_orders";

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
  grid.innerHTML = "";
  state.products.forEach(product => {
    grid.innerHTML += `
      <div>
        <p><strong>${product.name}</strong> - ₹${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <hr/>
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

function updateCartCount() {
  const total = state.cart.reduce((s,i)=>s+i.quantity,0);
  cartCountDisplay.textContent = total;
}

function renderCart() {
  if (state.cart.length === 0) {
    cartContainer.innerHTML = "<p>Cart is empty 🛒</p>";
    updateCartCount();
    return;
  }

  let total = 0;
  let html = "<ul>";

  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.id);
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    html += `
      <li>
        ${product.name} x ${item.quantity} = ₹${itemTotal}
        <button onclick="removeItem(${item.id})">Remove</button>
      </li>
    `;
  });

  html += `</ul><h3>Total: ₹${total}</h3>
           <button onclick="placeOrder()">Place Order</button>`;

  cartContainer.innerHTML = html;
  updateCartCount();
}

function removeItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

/* ORDER SYSTEM */
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
    html += `<div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
              <strong>Order ID:</strong> ${order.id}<br/>
              <strong>Date:</strong> ${order.date}<br/>
              <ul>`;

    order.items.forEach(item => {
      const product = state.products.find(p => p.id === item.id);
      html += `<li>${product.name} x ${item.quantity}</li>`;
    });

    html += `</ul></div>`;
  });

  ordersContainer.innerHTML = html;
}

/* INIT */
function init() {
  renderProducts();
  updateCartCount();
  handleRouting();
}
init();
