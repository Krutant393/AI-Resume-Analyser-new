import React, { useState } from 'react'
import { Upload, Search, Brain, ChartNoAxesCombined } from 'lucide-react'
import { Link } from 'react-router-dom'

const Midpart = () => {
    const [file, setFile] = useState(null)

    return (
        <div className='flex-1 h-full p-4 overflow-y-auto bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950 text-white'>
            <div className='flex flex-col gap-2 justify-center items-center min-h-[500px] w-full rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl mb-4'>

                <Upload size={45} />

                <h1 className='text-5xl'>
                    Upload your Resume
                </h1>

                <p className='text-gray-400'>
                    Supports PDF, DOC, DOCX
                </p>

                <div className='m-4'>
                    <label className='cursor-pointer rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 text-cyan-400 hover:bg-cyan-500/20 transition'>
                        Choose File

                        <input
                            type='file'
                            accept='.pdf,.doc,.docx'
                            className='hidden'
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>
                </div>

                {file && (
                    <>
                        <p className='text-gray-300'>
                            Selected: {file.name}
                        </p>

                        <div className='w-[600px]'>
                            <label className='block mb-2 text-gray-300'>
                                Job Description
                            </label>

                            <textarea
                                placeholder='Paste the job description here...'
                                className='w-full h-[120px] resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400'
                            />
                        </div>
                        <Link to='/resumeanalysis' >
                        <button className='rounded-xl bg-cyan-500 px-6 py-2 text-white hover:bg-cyan-600 transition cursor-pointer'>
                            Analyze
                        </button>
                        </Link>
                    </>
                )}

            </div>


            <div className='flex justify-between gap-4 min-h-[300px] w-full rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl'>

                <div className='flex-1 flex flex-col justify-center items-center p-6'>
                    <div className='flex justify-center items-center h-15 w-15 rounded-full bg-green-500'>
                        <Search size={40} strokeWidth={3} />
                    </div>

                    <h1 className='text-3xl font-medium'>
                        ATS Analysis
                    </h1>

                    <p className='text-center text-gray-300 text-xl'>
                        Check Compatibility with ATS system
                    </p>
                </div>


                <div className='flex-1 flex flex-col justify-center items-center p-6'>
                    <div className='flex justify-center items-center h-15 w-15 rounded-full bg-green-500'>
                        <Brain size={40} strokeWidth={3} />
                    </div>

                    <h1 className='text-3xl font-medium'>
                        Keyword Insights
                    </h1>

                    <p className='text-center text-gray-300 text-xl'>
                        Find missing keywords
                    </p>
                </div>


                <div className='flex-1 flex flex-col justify-center items-center p-6'>
                    <div className='flex justify-center items-center h-15 w-15 rounded-full bg-green-500'>
                        <ChartNoAxesCombined size={40} strokeWidth={3} />
                    </div>

                    <h1 className='text-3xl font-medium'>
                        Improvement Tips
                    </h1>

                    <p className='text-center text-gray-300 text-xl'>
                        Get personalized suggestions
                    </p>
                </div>

            </div>


        </div>
    )
}

export default Midpart