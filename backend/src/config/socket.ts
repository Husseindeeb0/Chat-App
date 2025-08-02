import { Server } from "socket.io";
import http from "http";
import express, { Application } from "express";

const app: Application = express(); // application represents all possible types exist in express app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://litechats.netlify.app",
    ],
    credentials: true,
  },
});

export function getReceiverSocketId(userId: string): string {
  return userSocketMap[userId];
}

// User to store online users
const userSocketMap: Record<string, string> = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;
  console.log(userId)
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  // io.email() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user is disconnected", socket.id);
    delete userSocketMap[userId as string];
  });
});

export { io, app, server };
