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
    image: "images/turmeric-powder.jpg"
  },
  {
    id: 3,
    name: "Dhaniya Powder",
    price: 129,
    desc: "Fresh ground coriander powder.",
    image: "images/dhaniya-powder.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function showPage() {
  const hash = location.hash || "#home";

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  const active = document.querySelector(hash);
  if (active) active.classList.add("active");

  if (hash === "#cart") renderCart();
}

window.addEventListener("hashchange", showPage);

function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  PRODUCTS.forEach(p => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <strong>₹${p.price}</strong>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = totalItems;
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
    total += product.price * item.qty;

    html += `
      <div class="card">
        <h3>${product.name}</h3>
        <p>${item.qty} × ₹${product.price}</p>
      </div>
    `;
  });

  html += `<h3>Total: ₹${total}</h3>`;
  container.innerHTML = html;
}

document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  document.querySelectorAll(".card").forEach(card => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = name.includes(value) ? "block" : "none";
  });
});

renderProducts();
updateCartCount();
showPage();
