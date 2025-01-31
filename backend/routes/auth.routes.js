import express from "express";
import { getMe, isAuthenticated, login, logout, resetPassword, sendResetOTP, sendVerifyOTP, signup, verifyEmail } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", protectRoute, getMe);
authRoutes.post("/send-verify-otp", protectRoute, sendVerifyOTP);
authRoutes.post("/verify-account", protectRoute, verifyEmail);
authRoutes.post("/is-auth", protectRoute, isAuthenticated);
authRoutes.post("/send-reset-otp", sendResetOTP);
authRoutes.post("/reset-password", resetPassword);


export default authRoutes;
