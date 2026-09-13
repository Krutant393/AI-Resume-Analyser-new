import React, { useState, useEffect } from 'react';
import { File, TrendingUp, Star, Calendar, ArrowRight, Loader2, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resumeApi } from '../services/api';

const Himid = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await resumeApi.getHistory();
                if (res && res.history) {
                    setHistory(res.history);
                }
            } catch (err) {
                console.error("Failed to load history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const totalAnalyses = history.length;
    const scores = history.filter(h => typeof h.score === 'number').map(h => h.score);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highScoresCount = scores.filter(s => s >= 75).length;

    return (
        <div className='flex-1 h-full p-6 sm:p-8 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-white'>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <h1 className='text-3xl font-extrabold tracking-tight text-white'>Analysis History</h1>
                    <p className='text-gray-400 text-sm mt-1'>
                        View and review your previous resume ATS reports
                    </p>
                </div>

                <Link
                    to="/home"
                    className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20 transition"
                >
                    + Analyze New Resume
                </Link>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
                <div className='flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl'>
                    <div className='h-12 w-12 shrink-0 flex justify-center items-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400'>
                        <File size={24} />
                    </div>
                    <div>
                        <h3 className='text-2xl sm:text-3xl font-black text-white'>{totalAnalyses}</h3>
                        <p className='text-xs text-gray-400 font-medium'>Total Analyses</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl'>
                    <div className='h-12 w-12 shrink-0 flex justify-center items-center rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400'>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className='text-2xl sm:text-3xl font-black text-white'>{averageScore}%</h3>
                        <p className='text-xs text-gray-400 font-medium'>Average Score</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl'>
                    <div className='h-12 w-12 shrink-0 flex justify-center items-center rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-400'>
                        <Star size={24} />
                    </div>
                    <div>
                        <h3 className='text-2xl sm:text-3xl font-black text-white'>{highScoresCount}</h3>
                        <p className='text-xs text-gray-400 font-medium'>Strong Matches (75%+)</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl'>
                    <div className='h-12 w-12 shrink-0 flex justify-center items-center rounded-xl bg-violet-500/10 border border-violet-400/20 text-violet-400'>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className='text-2xl sm:text-3xl font-black text-white'>{totalAnalyses}</h3>
                        <p className='text-xs text-gray-400 font-medium'>Active Records</p>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="mt-8">
                <h2 className="text-lg font-bold text-white mb-4">Past Resume Evaluations</h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-2xl border border-white/10">
                        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mb-3" />
                        <span className="text-sm text-gray-400">Loading your history records...</span>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-2xl border border-white/10 text-center">
                        <File className="h-12 w-12 text-gray-600 mb-3" />
                        <h3 className="text-base font-semibold text-white">No Previous Analyses Found</h3>
                        <p className="text-xs text-gray-400 max-w-sm mt-1 mb-5">
                            You haven't analyzed any resumes yet. Upload a resume on the Home page to see your history here.
                        </p>
                        <Link
                            to="/home"
                            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white transition"
                        >
                            Upload Resume Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => {
                            const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'Recent';

                            return (
                                <div
                                    key={item.id}
                                    className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-4">
                                        {item.hasAnalysis && typeof item.score === 'number' ? (
                                            <div className={`flex items-center justify-center h-12 w-12 rounded-xl shrink-0 font-black text-sm border ${
                                                item.score >= 75
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                    : item.score >= 50
                                                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                            }`}>
                                                {item.score}%
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl shrink-0 font-medium text-xs bg-gray-700/50 text-gray-400 border border-white/10">
                                                N/A
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white">
                                                    {item.matchLevel || "Resume Evaluation"}
                                                </span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {dateStr}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xl">
                                                {item.summary || item.resumeSnippet || "Resume text recorded."}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/resumeanalysis?id=${item.id}`}
                                        className="self-end sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/30 transition cursor-pointer shrink-0"
                                    >
                                        <span>View Report</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Himid;