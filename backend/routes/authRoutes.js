import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// test
router.get("/", (req, res) => {
  res.send("Backend JWT + MongoDB fonctionne");
});

// signup
router.post("/signup", async (req, res) => {
  try {
    const { nom, prenom, filiere, password } = req.body;

    if (!nom || !prenom || !filiere || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires"
      });
    }

    const existUser = await User.findOne({ nom });

    if (existUser) {
      return res.status(400).json({
        message: "Utilisateur déjà existant"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nom,
      prenom,
      filiere,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Utilisateur ajouté avec succès",
      user: {
        id: newUser._id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        filiere: newUser.filiere
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { nom, password } = req.body;

    if (!nom || !password) {
      return res.status(400).json({
        message: "Nom et mot de passe obligatoires"
      });
    }

    const user = await User.findOne({ nom });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Mot de passe incorrect"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        filiere: user.filiere
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 1000
    });

    res.json({
      message: "Connexion réussie",
      token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });

    res.json(
      users.map((u) => ({
        id: u._id,
        nom: u.nom,
        prenom: u.prenom,
        filiere: u.filiere
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// profile
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Informations de l'utilisateur connecté",
    user: req.user
  });
});

// logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Déconnexion réussie"
  });
});

export default router;