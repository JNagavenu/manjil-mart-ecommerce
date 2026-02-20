const CART_KEY = "manjil_cart";

const state = {
  products: [
    { id: 1, name: "Chilli Powder", price: 199 },
    { id: 2, name: "Turmeric Powder", price: 149 },
    { id: 3, name: "Dhaniya Powder", price: 129 },
    { id: 4, name: "Masala Mix", price: 229 }
  ],
  cart: JSON.parse(localStorage.getItem(CART_KEY)) || []
};

const grid = document.getElementById("products-grid");
const cartContainer = document.getElementById("cart-container");
const checkoutSummary = document.getElementById("checkout-summary");
const cartCountDisplay = document.getElementById("cart-count");

/* ROUTING */
function handleRouting() {
  const hash = location.hash || "#home";
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");

  const page = document.getElementById(hash.replace("#",""));
  if (page) page.style.display = "block";

  if (hash === "#cart") renderCart();
  if (hash === "#checkout") renderCheckout();
}
window.addEventListener("hashchange", handleRouting);

/* PRODUCTS */
function renderProducts() {
  grid.innerHTML = "";
  state.products.forEach(product => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${product.name}</strong> - ₹${product.price}</p>
      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>
      <hr/>
    `;
    grid.appendChild(div);
  });
}

/* CART LOGIC */
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
  if (item) {
    item.quantity++;
    saveCart();
    renderCart();
  }
}

function decreaseQty(id) {
  const item = state.cart.find(i => i.id === id);
  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      removeItem(id);
      return;
    }
    saveCart();
    renderCart();
  }
}

function removeItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
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
        <strong>${product.name}</strong><br/>
        ₹${product.price} × ${item.quantity} = ₹${itemTotal}<br/>
        <button onclick="decreaseQty(${item.id})">-</button>
        <button onclick="increaseQty(${item.id})">+</button>
        <button onclick="removeItem(${item.id})">Remove</button>
        <hr/>
      </li>
    `;
  });

  html += `</ul><h3>Total: ₹${total}</h3>`;

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
  let html = "<ul>";

  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.id);
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    html += `<li>${product.name} x ${item.quantity} = ₹${itemTotal}</li>`;
  });

  html += `</ul><h3>Total: ₹${total}</h3>`;
  checkoutSummary.innerHTML = html;
}

/* INIT */
function init() {
  renderProducts();
  updateCartCount();
  handleRouting();
}
init();
