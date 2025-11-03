import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";

const app = express();

// ✅ Enable CORS for your frontend
app.use(
  cors({
    origin: ["https://geniegpt-2.onrender.com"], // your frontend on Render
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session + Passport setup
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

// ✅ Routes
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in", user: req.user });
});

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ msg: "Unauthorized" });
  res.json(req.user);
});

app.use("/api", chatRoutes);

// ✅ Simple login route for testing
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "rupa@gmail.com" && password === "1234") {
    return res.json({ message: "Login successful" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to Database");
  } catch (err) {
    console.log("❌ Failed to connect to DB:", err);
  }
};

// ✅ Use Render’s PORT
const PORT = process.env.PORT || 8080;

// ✅ Start server only once
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
