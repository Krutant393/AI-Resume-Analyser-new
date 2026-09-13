import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const initials = user?.fullname
        ? user.fullname
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'U';

    return (
        <div className='h-screen overflow-hidden w-screen bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-white flex flex-col'>
            <Navbar />
            <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden">
                <Sidebar />

                <div className="flex-1 h-full overflow-y-auto p-6 sm:p-10 bg-gradient-to-br from-slate-900/40 via-slate-950 to-cyan-950/40">
                    <div className="max-w-2xl mx-auto">
                        <div className="pb-6 border-b border-white/10 mb-8">
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">
                                User Profile
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Manage your account information and authentication settings
                            </p>
                        </div>

                        {/* Profile Header Card */}
                        <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-8 shadow-2xl mb-6 relative overflow-hidden">
                            <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-400/30 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-cyan-500/20 shrink-0">
                                    {initials}
                                </div>

                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                                        <CheckCircle2 size={13} />
                                        <span>Active Account</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        {user?.fullname || 'ResumeAI User'}
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-0.5">
                                        {user?.email || 'No email associated'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 space-y-4 mb-6">
                            <h3 className="text-base font-bold text-white mb-2">
                                Personal Information
                            </h3>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block">Full Name</span>
                                        <span className="text-sm font-semibold text-white">{user?.fullname || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block">Email Address</span>
                                        <span className="text-sm font-semibold text-white">{user?.email || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block">Authentication Method</span>
                                        <span className="text-sm font-semibold text-white">Encrypted JWT Session & Cookies</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sign Out Card */}
                        <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6 flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-white">Sign Out of ResumeAI</h4>
                                <p className="text-xs text-gray-400 mt-0.5">End your current session across devices</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer flex items-center gap-2"
                            >
                                <LogOut size={15} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;