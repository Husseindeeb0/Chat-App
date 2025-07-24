import { Server } from "socket.io";
import http from "http";
import express, { Application } from "express";

const app: Application = express(); // application represents all possible types exist in express app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("A user is disconnected", socket.id);
  });
});

export { io, app, server };
