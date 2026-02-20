/* ================================
   Manjil Mart v4 - Product Detail
================================= */

const CART_KEY = "manjil_cart";

const state = {
  products: [
    { id: 1, name: "Chilli Powder", price: 199, desc: "Spicy red chilli powder." },
    { id: 2, name: "Turmeric Powder", price: 149, desc: "Pure turmeric with rich color." },
    { id: 3, name: "Dhaniya Powder", price: 129, desc: "Fresh ground coriander." },
    { id: 4, name: "Masala Mix", price: 229, desc: "Premium house spice blend." }
  ],
  cart: JSON.parse(localStorage.getItem(CART_KEY)) || [],
  search: "",
  priceFilter: "all"
};

/* SELECTORS */
const grid = document.getElementById("products-grid");
const detailContainer = document.getElementById("detail-container");
const cartCountDisplay = document.getElementById("cart-count");

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

/* RENDER PRODUCTS */
function renderProducts() {
  grid.innerHTML = "";
  state.products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-name">${product.name}</div>
      <div>₹${product.price}</div>
      <button onclick="location.hash='#detail-${product.id}'">
        View Details
      </button>
    `;
    grid.appendChild(card);
  });
}

/* PRODUCT DETAIL */
function renderProductDetail(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  detailContainer.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.desc}</p>
    <h3>₹${product.price}</h3>
    <button onclick="addToCart(${product.id})">
      Add to Cart
    </button>
    <br/><br/>
    <button onclick="location.hash='#products'">
      Back to Products
    </button>
  `;
}

/* CART */
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function addToCart(id) {
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    state.cart.push({ id, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  alert("Added to cart!");
}

function updateCartCount() {
  const total = state.cart.reduce((sum,i)=>sum+i.quantity,0);
  cartCountDisplay.textContent = total;
}

/* INIT */
function init() {
  renderProducts();
  updateCartCount();
  handleRouting();
}

init();
