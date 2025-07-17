
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("hidden");
});


document.addEventListener("DOMContentLoaded", () => {
  const storedName = localStorage.getItem("username");
  const storedProduct = localStorage.getItem("product");
  const notification = document.getElementById("notification");
  const messageBox = document.getElementById("notificationMessage");

  if (storedName && storedProduct) {
    messageBox.textContent = `Welcome back, ${storedName}! You were interested in ${storedProduct}.`;
    notification.classList.remove("hidden");
    notification.classList.add("opacity-100");

    setTimeout(() => {
      notification.classList.add("opacity-0");
      setTimeout(() => {
        notification.classList.add("hidden");
        notification.classList.remove("opacity-100", "opacity-0");
      }, 500);
    }, 4000);
  }


  fetchProducts();
});

const form = document.getElementById("interestForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const product = document.getElementById("product").value;
  localStorage.setItem("username", username);
  localStorage.setItem("product", product);
  alert("Thank you for your interest!");
  form.reset();
});

const getLocationBtn = document.getElementById("get-location");
getLocationBtn.addEventListener("click", () => {
  const output = document.getElementById("location-output");
  if (!navigator.geolocation) {
    output.textContent = "Geolocation is not supported by your browser.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      output.textContent = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
    },
    () => {
      output.textContent = "Unable to retrieve your location.";
    }
  );
});
let allProducts = [];
async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products?limit=8");
    const data = await res.json();
    allProducts = data;
    renderProducts(allProducts);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }
}

function renderProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";
  products.forEach((product) => {
    container.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <img src="${product.image}" alt="${product.title}" class="w-full h-40 object-contain mb-2">
        <h4 class="font-semibold text-sm mb-1">${product.title}</h4>
        <p class="text-blue-600 font-bold">$${product.price}</p>
      </div>
    `;
  });
}

function filterProducts() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();
  const sort = document.getElementById("sortSelect").value;
  let filtered = allProducts.filter(p => p.title.toLowerCase().includes(keyword));

  if (sort === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}
