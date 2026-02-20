const CART_KEY = "manjil_cart";
const WISHLIST_KEY = "manjil_wishlist";

const state = {
  products: [
    { id: 1, name: "Chilli Powder", price: 199, desc: "Spicy red chilli powder." },
    { id: 2, name: "Turmeric Powder", price: 149, desc: "Pure turmeric." },
    { id: 3, name: "Dhaniya Powder", price: 129, desc: "Fresh coriander." },
    { id: 4, name: "Masala Mix", price: 229, desc: "Premium spice blend." }
  ],
  cart: JSON.parse(localStorage.getItem(CART_KEY)) || [],
  wishlist: JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []
};

const grid = document.getElementById("products-grid");
const detailContainer = document.getElementById("detail-container");
const wishlistContainer = document.getElementById("wishlist-container");
const cartCountDisplay = document.getElementById("cart-count");
const wishlistCountDisplay = document.getElementById("wishlist-count");
const checkoutSummary = document.getElementById("checkout-summary");

/* ROUTING */
function handleRouting() {
  const hash = location.hash || "#home";
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");

  if (hash.startsWith("#detail-")) {
    const id = Number(hash.split("-")[1]);
    renderProductDetail(id);
    document.getElementById("product-detail").style.display = "block";
  } else {
    const page = document.getElementById(hash.replace("#",""));
    if (page) page.style.display = "block";
  }
}
window.addEventListener("hashchange", handleRouting);

/* PRODUCTS */
function renderProducts() {
  grid.innerHTML = "";
  state.products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div>${product.name}</div>
      <div>₹${product.price}</div>
      <button onclick="location.hash='#detail-${product.id}'">View</button>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

/* PRODUCT DETAIL */
function renderProductDetail(id) {
  const product = state.products.find(p => p.id === id);
  detailContainer.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.desc}</p>
    <h3>₹${product.price}</h3>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
    <br/><br/>
    <button onclick="location.hash='#products'">Back</button>
  `;
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

/* CHECKOUT */
function renderCheckout() {
  if (!checkoutSummary) return;
  if (state.cart.length === 0) {
    checkoutSummary.innerHTML = "<p>Your cart is empty.</p>";
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

/* PLACE ORDER */
document.addEventListener("submit", function(e) {
  if (e.target.id === "checkout-form") {
    e.preventDefault();
    state.cart = [];
    saveCart();
    updateCartCount();
    location.hash = "#order-success";
  }
});

/* INIT */
function init() {
  renderProducts();
  updateCartCount();
  handleRouting();
  renderCheckout();
}
init();
