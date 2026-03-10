import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model";
import { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET ?? "jdhghjgkufhwliufhlfteylfwuduwddygeufyfyufvsvjhfshfvyfyufd";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ message: "Please provide all required fields.", status: false });

    const existLogin = await adminModel.findOne({ email });

    if (existLogin) return res.status(400).json({ message: "Email already registered.", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await adminModel.create({
      full_name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "New user created successfully.", success: true, data: newUser });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please provide email and password.", status: false });

    const user = await adminModel.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "Invalid email or password.", status: false });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password.", status: false });

    // 7 days in seconds; NextAuth can refresh as needed
    const expiresInSeconds = 7 * 24 * 60 * 60;
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: expiresInSeconds }
    );

    return res.status(200).json({
      message: "Sign in successful.",
      success: true,
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Sign in Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};