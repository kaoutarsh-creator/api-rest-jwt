const API_URL = "http://localhost:5000";

// =========================
// Helpers
// =========================
function showMessage(elementId, message, type = "error") {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = message;
  el.style.display = "block";
  el.style.padding = "14px";
  el.style.marginTop = "16px";
  el.style.borderRadius = "12px";
  el.style.fontWeight = "500";

  if (type === "success") {
    el.style.backgroundColor = "#e8f7ee";
    el.style.color = "#1f7a3f";
    el.style.border = "1px solid #b7e4c7";
  } else {
    el.style.backgroundColor = "#fdeaea";
    el.style.color = "#b42318";
    el.style.border = "1px solid #f5c2c7";
  }
}

function clearMessage(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function removeToken() {
  localStorage.removeItem("token");
}

// =========================
// Signup
// =========================
async function signupUser(event) {
  event.preventDefault();

  const nom = document.getElementById("signupNom")?.value.trim();
  const prenom = document.getElementById("signupPrenom")?.value.trim();
  const filiere = document.getElementById("signupFiliere")?.value.trim();
  const password = document.getElementById("signupPassword")?.value.trim();

  clearMessage("signupMessage");

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ nom, prenom, filiere, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("signupMessage", data.message || "Inscription réussie", "success");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } else {
      showMessage("signupMessage", data.message || "Erreur lors de l'inscription", "error");
    }
  } catch (error) {
    showMessage("signupMessage", "Erreur de connexion au serveur", "error");
  }
}

// =========================
// Login
// =========================
async function loginUser(event) {
  event.preventDefault();

  const nom = document.getElementById("loginNom")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  clearMessage("loginMessage");

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ nom, password })
    });

    const data = await res.json();

    if (res.ok) {
      if (data.token) {
        saveToken(data.token);
      }

      showMessage("loginMessage", data.message || "Connexion réussie", "success");

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1000);
    } else {
      showMessage("loginMessage", data.message || "Erreur de connexion", "error");
    }
  } catch (error) {
    showMessage("loginMessage", "Erreur de connexion au serveur", "error");
  }
}

// =========================
// Profile
// =========================
async function getProfile() {
  const resultBox = document.getElementById("result");
  if (!resultBox) return;

  resultBox.textContent = "Chargement...";

  try {
    const token = getToken();

    const res = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: token
        ? {
            "Authorization": `Bearer ${token}`
          }
        : {},
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok) {
      resultBox.textContent = JSON.stringify(data, null, 2);
    } else {
      resultBox.textContent = data.message || "Accès refusé";
    }
  } catch (error) {
    resultBox.textContent = "Erreur de connexion au serveur";
  }
}

// =========================
// Users
// =========================
async function getUsers() {
  const resultBox = document.getElementById("result");
  if (!resultBox) return;

  resultBox.textContent = "Chargement...";

  try {
    const res = await fetch(`${API_URL}/users`, {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok) {
      resultBox.textContent = JSON.stringify(data, null, 2);
    } else {
      resultBox.textContent = data.message || "Erreur lors du chargement des utilisateurs";
    }
  } catch (error) {
    resultBox.textContent = "Erreur de connexion au serveur";
  }
}

// =========================
// Logout
// =========================
async function logoutUser() {
  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });

    const data = await res.json();

    removeToken();

    alert(data.message || "Déconnexion réussie");
    window.location.href = "login.html";
  } catch (error) {
    alert("Erreur lors de la déconnexion");
  }
}

// =========================
// Auto-bind forms/buttons
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", signupUser);
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", getProfile);
  }

  const usersBtn = document.getElementById("usersBtn");
  if (usersBtn) {
    usersBtn.addEventListener("click", getUsers);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
});