const API_URL = "http://localhost:5000";

function showMessage(elementId, message, type = "success") {
  const box = document.getElementById(elementId);
  if (!box) return;

  box.textContent = message;
  box.className = `message-box ${type}`;
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const filiere = document.getElementById("filiere").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nom, prenom, filiere, password })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("signupMessage", data.message, "success");
        signupForm.reset();

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);
      } else {
        showMessage("signupMessage", data.message || "Erreur signup", "error");
      }
    } catch (error) {
      showMessage("signupMessage", "Erreur de connexion au serveur", "error");
    }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("loginNom").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ nom, password })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("loginMessage", data.message, "success");

        setTimeout(() => {
          window.location.href = "profile.html";
        }, 1000);
      } else {
        showMessage("loginMessage", data.message || "Erreur login", "error");
      }
    } catch (error) {
      showMessage("loginMessage", "Erreur de connexion au serveur", "error");
    }
  });
}

async function getProfile() {
  const result = document.getElementById("profileResult");
  if (result) {
    result.textContent = "Chargement des données...";
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      result.textContent = JSON.stringify(data, null, 2);
    } else {
      result.textContent = data.message || "Accès refusé";
    }
  } catch (error) {
    result.textContent = "Erreur de connexion au serveur";
  }
}

async function logout() {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();

    alert(data.message || "Déconnexion");

    window.location.href = "login.html";
  } catch (error) {
    alert("Erreur lors de la déconnexion");
  }
}