import React from 'react'
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='flex p-6 items-center justify-between h-20 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10'>
            <Link to='/'>
            <h1 className="text-2xl font-bold text-white md:text-3xl cursor-pointer">
                Resume<span className="text-cyan-400">AI</span>
              </h1>
            </Link>
              <Link to='/profile'><button className='cursor-pointer active:scale-95 rounded-full h-10 w-10 bg-gray-700 flex items-center justify-center'>
                <User />
              </button></Link>
    </div>
  )
}

export default Navbar