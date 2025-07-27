import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import connectDB from "./config/db";
import cookieParser = require("cookie-parser");
import cors from "cors";
import corsOptions from "./config/corsOptions";
import { app, server } from "./config/socket";

// Load environment variables
dotenv.config();

// Initialize app and types
const PORT: number = parseInt(process.env.PORT || "5000", 10);

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
