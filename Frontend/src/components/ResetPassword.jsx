import React, { useState, useEffect } from "react"
import { Lock } from "lucide-react"
import { toast } from 'sonner';
import axios from "axios"
import { useNavigate , useLocation} from "react-router-dom"

function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState({ password: "", confirmPassword: "" })
  const [otp, setOtp] = useState("")
  const [verified, setVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const ChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP")
      return
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verify-otpForPasswordreset`,
        { otp , email},
        { withCredentials: true }
      )
      if (res.data.success) {
        setVerified(true)
        toast.success("OTP verified successfully!")
      }
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed"
      toast.error(msg)
    }
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimeLeft(60)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-otpResetPassword`,
        {email} ,
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success("OTP resent successfully!")
      } else {
        toast.error(res.data.message || "Failed to resend OTP")
        setCanResend(true)
        setTimeLeft(0)
      }
    } catch (err) {
      toast.error("Failed to resend OTP")
      setCanResend(true)
      setTimeLeft(0)
    }
  }

  const ResetPasswordHandler = async (e) => {
    e.preventDefault()
    if (!verified) {
      toast.error("Please verify OTP first")
      return
    }
    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    console.log(email , password);


    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/resetpassword`,
        { password: input.password , email },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )
      if (res.data.success) {
        toast.success("Password reset successful")
        navigate("/login")
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <Lock className="w-14 h-14 text-purple-600 mb-4 mx-auto" />
        <h2 className="text-center text-3xl font-bold mb-6 text-purple-700">
          Reset Password
        </h2>

        {/* OTP Section */}
        <div className="mb-6">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            className="border border-gray-300 w-full rounded-xl p-3 text-center tracking-widest text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleOtpSubmit}
            disabled={otp.length !== 6 || verified}
            className={`w-full mt-3 py-2.5 rounded-xl font-bold ${
              verified
                ? "bg-green-500 text-white"
                : otp.length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {verified ? "OTP Verified" : "Verify OTP"}
          </button>

          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-600 font-medium hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-600">
                Resend OTP in{" "}
                <span className="font-semibold">{timeLeft}s</span>
              </p>
            )}
          </div>
        </div>

        {/* Password Form */}
        <form className="space-y-5" onSubmit={ResetPasswordHandler}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={input.password}
              onChange={ChangeEventHandler}
              placeholder="••••••••"
              className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={ChangeEventHandler}
              placeholder="••••••••"
              className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={!verified || loading}
            className={`w-full py-2.5 rounded-xl font-semibold transition-colors ${
              !verified || loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
