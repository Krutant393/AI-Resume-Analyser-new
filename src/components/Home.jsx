import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Midpart from './Midpart'

const Home = () => {
  return (
    <div className='h-screen overflow-hidden w-screen bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950 text-white'>
        <Navbar />
        <div className="flex h-[calc(100vh-80px)]">
            <Sidebar />
            <Midpart />
        </div>
        
        
    </div>
  )
}

export default Home