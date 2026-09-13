import React from 'react';
import { House, RotateCcwClock, User, LogOut, FileText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const isHome = location.pathname === '/home';
    const isAnalysis = location.pathname === '/resumeanalysis';
    const isHistory = location.pathname === '/history';
    const isProfile = location.pathname === '/profile';

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className='h-full w-56 shrink-0 py-6 px-3 bg-slate-900/70 backdrop-blur-xl border-r border-white/10 text-white flex flex-col justify-between'>
            <div className='flex flex-col gap-1.5'>
                <Link to='/home'>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                        isHome
                            ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-sm shadow-cyan-500/10'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}>
                        <House size={20} />
                        <span>Home</span>
                    </div>
                </Link>

                <Link to='/resumeanalysis'>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                        isAnalysis
                            ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-sm shadow-cyan-500/10'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}>
                        <FileText size={20} />
                        <span>Analysis</span>
                    </div>
                </Link>

                <Link to='/history'>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                        isHistory
                            ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-sm shadow-cyan-500/10'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}>
                        <RotateCcwClock size={20} />
                        <span>History</span>
                    </div>
                </Link>

                <Link to='/profile'>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                        isProfile
                            ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-sm shadow-cyan-500/10'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}>
                        <User size={20} />
                        <span>Profile</span>
                    </div>
                </Link>
            </div>

            <div className='pt-4 border-t border-white/10'>
                <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer'
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;