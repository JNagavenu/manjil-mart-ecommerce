/* SIMPLE WORKING VERSION */

const PRODUCTS = [
  { name: "Chilli Powder", price: 199 },
  { name: "Turmeric Powder", price: 149 },
  { name: "Dhaniya Powder", price: 129 },
  { name: "Masala Mix", price: 229 }
];

/* Navigation */
function showPage() {
  const hash = location.hash.replace("#", "") || "home";
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  const active = document.getElementById(hash);
  if (active) active.style.display = "block";
}

window.addEventListener("hashchange", showPage);
showPage();

/* Render Products */
const grid = document.getElementById("products-grid");

function renderProducts(list) {
  grid.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <div class="product-name">${p.name}</div>
      <div>₹${p.price}</div>
    `;
    grid.appendChild(div);
  });
}

renderProducts(PRODUCTS);

/* Search */
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function () {
  const value = searchInput.value.toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});
