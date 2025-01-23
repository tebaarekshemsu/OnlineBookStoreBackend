import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);
router.post("/admin/login", async (req, res) => {
  console.log("login");
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      admin: { id: admin.id, username: admin.username, email: admin.email },
    });
  } catch (error) {
    res.status(400).json({ message: "Error logging in", error: error.message });
  }
});

router.post("/admin/create", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating admin user", error: error.message });
  }
});

export default router;
