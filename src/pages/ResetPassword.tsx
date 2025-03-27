import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    email: z.string().email("Invalid email"),
    otp: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  // 1️⃣ Send OTP Request
  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/send-otp", { email });
      setOtpSent(true);
      alert("OTP sent! Check terminal in VS Code.");
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  // 2️⃣ Verify OTP & Reset Password
  const resetPassword = async (data: any) => {
    try {
      await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp: data.otp,
        newPassword: data.password,
      });
      alert("Password reset successful! You can now log in.");
    } catch (err) {
      alert("Invalid OTP or error resetting password.");
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      {!otpSent ? (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(resetPassword)}>
          <input type="text" placeholder="Enter OTP" {...register("otp")} />
          {errors.otp && <p>{errors.otp.message}</p>}

          <input type="password" placeholder="New Password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}

          <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
