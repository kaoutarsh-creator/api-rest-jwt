import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// connexion MongoDB
connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500", "null"],
  credentials: true
}));

// routes
app.use("/", authRoutes);

// gestion erreur JSON invalide
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "JSON invalide dans la requête"
    });
  }
  next();
});

// lancement serveur
app.listen(process.env.PORT || 5000, () => {
  console.log(`Serveur running on http://localhost:${process.env.PORT || 5000}`);
});