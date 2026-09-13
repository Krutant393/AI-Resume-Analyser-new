import React, { useState } from 'react';
import { Upload, Search, Brain, ChartNoAxesCombined, FileText, AlertCircle, Loader2, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../services/api';

const Midpart = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (selectedFile) => {
        setError('');
        if (!selectedFile) return;

        if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
            setError('Please upload a PDF file (.pdf). Other formats are not currently supported by ATS parser.');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size exceeds 10MB limit. Please upload a smaller PDF.');
            return;
        }

        setFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleAnalyze = async () => {
        setError('');

        if (!file) {
            setError('Please select and upload your resume PDF first.');
            return;
        }

        if (!jobDescription.trim()) {
            setError('Please paste the target Job Description to compare against.');
            return;
        }

        if (jobDescription.trim().length < 30) {
            setError('Job description is too brief. Please provide a more detailed job description for accurate ATS scoring.');
            return;
        }

        setUploading(true);
        try {
            // Step 1: Upload the PDF to /api/auth/upload
            const uploadRes = await resumeApi.uploadPDF(file);
            if (!uploadRes || !uploadRes.resumeId) {
                throw new Error('Upload failed: Did not receive resume ID from server.');
            }

            const resumeId = uploadRes.resumeId;
            const jd = jobDescription.trim();
            sessionStorage.setItem('jd_' + resumeId, jd);

            // Step 2: Call router.post('/analysis/:resumeId', authMiddleware, analysisController)
            const analysisRes = await resumeApi.analyzeResume(resumeId, jd);
            if (!analysisRes || !analysisRes.analysis) {
                throw new Error('Analysis API did not return analysis data.');
            }

            let analysisData = analysisRes.analysis;
            if (typeof analysisData === 'string') {
                try {
                    analysisData = JSON.parse(analysisData);
                } catch (e) {
                    console.warn("Failed to parse analysis JSON string:", e);
                }
            }

            sessionStorage.setItem('analysis_' + resumeId, JSON.stringify(analysisData));

            // Step 3: Navigate to analysis page with data from router.post('/analysis/:resumeId')
            navigate(`/resumeanalysis?id=${resumeId}`, {
                state: {
                    resumeId,
                    fileName: file.name,
                    analysis: analysisData
                }
            });
        } catch (err) {
            console.error('Upload or processing failed:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to upload or analyze resume. Please check your network and try again.';
            setError(msg);
            setUploading(false);
        }
    };

    if (uploading) {
        return (
            <div className='flex-1 h-full flex flex-col items-center justify-center text-center p-6 min-h-[500px]'>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Analysing your resume
                    </h2>
                    <p className="text-gray-400 text-sm max-w-sm">
                        Please wait while we evaluate your qualifications and match keywords...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex-1 h-full p-6 overflow-y-auto text-white'>
           
            <div className='max-w-4xl mx-auto'>
                <div className='flex flex-col justify-center items-center rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-8 sm:p-12 mb-8 shadow-2xl relative overflow-hidden'>
                    <div className='absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none'></div>
                    <div className='absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none'></div>

                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10'>
                        <Upload size={32} />
                    </div>

                    <h1 className='text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight'>
                        Upload Your Resume
                    </h1>

                    <p className='text-gray-400 text-sm sm:text-base text-center mt-2 max-w-md'>
                        Upload your PDF resume and compare it directly against the target job posting
                    </p>

                    {error && (
                        <div className="w-full max-w-xl mt-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                            <div className="flex-1">{error}</div>
                        </div>
                    )}

               
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`w-full max-w-xl mt-6 p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                            isDragging
                                ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                                : file
                                ? 'border-cyan-500/40 bg-slate-800/40'
                                : 'border-white/20 bg-white/5 hover:border-cyan-400/50 hover:bg-white/[0.07]'
                        }`}
                    >
                        {file ? (
                            <div className="flex items-center justify-between w-full bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText className="h-8 w-8 text-cyan-400 shrink-0" />
                                    <div className="truncate">
                                        <p className="text-white font-medium text-sm truncate">{file.name}</p>
                                        <p className="text-gray-400 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-300 text-sm font-medium mb-3">
                                    Drag and drop your resume PDF here, or
                                </p>
                                <label className='cursor-pointer inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-6 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 transition'>
                                    Browse Files
                                    <input
                                        type='file'
                                        accept='.pdf'
                                        className='hidden'
                                        onChange={(e) => handleFileChange(e.target.files[0])}
                                    />
                                </label>
                                <p className="text-gray-500 text-xs mt-3">PDF format only (up to 10MB)</p>
                            </div>
                        )}
                    </div>

                 
                    <div className='w-full max-w-xl mt-6'>
                        <div className="flex justify-between items-center mb-2">
                            <label className='text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                                Target Job Description <span className="text-cyan-400">*</span>
                            </label>
                            <span className="text-xs text-gray-500">
                                {jobDescription.length} characters
                            </span>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => {
                                setJobDescription(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder='Paste the job description or requirements here (role requirements, responsibilities, required skills)...'
                            rows={5}
                            className='w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white text-sm placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:bg-white/10 resize-none leading-relaxed'
                        />
                    </div>

                    <div className="w-full max-w-xl mt-6">
                        <button
                            onClick={handleAnalyze}
                            disabled={uploading || !file || !jobDescription.trim()}
                            className='w-full cursor-pointer flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white shadow-xl shadow-cyan-500/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className='h-5 w-5 animate-spin' />
                                    <span>Processing Resume PDF...</span>
                                </>
                            ) : (
                                <>
                                    <span>Analyze Resume Compatibility</span>
                                    <ArrowRight className='h-5 w-5' />
                                </>
                            )}
                        </button>
                    </div>
                </div>

               
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
                    <div className='flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl'>
                        <div className='flex justify-center items-center h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 mb-3'>
                            <Search size={24} />
                        </div>
                        <h3 className='text-lg font-bold text-white'>ATS Compatibility Score</h3>
                        <p className='text-gray-400 text-xs mt-1 leading-relaxed'>
                            Weighted rating based on technical qualifications, formatting, and responsibility match.
                        </p>
                    </div>

                    <div className='flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl'>
                        <div className='flex justify-center items-center h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 mb-3'>
                            <Brain size={24} />
                        </div>
                        <h3 className='text-lg font-bold text-white'>Keyword Gap Analysis</h3>
                        <p className='text-gray-400 text-xs mt-1 leading-relaxed'>
                            Identifies exact matched, partially matched, and critical missing job keywords.
                        </p>
                    </div>

                    <div className='flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl'>
                        <div className='flex justify-center items-center h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-400/20 text-violet-400 mb-3'>
                            <ChartNoAxesCombined size={24} />
                        </div>
                        <h3 className='text-lg font-bold text-white'>Actionable Recommendations</h3>
                        <p className='text-gray-400 text-xs mt-1 leading-relaxed'>
                            Concrete suggestions to enhance bullet points, add truthful impact, and avoid keyword stuffing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Midpart;