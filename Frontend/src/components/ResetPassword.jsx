import React, { useState, useEffect } from "react";
import { KeyRound, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RESEND_COOLDOWN = 30;

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  useEffect(() => {
    if (!email) {
    
      navigate("/login", { replace: true }); 
    }
  }, [email, navigate]);

  const ChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return toast.error("Enter a valid 6-digit OTP");
    setLoadingOtp(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verifyOTP`,
        { otp, email },
        { withCredentials: true }
      );
      if (res.data.success) {
        setVerified(true);
        toast.success("OTP verified successfully! You can now reset your password.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    // Start loading and reset the countdown immediately
    setLoadingResend(true);
    setCanResend(false); 
    setTimeLeft(RESEND_COOLDOWN); 

    try {
      // The API call is now correctly placed here
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/resendotpReset`,
        { email },
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(res.data?.msg || "Could not resend OTP. Please wait.");
      }
    } catch (err) {
   
      toast.error(err.response?.data?.msg || "Resend failed due to a network error.");
      setCanResend(true);
      setTimeLeft(0);
    } finally {
      setLoadingResend(false);
    }
  };

  const ResetPasswordHandler = async (e) => {
    e.preventDefault();
    if (!verified) return toast.error("Please verify OTP first");
    if (input.password.length < 8) return toast.error("Password must be at least 8 characters long");
    if (input.password !== input.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/resetpassword`,
        { password: input.password, email },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Password reset successful. Redirecting to login.");
        navigate("/login", { replace: true }); 
        localStorage.removeItem("email");
      }
    } catch(err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-6 border border-gray-200">
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-bold text-blue-700">Reset Password</h2>
          <p className="text-gray-500 text-center text-sm">
            OTP sent to{" "}
            <span className="font-semibold text-blue-600 break-all">{email || "your email"}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              className="flex-1 outline-none text-center text-lg tracking-widest font-semibold"
              disabled={verified}
            />
          </div>
          <button
            onClick={handleOtpSubmit}
            disabled={otp.length !== 6 || verified || loadingOtp}
            className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors ${
              verified
                ? "bg-green-500 text-white cursor-default"
                : otp.length !== 6 || loadingOtp
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loadingOtp && <Loader2 className="animate-spin w-4 h-4" />}
            {verified ? "OTP Verified" : "Verify OTP"}
          </button>

          <div className="text-center text-md ">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={loadingResend}
                className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-2 w-full disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {loadingResend && <Loader2 className="animate-spin w-4 h-4" />}
                Send OTP
              </button>
            ) : (
              <p className="text-gray-500">
                Resend OTP in <span className="font-semibold">{formatTime(timeLeft)}</span>
                  <p className="text-xs text-red-500 mt-1 font-medium">
        Didn't receive OTP? Please check your <b> Spam or Junk</b> folder.
    </p>
              </p>
            )}
          </div>
        </div>

        <form className="space-y-5" onSubmit={ResetPasswordHandler}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <KeyRound className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={ChangeEventHandler}
                placeholder="••••••••"
                className="flex-1 outline-none"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <KeyRound className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={ChangeEventHandler}
                placeholder="••••••••"
                className="flex-1 outline-none"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="ml-2 text-gray-400 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!verified || loading}
            className={`w-full py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors ${
              !verified || loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;