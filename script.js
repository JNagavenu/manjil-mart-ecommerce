const CART_KEY = "manjil_cart";
const THEME_KEY = "manjil_theme";

const state = {
  products: [
    {
      id: 1,
      name: "Chilli Powder",
      price: 199,
      rating: 4.5,
      desc: "Premium spicy red chilli powder.",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Turmeric Powder",
      price: 149,
      rating: 4.7,
      desc: "Pure turmeric with rich aroma.",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Dhaniya Powder",
      price: 129,
      rating: 4.3,
      desc: "Fresh ground coriander powder.",
      image: "https://via.placeholder.com/150"
    }
  ],
  cart: JSON.parse(localStorage.getItem(CART_KEY)) || []
};

const grid = document.getElementById("products-grid");
const detailContainer = document.getElementById("detail-container");
const cartContainer = document.getElementById("cart-container");
const cartCount = document.getElementById("cart-count");
const themeToggle = document.getElementById("theme-toggle");

/* ROUTING */
function route() {
  const hash = location.hash || "#home";
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");

  if (hash.startsWith("#product-")) {
    const id = parseInt(hash.split("-")[1]);
    renderDetail(id);
    document.getElementById("product-detail").style.display = "block";
  } else {
    const page = document.getElementById(hash.replace("#",""));
    if (page) page.style.display = "block";
  }

  if (hash === "#cart") renderCart();
}
window.addEventListener("hashchange", route);

/* PRODUCTS */
function renderProducts() {
  const search = document.getElementById("search-input")?.value?.toLowerCase() || "";
  const sort = document.getElementById("sort-select")?.value || "default";

  let filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(search)
  );

  if (sort === "low-high") filtered.sort((a,b)=>a.price-b.price);
  if (sort === "high-low") filtered.sort((a,b)=>b.price-a.price);

  grid.innerHTML = "";

  filtered.forEach(product => {
    grid.innerHTML += `
      <div class="card">
        <img src="${product.image}" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <p>⭐ ${product.rating}</p>
        <button onclick="location.hash='#product-${product.id}'">
          View Details
        </button>
      </div>
    `;
  });
}

/* DETAIL PAGE */
function renderDetail(id) {
  const product = state.products.find(p => p.id === id);

  detailContainer.innerHTML = `
    <div class="detail">
      <img src="${product.image}" />
      <h2>${product.name}</h2>
      <p>${product.desc}</p>
      <p>⭐ ${product.rating}</p>
      <h3>₹${product.price}</h3>
      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>
      <br/><br/>
      <button onclick="location.hash='#products'">
        Back
      </button>
    </div>
  `;
}

/* CART */
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function addToCart(id) {
  const existing = state.cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else state.cart.push({ id, qty: 1 });

  saveCart();
  updateCartCount();
}

function updateCartCount() {
  const total = state.cart.reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = total;
}

function renderCart() {
  if (state.cart.length === 0) {
    cartContainer.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  let total = 0;
  let html = "";

  state.cart.forEach(item => {
    const product = state.products.find(p=>p.id===item.id);
    const itemTotal = product.price * item.qty;
    total += itemTotal;

    html += `
      <div class="card">
        <p>${product.name}</p>
        <p>${item.qty} × ₹${product.price}</p>
      </div>
    `;
  });

  html += `<h3>Total: ₹${total}</h3>`;
  cartContainer.innerHTML = html;
}

/* DARK MODE */
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
}

themeToggle.onclick = () => {
  const current = localStorage.getItem(THEME_KEY) || "light";
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
};

applyTheme(localStorage.getItem(THEME_KEY) || "light");

/* SEARCH + SORT */
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
  route();
}
init();
