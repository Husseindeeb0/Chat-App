import express from "express";
const router = express.Router();
import {Signup, Login, Logout, updateProfile, checkAuth, refreshToken} from "../controllers/auth.controller";
import verifyJWT from "../middleware/verifyJWT.middleware";

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", verifyJWT, Logout);
router.put("/update-profile", verifyJWT, updateProfile);
router.post("/refreshToken", refreshToken);
router.get("/verifyJWT", verifyJWT, checkAuth);

export default router;
