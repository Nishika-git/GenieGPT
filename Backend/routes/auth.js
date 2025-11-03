import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../models/user.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route (Passport local)
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in successfully", user: req.user });
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
