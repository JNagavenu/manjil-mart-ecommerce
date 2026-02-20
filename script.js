const CART_KEY = "manjil_cart";

/* PRODUCTS */
const PRODUCTS = [
  {
    id: 1,
    name: "Chilli Powder",
    price: 199,
    desc: "Premium spicy red chilli powder.",
    image: "images/chilli-powder.jpg"
  },
  {
    id: 2,
    name: "Turmeric Powder",
    price: 149,
    desc: "Pure turmeric with rich aroma.",
    image: "images/spice1.jpg"
  },
  {
    id: 3,
    name: "Dhaniya Powder",
    price: 129,
    desc: "Fresh ground coriander powder.",
    image: "images/spice2.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

/* ROUTING */
function showPage() {
  const hash = location.hash || "#home";
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.querySelector(hash);
  if (page) page.classList.add("active");

  if (hash === "#cart") renderCart();
}
window.addEventListener("hashchange", showPage);

/* RENDER PRODUCTS */
function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  PRODUCTS.forEach(product => {
    grid.innerHTML += `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" />
        </div>
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="product-meta">
          <span class="price">₹${product.price}</span>
          <button onclick="addToCart(${product.id})" class="add-btn">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}

/* CART */
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = total;
}

function renderCart() {
  const container = document.getElementById("cart-container");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    const itemTotal = product.price * item.qty;
    total += itemTotal;

    html += `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>${item.qty} × ₹${product.price}</p>
      </div>
    `;
  });

  html += `<h3>Total: ₹${total}</h3>`;
  container.innerHTML = html;
}

/* SEARCH */
document.getElementById("search-input").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = name.includes(value) ? "block" : "none";
  });
});

/* INIT */
renderProducts();
updateCartCount();
showPage();
