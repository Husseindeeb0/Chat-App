import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.ts";
import messageRoutes from "./routes/message.route.ts";
import connectDB from "./config/db.ts";
import cookieParser = require("cookie-parser");
import cors from "cors";
import corsOptions from "./config/corsOptions.ts";
import { app, server } from "./config/socket.ts";
import path from "path";

// Load environment variables
dotenv.config();

// Initialize app and types
const PORT: number = parseInt(process.env.PORT || "5000", 10);
const __dirname = path.resolve();

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
