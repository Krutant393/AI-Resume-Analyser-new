import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-zinc-800 relative overflow-hidden min-h-screen flex items-center justify-center">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none"></div>
            <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl pointer-events-none"></div>

            <div className="relative mx-auto max-w-7xl px-6 py-20 w-full">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl md:p-16">
                    <nav className="mb-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-2xl shadow-lg"></div>
                            <h1 className="text-2xl font-bold text-white md:text-3xl">
                                Resume<span className="text-cyan-400">AI</span>
                            </h1>
                        </div>
                    </nav>

                    <div className="mx-auto max-w-4xl text-center">
                        <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300">
                            AI Powered Resume Analysis
                        </span>

                        <h1 className="mt-8 text-5xl font-bold mb-4 text-white md:text-7xl">
                            Build a Resume That
                            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mt-3 block">
                                Gets Interviews
                            </span>
                        </h1>

                        <p className="mt-8 text-lg leading-8 text-gray-300 md:text-xl">
                            More than 75% of resumes never reach a recruiter because they
                            fail ATS screening or miss important keywords. ResumeAI analyses
                            your resume using Artificial Intelligence and provides a detailed
                            score, ATS compatibility check, keyword analysis, formatting
                            suggestions, and personalised recommendations to improve your
                            chances of landing interviews.
                        </p>
                    </div>

                    <div className="mt-10 flex justify-center items-center">
                        <Link
                            to="/login"
                            className="text-center flex justify-center items-center text-2xl rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-6 py-4 font-semibold text-cyan-300 transition duration-300 hover:bg-cyan-500/40 h-18 w-56"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;