import React from 'react'
import { House , RotateCcwClock , User , LogOut} from 'lucide-react';
import { Link , useLocation } from 'react-router-dom';

const Sidebar = () => {

    const location = useLocation();
    const isHome = location.pathname === '/home';
    const isHistory = location.pathname === '/history';
    const isProfile = location.pathname === '/profile';

  return (
    <div className='h-full w-50 shrink-0 px-4 bg-slate-800/60 backdrop-blur-xl border-r border-white/10 text-white'>
    <Link to='/home'>
    <button className={`flex mb-3 items-center gap-3 px-4 text-sm font-medium cursor-pointer
          ${isHome
            ? 'bg-cyan-500/20 border border-cyan-400/20 text-cyan-400'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`} >
        <House size={25} />
        <h1 className='font-medium text-2xl'>Home</h1>
        </button>
    </Link>
        <Link to='/history'><button className={`flex mb-3 items-center gap-3 px-4 text-sm font-medium cursor-pointer
          ${isHistory
            ? 'bg-cyan-500/20 border border-cyan-400/20 text-cyan-400'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}>
            <RotateCcwClock size={25} />
            <h1 className='font-medium text-2xl'>History</h1>
        </button></Link>
        <Link to='/profile'>
        <button className={`flex mb-3 items-center gap-3 px-4 text-sm font-medium cursor-pointer
          ${isProfile
            ? 'bg-cyan-500/20 border border-cyan-400/20 text-cyan-400'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}>
        <User size={25} />
            <h1 className='font-medium text-2xl'>Profile</h1>
        </button ></Link>
        <Link to='/login'>
        <button className='flex mb-3 cursor-pointer items-center gap-3 px-4 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white'>
        <LogOut size={25} />
            <h1 className='font-medium text-2xl'>Logout</h1>
            </button></Link>
        </div>
    
  )
}

export default Sidebar