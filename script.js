// MENU MOBILE
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
toggle.onclick = () => nav.classList.toggle("active");

// CONFIGURATORE
let currentStep = 1;
const maxTop = 4;
const costExtraTop = 0.80;
let cart = [];

const showStep = () => {
  document.querySelectorAll(".step-box").forEach(x => x.style.display = "none");
  document.querySelector("#step-" + currentStep).style.display = "block";

  document.querySelectorAll(".step")
    .forEach((s, i) => s.classList.toggle("active", i + 1 === currentStep));
};
showStep();

// NEXT & PREV
document.querySelectorAll(".next").forEach(btn => btn.onclick = () => {
  currentStep++;
  if (currentStep === 5) updateSummary();
  showStep();
});
document.querySelectorAll(".prev").forEach(btn => btn.onclick = () => {
  currentStep--;
  showStep();
});

// RIEPILOGO
function updateSummary() {
  const b = document.querySelector("input[name='base']:checked");
  const p = document.querySelector("input[name='proteina']:checked");
  const salsa = document.querySelector("#salsa").value;
  const t = [...document.querySelectorAll(".toppings input:checked")].map(e => e.value);

  let total = parseFloat(b.dataset.price) + parseFloat(p.dataset.price);
  total += Math.max(0, t.length - maxTop) * costExtraTop;

  document.querySelector("#pokeSummary").innerHTML = `
    <p><b>Base:</b> ${b.value}</p>
    <p><b>Proteina:</b> ${p.value}</p>
    <p><b>Topping:</b> ${t.join(", ") || "Nessuno"}</p>
    <p><b>Salsa:</b> ${salsa}</p>
  `;

  document.querySelector("#totale").textContent =
    "€" + total.toFixed(2).replace(".", ",");
}

// AGGIUNGI AL CARRELLO
document.querySelector(".addCart").onclick = () => {
  cart.push({
    details: document.querySelector("#pokeSummary").innerText,
    price: document.querySelector("#totale").innerText
  });
  renderCart();
  document.querySelector("#carrello").classList.remove("hidden");
  currentStep = 1; showStep();
};

// RENDER CARRELLO
function renderCart() {
  const cArea = document.querySelector("#cartItems");
  cArea.innerHTML = cart.map(c => `
    <div class="cart-item">${c.details}<br><b>${c.price}</b></div>
  `).join("");

  const total = cart.reduce((a, i) =>
    a + parseFloat(i.price.replace("€", "").replace(",", ".")), 0);

  document.querySelector("#cartTotal").textContent =
    "€" + total.toFixed(2).replace(".", ",");

  document.querySelector("#waOrder").href =
    "https://wa.me/393331234567?text=" +
    encodeURIComponent("Ordine:\n" + cArea.innerText +
      "\nTotale: " + document.querySelector("#cartTotal").innerText);
}

// Lightbox per gallery Poké
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeLightbox = document.querySelector(".close-lightbox");

document.querySelectorAll(".poke-photo").forEach(photo => {
  photo.addEventListener("click", () => {
    lightboxImg.src = photo.src;
    lightbox.style.display = "flex";
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) lightbox.style.display = "none";
});


// 🔥 IMPORTA FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// ✅ CONFIGURAZIONE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCAQoQXn80-nQN1ldki40-SayU-rper4xg",
  authDomain: "dimarco-9bc64.firebaseapp.com",
  projectId: "dimarco-9bc64",
  storageBucket: "dimarco-9bc64.firebasestorage.app",
  messagingSenderId: "689215421719",
  appId: "1:689215421719:web:e66c4c5fcd73d6b8254b52"
};

// ✅ INIZIALIZZA FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

console.log("🔥 Firebase caricato correttamente!");

// ✅ LOGIN Google
const loginBtn = document.getElementById("googleLoginBtn");
const userStatus = document.getElementById("userStatus");

loginBtn.addEventListener("click", () => {
  if (auth.currentUser) {
    signOut(auth).catch(err => console.error(err));
  } else {
    signInWithPopup(auth, provider)
      .catch(err => console.error("Errore durante il login:", err));
  }
});

// ✅ ASCOLTA STATO UTENTE
onAuthStateChanged(auth, (user) => {
  if (user) {
    userStatus.textContent = `✔️ Ciao, ${user.displayName}`;
    loginBtn.textContent = "Esci";
  } else {
    userStatus.textContent = "";
    loginBtn.textContent = "Accedi con Google";
  }
});
