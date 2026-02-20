/* ===============================
   Manjil Mart - Upgraded Version
================================= */

/* ---------- PRODUCT DATA ---------- */
const PRODUCTS = [
  { id: 1, name: "Chilli Powder", price: 199 },
  { id: 2, name: "Turmeric Powder", price: 149 },
  { id: 3, name: "Dhaniya Powder", price: 129 },
  { id: 4, name: "Masala Mix", price: 229 }
];

/* ---------- NAVIGATION ---------- */
function showPage() {
  const hash = location.hash.replace("#", "") || "home";

  document.querySelectorAll(".page").forEach(section => {
    section.style.display = "none";
  });

  const activeSection = document.getElementById(hash);
  if (activeSection) {
    activeSection.style.display = "block";
  }
}

window.addEventListener("hashchange", showPage);
showPage();

/* ---------- PRODUCT RENDERING ---------- */
const grid = document.getElementById("products-grid");

function renderProducts(productList) {
  if (!grid) return;

  grid.innerHTML = "";

  productList.forEach(product => {
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

renderProducts(PRODUCTS);

/* ---------- SEARCH + PRICE FILTER ---------- */
const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("price-filter");

function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();
  const priceValue = priceFilter.value;

  let filtered = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  );

  if (priceValue === "low") {
    filtered = filtered.filter(p => p.price < 150);
  } 
  else if (priceValue === "mid") {
    filtered = filtered.filter(p => p.price >= 150 && p.price <= 200);
  } 
  else if (priceValue === "high") {
    filtered = filtered.filter(p => p.price > 200);
  }

  renderProducts(filtered);
}

if (searchInput) {
  searchInput.addEventListener("input", filterProducts);
}

if (priceFilter) {
  priceFilter.addEventListener("change", filterProducts);
}

/* ---------- CART SYSTEM ---------- */
let cartCount = 0;
const cartCountDisplay = document.getElementById("cart-count");

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-btn")) {
    cartCount++;
    if (cartCountDisplay) {
      cartCountDisplay.textContent = cartCount;
    }
    alert("Product added to cart!");
  }
});
