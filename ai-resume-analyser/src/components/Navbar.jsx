import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated } = useAuth();

    const initials = user?.fullname
        ? user.fullname
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'U';

    return (
        <div className='flex px-6 items-center justify-between h-20 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shrink-0 z-10'>
            <Link to={isAuthenticated ? '/home' : '/'}>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight md:text-2xl">
                        Resume<span className="text-cyan-400">AI</span>
                    </h1>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <Link to='/profile' className="flex items-center gap-3 group">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition">
                                {user?.fullname || 'User'}
                            </span>
                            <span className="text-xs text-gray-400">
                                {user?.email || ''}
                            </span>
                        </div>
                        <div className='cursor-pointer active:scale-95 rounded-full h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20 group-hover:ring-2 group-hover:ring-cyan-400 transition'>
                            {initials}
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;