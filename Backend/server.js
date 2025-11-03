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

// const cors = require('cors');
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // if you're using cookies/sessions
}));


app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

// Routes
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in", user: req.user });
});

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ msg: "Unauthorized" });
  res.json(req.user);
});

app.listen(5000, () => console.log("Server running on 5000"));

const PORT = 8080;


app.use(express.json());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});


// other middlewares
app.use(express.json());

// Your routes
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (email === 'rupa@gmail.com' && password === '1234') {
    return res.json({ message: 'Login successful' });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});


const connectDB = async() =>{
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database");
    }catch(err){
        console.log("Failed to connect to DB", err);
    }
}

