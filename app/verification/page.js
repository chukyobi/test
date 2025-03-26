import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/verify-otp", { email: localStorage.getItem("email"), otp });
      router.push("/login");
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
      <button type="submit">Verify</button>
    </form>
  );
}
