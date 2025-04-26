import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500", "null"],
  credentials: true
}));

app.use("/", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Serveur running on http://localhost:${process.env.PORT}`);
});