import express from "express";
import { registerUser, signIn } from "../controller/auth.controller";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Sign in - returns user (name, email, id) and accessToken for NextAuth
router.post("/login", signIn);

export default router;