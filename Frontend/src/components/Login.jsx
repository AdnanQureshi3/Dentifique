import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setAuthuser } from '@/redux/authSlice.js';

function Login() {
    const [loading, setloading] = useState(false);
    const [input, setinput] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const ChangeEventHandler = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value });
    };

    async function LoginHandler(e) {
        e.preventDefault();
        try {
            setloading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthuser(res.data.user));
                navigate("/home");
                toast.success(res.data.msg, {
                    className: 'bg-green-500 text-white p-4 rounded-lg shadow-md',
                });
                setinput({ email: "", password: "" });
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || "Something went wrong", {
                className: 'bg-red-500 text-white p-4 rounded-lg shadow-md',
            });
        } finally {
            setloading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Panel - Features */}
                <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-10 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-6">Connect & Collaborate</h1>
                    <p className="text-lg opacity-90 mb-8">
                        Join our community of developers sharing knowledge and building amazing projects together.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold">⚡ Real-time Updates</h3>
                            <p className="opacity-80">See what developers are building right now</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">🌍 Developer Community</h3>
                            <p className="opacity-80">Connect with other developers worldwide</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">💻 Code Sharing</h3>
                            <p className="opacity-80">Share your solutions and get feedback</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center">
                    <form onSubmit={LoginHandler} className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back</h2>
                            <p className="text-gray-600">Sign in to continue your journey</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                                    Email Address
                                </Label>
                                <Input 
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={input.email}
                                    onChange={ChangeEventHandler}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <Label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                                    Password
                                </Label>
                                <Input 
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={input.password}
                                    onChange={ChangeEventHandler}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-4">
                                {loading ? (
                                    <Button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl flex justify-center items-center">
                                        <Loader2 className="animate-spin mr-2" />
                                        Signing in...
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        Sign In
                                    </Button>
                                )}
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-gray-600">
                                    Don’t have an account?{" "}
                                    <Link 
                                        to="/signup" 
                                        className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
                                    >
                                        Create account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
