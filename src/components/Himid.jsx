import React from 'react'
import { File, TrendingUp, Star } from 'lucide-react';

const Himid = () => {
  return (
    <div className='flex-1 h-full p-4 overflow-hidden bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950 text-white'>

      <div>
        <h1 className='text-4xl font-bold'>History</h1>
        <p className='text-gray-300'>
          View and manage your previous resume analysis
        </p>
      </div>

      <div className='flex gap-4 mt-6'>

        <div className='flex-1 flex justify-center gap-3 items-center h-[130px] rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl'>

          <div className='h-[60px] w-[60px] shrink-0 flex justify-center items-center rounded-full bg-cyan-500/10 border border-cyan-400/20'>
            <File className='text-cyan-400' size={40} />
          </div>

          <div className='flex flex-col'>
            <h1 className='text-5xl font-bold'>12</h1>
            <p className='text-xl text-gray-300'>Total Analyses</p>
          </div>

        </div>


        <div className='flex-1 flex justify-center gap-3 items-center h-[130px] rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl'>

          <div className='h-[60px] w-[60px] shrink-0 flex justify-center items-center rounded-full bg-green-500/10 border border-green-400/20'>
            <TrendingUp className='text-green-400' size={40} />
          </div>

          <div className='flex flex-col'>
            <h1 className='text-5xl font-bold'>84</h1>
            <p className='text-xl text-gray-300'>Average Score</p>
          </div>

        </div>


        <div className='flex-1 flex justify-center gap-3 items-center h-[130px] rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl'>

          <div className='h-[60px] w-[60px] shrink-0 flex justify-center items-center rounded-full bg-yellow-500/10 border border-yellow-400/20'>
            <Star className='text-yellow-400' size={40} />
          </div>

          <div className='flex flex-col'>
            <h1 className='text-5xl font-bold'>3</h1>
            <p className='text-xl text-gray-300'>Resumes Improved</p>
          </div>

        </div>


        <div className='flex-1 flex justify-center gap-3 items-center h-[130px] rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl'>

          <div className='h-[60px] w-[60px] shrink-0 flex justify-center items-center rounded-full bg-violet-500/10 border border-violet-400/20'>
            <File className='text-violet-400' size={40} />
          </div>

          <div className='flex flex-col'>
            <h1 className='text-5xl font-bold'>8</h1>
            <p className='text-xl text-gray-300'>This Month</p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Himid