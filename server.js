import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = {};
let otpStore = {};

async function initializeUsers() {
  users["test@example.com"] = { password: await bcrypt.hash("123456", 10) };
}
initializeUsers();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1️⃣ Send OTP
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!users[email]) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  otpStore[email] = otp;
  console.log(`OTP for ${email}: ${otp}`);

  res.json({ message: "OTP sent (check terminal)" });
});

// 2️⃣ Verify OTP & Reset Password
app.post("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!otpStore[email] || otpStore[email] !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  users[email].password = await bcrypt.hash(newPassword, 10);
  delete otpStore[email];

  res.json({ message: "Password reset successful" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
