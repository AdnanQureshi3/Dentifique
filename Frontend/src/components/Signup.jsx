import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { FaGoogle, FaFacebook, FaBolt, FaGlobe, FaLaptopCode, FaGithub } from 'react-icons/fa';

function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const ChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  async function signupHandler(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log(input);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        input,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (res.data.success) {
        navigate("/verify");
        localStorage.setItem("email", input.email);
        toast.success(res.data.msg);
        setInput({ username: "", email: "", password: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    } finally {
 
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left side - form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mb-8">Join thousands of developers worldwide</p>

          <form onSubmit={signupHandler} className="space-y-5">
            <div>
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                value={input.username}
                onChange={ChangeEventHandler}
                placeholder="devmaster123"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={input.email}
                onChange={ChangeEventHandler}
                placeholder="you@example.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={input.password}
                  onChange={ChangeEventHandler}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use 8+ characters with letters, numbers & symbols</p>
            </div>

            <div>
              {loading ? (
                <Button disabled className="w-full flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Creating...
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Create Account
                </Button>
              )}
            </div>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

       
          <div className="flex gap-8 justify-center">
            <button
              type="button"
 className=" rounded-full aspect-square hover:bg-gray-50 transition flex items-center justify-center text-gray-700"            >
              <FaGoogle className="text-4xl text-blue-500" />
          
            </button>
            <button
              type="button"
              className=" rounded-full aspect-square hover:bg-gray-50 transition flex items-center justify-center text-gray-700"
            >
              <FaGithub className="text-4xl" />
          
            </button>

            <button
              type="button"
 className=" rounded-full aspect-square hover:bg-gray-50 transition flex items-center justify-center text-gray-700"            >
              <FaFacebook className="text-4xl text-blue-600" />
            
            </button>
          </div>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-10 flex-col justify-center">
          <h1 className="text-3xl font-extrabold mb-4">Connect & Collaborate</h1>
          <p className="opacity-90 mb-8 text-lg">
            Join our community of developers sharing knowledge and building amazing projects together.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-white/10 flex items-center justify-center">
                <FaBolt className="text-yellow-300 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Real-time Updates</h3>
                <p className="text-gray-200">See what developers are building right now</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-white/10 flex items-center justify-center">
                <FaGlobe className="text-cyan-300 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Developer Community</h3>
                <p className="text-gray-200">Connect with other developers worldwide</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-white/10 flex items-center justify-center">
                <FaLaptopCode className="text-violet-300 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Code Sharing</h3>
                <p className="text-gray-200">Share your solutions and get feedback</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;
