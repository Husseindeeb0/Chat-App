import express from "express";
import verifyJWT from "../middleware/verifyJWT.middleware.ts";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.ts";
const router = express.Router();

router.get("/users", verifyJWT, getUsersForSidebar);
router.get("/:id", verifyJWT, getMessages);
router.post("/send/:id", verifyJWT, sendMessages);

export default router;
