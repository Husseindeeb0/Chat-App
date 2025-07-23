import express from "express";
const router = express.Router();
import {Signup, Login, Logout, updateProfile, checkAuth} from "../controllers/auth.controller.ts";
import verifyJWT from "../middleware/verifyJWT.middleware.ts";

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", verifyJWT, Logout);
router.put("/update-profile", verifyJWT, updateProfile);
router.get("/verifyJWT", verifyJWT, checkAuth);

export default router;
