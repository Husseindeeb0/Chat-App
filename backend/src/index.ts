import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.ts";
import messageRoutes from "./routes/message.route.ts";
import connectDB from "./config/db.ts";
import cookieParser = require("cookie-parser");
import cors from "cors";
import corsOptions from "./config/corsOptions.ts";

// Load environment variables
dotenv.config();

// Initialize app and types
const app: Application = express(); // application represents all possible types exist in express app
const PORT: number = parseInt(process.env.PORT || "5000", 10);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
