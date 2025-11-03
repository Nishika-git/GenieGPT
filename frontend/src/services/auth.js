// src/services/auth.js
import axios from "axios";

export const login = async (email, password) => {
  const res = await axios.post(
    "http://localhost:5000/login",
    { email, password },
    { withCredentials: true } // lets cookies (session) work
  );
  return res.data;
};

export const getProfile = async () => {
  const res = await axios.get("http://localhost:5000/profile", { withCredentials: true });
  return res.data;
};
