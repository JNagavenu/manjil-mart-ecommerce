/* Basic frontend-only e-commerce logic.
   - Hash navigation: #home, #products, #login
   - Products rendered from local array
   - Cart stored in localStorage
   - Login simulated in localStorage
*/

const logoPath = "/mnt/data/WhatsApp Image 2025-11-13 at 00.21.22.jpeg";

/* ------- Products data ------- */
const PRODUCTS = [
  {
    id: "chilli-powder",
    name: "Pure Chilli Powder",
    desc: "Pure Chilli Powder from Manjil_PureProducts — rich color & spicy aroma.",
    price: 199.0,
    img: logoPath
  },
  {
    id: "turmeric-powder",
    name: "Turmeric Powder",
    desc: "Premium turmeric powder — bright color and earthy flavor.",
    price: 149.0,
    img: logoPath
  },
  {
    id: "dhaniya-powder",
    name: "Dhaniya Powder",
    desc: "Fresh ground coriander (dhania) — perfect for everyday cooking.",
    price: 129.0,
    img: logoPath
  },
  {
    id: "masala-mix",
    name: "Masala Mix",
    desc: "House special masala mix — balanced spice blend for many dishes.",
    price: 229.0,
    img: logoPath
  }
];

/* ------- Helpers ------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ------- Navigation & sections ------- */
function showSectionFromHash() {
  const hash = location.hash.replace("#", "") || "home";
  $$(".page").forEach(s => s.classList.remove("active"));
  const target = $(#${hash});
  if (target) target.classList.add("active");
  // update active nav link style (simple)
  $$(".nav-link").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + hash));
}
window.addEventListener("hashchange", showSectionFromHash);
showSectionFromHash();

/* ------- Render products ------- */
function createProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-image">
      <img src="${p.img}" alt="${p.name}" />
    </div>
    <div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-meta">
        <div class="price">₹${p.price.toFixed(2)}</div>
        <button class="add-btn" data-id="${p.id}">Add</button>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  const grid = $("#products-grid");
  grid.innerHTML = "";
  PRODUCTS.forEach(p => {
    grid.appendChild(createProductCard(p));
  });
}
renderProducts();

/* ------- Cart logic ------- */
const CART_KEY = "manjil_cart_v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const cart = loadCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  updateCartUI();
}

function removeFromCart(productId) {
  const cart = loadCart();
  delete cart[productId];
  saveCart(cart);
  updateCartUI();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartUI();
}

function cartTotalAndCount(cart) {
  let total = 0, count = 0;
  for (const id in cart) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) continue;
    const q = cart[id];
    total += product.price * q;
    count += q;
  }
  return { total, count };
}

function updateCartUI() {
  const cart = loadCart();
  const { total, count } = cartTotalAndCount(cart);
  $("#cart-count").textContent = count;
  $("#cart-total").textContent = ₹${total.toFixed(2)};

  const container = $("#cart-items");
  container.innerHTML = "";
  if (count === 0) {
    container.innerHTML = <p class="muted" style="padding:18px;text-align:center">Your cart is empty.</p>;
    return;
  }

  for (const id in cart) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) continue;
    const qty = cart[id];

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${product.img}" alt="${product.name}" />
      <div class="cart-item-info">
        <div style="font-weight:700">${product.name}</div>
        <div class="muted">₹${product.price.toFixed(2)} × ${qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="qty-controls">
          <button class="btn decrease" data-id="${id}">-</button>
          <div style="min-width:24px;text-align:center">${qty}</div>
          <button class="btn increase" data-id="${id}">+</button>
        </div>
        <button class="btn" style="margin-top:6px" data-remove="${id}">Remove</button>
      </div>
    `;
    container.appendChild(el);
  }
}

/* event delegation for Add buttons */
document.addEventListener("click", (e) => {
  // Add to cart
  const add = e.target.closest(".add-btn");
  if (add) {
    const id = add.getAttribute("data-id");
    addToCart(id, 1);
    // brief feedback
    add.textContent = "Added";
    setTimeout(() => add.textContent = "Add", 700);
    return;
  }

  // Open cart
  if (e.target.closest("#cart-btn")) {
    openCart();
    return;
  }

  // Close cart
  if (e.target.closest("#close-cart")) {
    closeCart();
    return;
  }

  // Remove item
  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    removeFromCart(removeBtn.getAttribute("data-remove"));
    return;
  }

  // Quantity controls
  if (e.target.closest(".increase") || e.target.closest(".decrease")) {
    const inc = e.target.closest(".increase");
    const dec = e.target.closest(".decrease");
    const id = (inc || dec).getAttribute("data-id");
    const cart = loadCart();
    if (!cart[id]) return;
    if (inc) cart[id] = cart[id] + 1;
    if (dec) cart[id] = Math.max(0, cart[id] - 1);
    if (cart[id] === 0) delete cart[id];
    saveCart(cart);
    updateCartUI();
    return;
  }

  // Clear cart
  if (e.target.id === "clear-cart") {
    clearCart();
    return;
  }

  // Checkout (frontend demo)
  if (e.target.id === "checkout") {
    alert("Checkout simulated — this demo does not process payments. Thank you!");
    clearCart();
    closeCart();
    return;
  }
});

/* cart open/close */
function openCart() {
  const modal = $("#cart-modal");
  modal.setAttribute("aria-hidden", "false");
}
function closeCart() {
  const modal = $("#cart-modal");
  modal.setAttribute("aria-hidden", "true");
}

/* initialize */
updateCartUI();
renderProducts();

/* simple hash nav handling to set active section on page load */
if (!location.hash) location.hash = "#home";

/* Login logic (simulated) */
const USER_KEY = "manjil_user";
$("#login-form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const email = $("#email").value.trim();
  const password = $("#password").value.trim();
  if (!email || password.length < 6) {
    alert("Please enter a valid email and a password with at least 6 characters.");
    return;
  }
  // Simulate login
  localStorage.setItem(USER_KEY, JSON.stringify({ email }));
  updateAuthUI();
  location.hash = "#home";
  alert(Welcome, ${email}!);
});

/* Auth UI updates */
function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  const navLogin = $("#nav-login");
  if (user) {
    navLogin.textContent = user.email.split("@")[0];
    navLogin.href = "#home";
    // allow logout on click
    navLogin.onclick = (e) => {
      e.preventDefault();
      if (confirm("Logout?")) {
        localStorage.removeItem(USER_KEY);
        updateAuthUI();
      }
    };
  } else {
    navLogin.textContent = "Login";
    navLogin.href = "#login";
    navLogin.onclick = null;
  }
}
updateAuthUI();

/* small finishing touches */
document.getElementById("year").textContent = new Date().getFullYear();