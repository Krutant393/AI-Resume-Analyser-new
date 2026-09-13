import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Loader2, Lock, Mail, User, ArrowRight } from "lucide-react";

const Signup = () => {
    const navigate = useNavigate();
    const { signup, isAuthenticated } = useAuth();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!fullname.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await signup(fullname.trim(), email.trim(), password);
            navigate("/home", { replace: true });
        } catch (err) {
            console.error("Signup failed:", err);
            const msg = err.response?.data?.message || "Registration failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-950 to-cyan-950 px-4 py-8">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-violet-500/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-3">
                        <span className="text-2xl font-black text-white tracking-tight">
                            Resume<span className="text-cyan-400">AI</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Create an Account
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Get started with AI-driven ATS resume optimization
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 animate-fade-in">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                        <div className="flex-1">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                onChange={(e) => {
                                    setFullname(e.target.value);
                                    if (error) setError("");
                                }}
                                type="text"
                                value={fullname}
                                placeholder="Jane Doe"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:bg-white/10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
                                type="email"
                                value={email}
                                placeholder="name@example.com"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:bg-white/10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError("");
                                }}
                                type="password"
                                value={password}
                                placeholder="Minimum 6 characters"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:bg-white/10"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Free Account</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 ml-1"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;