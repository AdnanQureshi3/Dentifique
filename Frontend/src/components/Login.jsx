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
import logo from '../assets/logo.png';

function Login() {
    const [loading, setloading] = useState(false);
    const [input, setinput] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const ChangeEventHandler = (e) => {
        setinput({...input, [e.target.name]: e.target.value});
    };

    async function LoginHandler(e) {
        e.preventDefault();
        try {
            setloading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, input, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
            if(res.data.success) {
                dispatch(setAuthuser(res.data.user));
                navigate("/home");
                toast.success(res.data.msg, {
                    className: 'bg-green-500 text-white p-4 rounded-lg shadow-md',
                });
                setinput({email: "", password: ""});
            }
        } catch(err) {
            console.log(err);
            toast.error(err.response?.data?.msg || "Something went wrong", {
                className:'bg-red-500 text-white p-4 rounded-lg shadow-md',
            });
        } finally {
            setloading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-[90vh]  bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Panel - Visual Content */}
                <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-10 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-6">Connect & Collaborate</h1>
                        <p className="text-lg opacity-90 mb-8 max-w-md">
                            Join our community of developers sharing knowledge and building amazing projects together.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-white/20 p-3 rounded-lg mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                                    <p className="opacity-80">See what developers are building right now</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-white/20 p-3 rounded-lg mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Developer Community</h3>
                                    <p className="opacity-80">Connect with other developers worldwide</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-white/20 p-3 rounded-lg mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Code Sharing</h3>
                                    <p className="opacity-80">Share your solutions and get feedback</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="font-bold">FD</span>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="font-bold">FH</span>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="font-bold">S8</span>
                            </div>
                            <div className="text-sm opacity-80">
                                Join 10K+ developers
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Panel - Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center">
                    <form onSubmit={LoginHandler} className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <div className="flex justify-center mb-6">
                                {/* <img 
                                    src={logo} 
                                    className="w-24 h-24 object-contain" 
                                    alt="DevConnect Logo" 
                                /> */}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back</h2>
                            <p className="text-gray-600">Sign in to continue your developer journey</p>
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
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="block text-gray-700 font-medium" htmlFor="password">
                                        Password
                                    </Label>
                                    <Link to="#" className="text-sm text-indigo-600 hover:text-indigo-800 transition">
                                        Forgot password?
                                    </Link>
                                </div>
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
                                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex justify-center items-center">
                                        <Loader2 className="animate-spin mr-2" />
                                        Signing in...
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    >
                                        Sign In
                                    </Button>
                                )}
                            </div>
                            
                            <div className="text-center pt-2">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/signup" 
                                        className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
                                    >
                                        Create account
                                    </Link>
                                </p>
                            </div>
                            
                                    <div className="w-full border-t border-gray-300"></div>
                            <div className="relative ">
                                <div className="absolute inset-0 flex items-center">
                                </div>

                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex justify-center space-x-4">
                                <button 
                                    type="button"
                                    className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition"
                                >
                                    <svg className="w-5 h-5" fill="#4285F4" viewBox="0 0 24 24">
                                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                                    </svg>
                                </button>
                                <button 
                                    type="button"
                                    className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition"
                                >
                                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </button>
                                <button 
                                    type="button"
                                    className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition"
                                >
                                    <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;