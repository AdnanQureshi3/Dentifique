import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthuser } from "@/redux/authSlice.js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function Verification() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendActive, setResendActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const dispatch = useDispatch();



  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setResendActive(true);
      return;
    }
    setResendActive(false);
    const id = setInterval(() => {
      setTimer((p) => p - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timer]);

  // Submit OTP
  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Enter 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verifyOTP`,
        { email, otp },
        { withCredentials: true }
      );
      if (res.data?.success) {
        localStorage.removeItem("email");
        dispatch(setAuthuser(res.data.user));
        navigate("/home");
      } else {
        toast.error(res.data?.msg || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!resendActive) return;
    try {
      setLoadingResend(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/resendotpVerification`,
        { email },
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success("OTP sent Successfully");
        setTimer(30);
      } else {
        toast.error(res.data?.msg || "Could not send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Resend failed");
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px] flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Verify your email</h1>
        <p className="text-gray-600">
          We’ve sent a 6-digit verification code to{" "}
          <span className="font-medium text-blue-600">{email}</span>. <br />
          Please enter it below to complete your signup for{" "}
          <span className="font-semibold text-indigo-600">UpChain</span>.
        </p>

        <input
          inputMode="numeric"
          pattern="\d*"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          disabled={loading}
          className="w-full h-14 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          placeholder="Enter 6-digit code"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg text-lg font-medium transition ${
            loading ? "opacity-80 cursor-not-allowed" : "hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <div className="text-gray-600 text-sm">
          Didn’t get the code?{" "}
          {resendActive ? (
            <button
              onClick={handleResend}
              disabled={loadingResend}
              className={`font-medium ${loadingResend ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline cursor-pointer"}`}
            >
              {loadingResend ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <span>Resend available in {timer}s</span>

          )}
        </div>
    

        <p className="text-xs text-gray-400 mt-2">
          Check <b> spam/promotions </b>folder if you don't see it.
        </p>
      </div>
    </div>
  );
}

export default Verification;
