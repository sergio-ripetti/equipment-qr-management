import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db";
import machineRoutes from "./routes/machineRoutes";
import authRoutes from "./routes/authRoutes";
import activityLogRoutes from "./routes/activityLogRoutes";
import userRoutes from "./routes/userRoutes";

// Loads environment variables from .env
dotenv.config();

// Connects to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Makes uploaded images publicly available
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Test route
app.get("/", (_req: Request, res: Response) => {
  res.send("Ripe Deli Equipment API is running");
});

// API routes
app.use("/api/machines", machineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
