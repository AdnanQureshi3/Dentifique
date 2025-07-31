import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import logo from '../assets/logo.png';

function Signup() {
    const [loading, setloading] = useState(false);
    const [input, setinput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const ChangeEventHandler = (e) => {
        setinput({...input, [e.target.name]: e.target.value});
    };

    async function signupHandler(e) {
        e.preventDefault();
        try {
            setloading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, input, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
            if(res.data.success) {
                navigate("/login");
                toast.success(res.data.msg);
                setinput({
                    username: "",
                    email: "",
                    password: ""
                });
            }
        } catch(err) {
            console.log(err);
            toast.error(err.response?.data?.msg || "Something went wrong");
        } finally {
            setloading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[800px]">
                
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        <div className="text-center mb-3">
                            
                            <h2 className="text-3xl font-bold text-gray-800 mt-4">Create Your Account</h2>
                            <p className="text-gray-600">Join thousands of developers worldwide</p>
                        </div>
                        
                        <form onSubmit={signupHandler} className="space-y-5">
                            <div className="space-y-3">
                                <div>
                                    <Label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                                        Username
                                    </Label>
                                    <Input 
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={input.username}
                                        onChange={ChangeEventHandler}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition shadow-sm"
                                        placeholder="devmaster123"
                                    />
                                </div>
                                
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
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition shadow-sm"
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
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition shadow-sm"
                                        placeholder="••••••••"
                                    />
                                    <div className="flex mt-2">
                                        <div className="w-1/4 h-1 bg-gray-200 rounded mx-1"></div>
                                        <div className="w-1/4 h-1 bg-gray-200 rounded mx-1"></div>
                                        <div className="w-1/4 h-1 bg-gray-200 rounded mx-1"></div>
                                        <div className="w-1/4 h-1 bg-gray-200 rounded mx-1"></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Use 8+ characters with letters, numbers & symbols</p>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                {loading ? (
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex justify-center items-center">
                                        <Loader2 className="animate-spin mr-2" />
                                        Creating account...
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700"
                                    >
                                        Create Account
                                    </Button>
                                )}
                            </div>
                        </form>
                        
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    Or sign up with
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex justify-center space-x-4 mb-6">
                            <button 
                                type="button"
                                className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="#4285F4" viewBox="0 0 24 24">
                                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                                </svg>
                            </button>
                            <button 
                                type="button"
                                className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>
                            <button 
                                type="button"
                                className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="font-medium text-blue-600 hover:text-blue-800 transition"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Right Panel - Visual Content */}
                <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white"></div>
                        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-white"></div>
                        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white rounded-lg transform rotate-45"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-6">Join Our Developer Community</h1>
                        <p className="text-lg opacity-90 mb-8 max-w-md">
                            Create an account to connect with developers worldwide and share your projects.
                        </p>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                            <div className="flex items-center mb-3">
                                <div className="bg-blue-500 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Code Sharing</h3>
                            </div>
                            <p className="text-sm opacity-80">Share solutions and get feedback from peers</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                            <div className="flex items-center mb-3">
                                <div className="bg-indigo-500 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Global Network</h3>
                            </div>
                            <p className="text-sm opacity-80">Connect with developers worldwide</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                            <div className="flex items-center mb-3">
                                <div className="bg-purple-500 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Secure Platform</h3>
                            </div>
                            <p className="text-sm opacity-80">Enterprise-grade security for your data</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                            <div className="flex items-center mb-3">
                                <div className="bg-pink-500 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Real-time Updates</h3>
                            </div>
                            <p className="text-sm opacity-80">Stay current with the latest developments</p>
                        </div>
                    </div>
                    
                   
                </div>
            </div>
        </div>
    );
}

export default Signup;