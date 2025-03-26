import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv/config"; // Automatically loads .env
import sequelize from "./config/db.js"; // Import database connection
import User from "./models/User.js"; // Import User model

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email Transporter (Gmail SMTP)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
// });

// **Signup Route**
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, email, phoneNumber, countryCode, password, dob, address, termsAccepted } = req.body;

    if (!termsAccepted) return res.status(400).json({ error: "You must accept the Terms and Conditions" });

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60000); // Expires in 15 min

    // Create User
    const user = await User.create({
      firstName, lastName, username, email, phoneNumber, countryCode, password: hashedPassword, dob,
      street: address.street, city: address.city, state: address.state, postalCode: address.postalCode, country: address.country,
      termsAccepted, otp, otpExpires
    });

    console.log("OTP:", otp); // Simulating email sending

    // Send OTP via email
    // await transporter.sendMail({
    //   to: email,
    //   subject: "Verify Your Account",
    //   text: `Your OTP is: ${otp}. It expires in 15 minutes.`,
    // });

    res.json({ message: "OTP sent to email", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// **OTP Verification**
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (new Date() > user.otpExpires) return res.status(400).json({ error: "OTP expired" });

    // Clear OTP fields after successful verification
    await user.update({ otp: null, otpExpires: null });

    res.json({ message: "OTP verified. Proceed to login." });
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed" });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Sync Database & Start Server
sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
