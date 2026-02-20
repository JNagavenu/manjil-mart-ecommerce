/* ===============================
   Manjil Mart - Frontend Logic
================================= */

/* ------- Image Path (IMPORTANT FIX) ------- */
const logoPath = "images/spice1.jpg";

/* ------- Products Data ------- */
const PRODUCTS = [
  {
    id: "chilli-powder",
    name: "Pure Chilli Powder",
    desc: "Rich color & spicy aroma.",
    price: 199.0,
    img: logoPath
  },
  {
    id: "turmeric-powder",
    name: "Turmeric Powder",
    desc: "Premium turmeric powder — bright & earthy.",
    price: 149.0,
    img: logoPath
  },
  {
    id: "dhaniya-powder",
    name: "Dhaniya Powder",
    desc: "Fresh ground coriander for daily cooking.",
    price: 129.0,
    img: logoPath
  },
  {
    id: "masala-mix",
    name: "Masala Mix",
    desc: "Balanced spice blend for many dishes.",
    price: 229.0,
    img: logoPath
  }
];

/* ------- Helpers ------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ===============================
   HASH NAVIGATION
================================= */

function showSectionFromHash() {
  const hash = location.hash.replace("#", "") || "home";

  $$(".page").forEach(sec => sec.classList.remove("active"));

  const target = document.getElementById(hash);
  if (target) target.classList.add("active");
}

window.addEventListener("hashchange", showSectionFromHash);
showSectionFromHash();

/* ===============================
   PRODUCT RENDERING
================================= */

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
  if (!grid) return;

  grid.innerHTML = "";
  PRODUCTS.forEach(p => {
    grid.appendChild(createProductCard(p));
  });
}

renderProducts();

/* ===============================
   CART LOGIC
================================= */

const CART_KEY = "manjil_cart_v1";

function loadCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartUI();
}

function updateCartUI() {
  const cart = loadCart();
  let totalCount = 0;

  for (let id in cart) {
    totalCount += cart[id];
  }

  const cartCount = $("#cart-count");
  if (cartCount) cartCount.textContent = totalCount;
}

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-btn");
  if (addBtn) {
    const id = addBtn.getAttribute("data-id");
    addToCart(id);
  }
});

updateCartUI();

/* ===============================
   SEARCH FEATURE (FIXED)
================================= */

const searchInput = document.getElementById("search-input");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
      const productName = product
        .querySelector(".product-name")
        .innerText
        .toLowerCase();

      if (productName.includes(searchValue)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
}

/* ===============================
   FOOTER YEAR
================================= */

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
