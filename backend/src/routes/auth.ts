import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

const router = Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credential" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    return res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
