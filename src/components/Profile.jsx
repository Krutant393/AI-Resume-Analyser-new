import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Profile = () => {
  return (
    <div className='h-screen overflow-hidden w-screen bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950 text-white'>
        <Navbar />
        <Sidebar />
    </div>
  )
}

export default Profile