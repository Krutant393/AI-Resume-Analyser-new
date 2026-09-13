import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { resumeApi } from '../services/api';
import {
    FileText,
    AlertCircle,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    BookOpen,
    Briefcase,
    Code2,
    Layers,
    ShieldAlert,
    FileCheck,
    Copy,
    Check,
    Sparkles,
    Search,
    GraduationCap,
    CheckSquare,
    Zap,
    TrendingUp
} from 'lucide-react';

// Error boundary to prevent white screen crashes
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error in ResumeAnalysis:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Something went wrong displaying results</h2>
                    <p className="text-gray-400 text-sm max-w-md mt-2 mb-6">
                        We received the analysis data, but encountered an unexpected formatting issue while rendering.
                    </p>
                    <Link
                        to="/home"
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition"
                    >
                        Return to Upload
                    </Link>
                </div>
            );
        }
        return this.props.children;
    }
}

// Helper to safely format text (handles string, array of strings, or object)
const safeString = (val, fallback = '') => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (Array.isArray(val)) {
        return val.map(item => safeString(item)).filter(Boolean).join(', ');
    }
    if (typeof val === 'object') {
        return val.text || val.summary || val.description || val.title || val.name || val.reason || val.requirement || val.strength || val.weakness || val.skill || val.item || fallback;
    }
    return String(val);
};

// Helper to safely get keyword name (handles string or object with { keyword, reason, ... })
const safeKeyword = (kw) => {
    if (!kw) return '';
    if (typeof kw === 'string') return kw;
    if (typeof kw === 'object') {
        return kw.keyword || kw.name || kw.skill || kw.title || safeString(kw);
    }
    return String(kw);
};

// Helper to safely get numeric score
const safeNumber = (val, fallback = 0) => {
    if (typeof val === 'number' && !isNaN(val)) return Math.round(val);
    if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) return parsed;
    }
    if (typeof val === 'object' && val !== null) {
        if (typeof val.score === 'number') return Math.round(val.score);
        if (typeof val.percentage === 'number') return Math.round(val.percentage);
    }
    return fallback;
};

const ResumeAnalysisContent = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const resumeId = searchParams.get('id') || location.state?.resumeId;
    const initialJobDescription = location.state?.jobDescription || (resumeId ? sessionStorage.getItem('jd_' + resumeId) : '');
    const fileName = location.state?.fileName || 'Resume Document';

    // Directly use analysis data from router.post('/analysis/:resumeId')
    const getInitialAnalysis = () => {
        if (location.state?.analysis) {
            let data = location.state.analysis;
            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch (e) {}
            }
            return data;
        }
        if (resumeId) {
            try {
                const cached = sessionStorage.getItem('analysis_' + resumeId);
                if (cached) return JSON.parse(cached);
            } catch (e) {}
        }
        return null;
    };

    const [analysis, setAnalysis] = useState(getInitialAnalysis);
    const [loading, setLoading] = useState(() => !getInitialAnalysis());
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('improvements');
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (text, id) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Fetch or perform analysis if not already available
    useEffect(() => {
        if (analysis) {
            setLoading(false);
            return;
        }

        const fetchOrPerformAnalysis = async () => {
            if (!resumeId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // If jobDescription is provided, invoke router.post('/analysis/:resumeId', authMiddleware, analysisController)
                if (initialJobDescription) {
                    sessionStorage.setItem('jd_' + resumeId, initialJobDescription);
                    const res = await resumeApi.analyzeResume(resumeId, initialJobDescription);
                    if (res && res.analysis) {
                        let parsed = res.analysis;
                        if (typeof parsed === 'string') {
                            try { parsed = JSON.parse(parsed); } catch (e) { console.warn(e); }
                        }
                        sessionStorage.setItem('analysis_' + resumeId, JSON.stringify(parsed));
                        setAnalysis(parsed);
                    } else {
                        throw new Error("No analysis returned from AI engine.");
                    }
                } else {
                    // Fallback to fetch existing analysis record
                    const res = await resumeApi.getAnalysis(resumeId);
                    if (res && res.analysis) {
                        let parsed = res.analysis;
                        if (typeof parsed === 'string') {
                            try { parsed = JSON.parse(parsed); } catch (e) { console.warn(e); }
                        }
                        sessionStorage.setItem('analysis_' + resumeId, JSON.stringify(parsed));
                        setAnalysis(parsed);
                    } else {
                        setAnalysis(null);
                    }
                }
            } catch (err) {
                console.error("Analysis loading failed:", err);
                const msg = err.response?.data?.message || err.message || "Failed to process resume analysis.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchOrPerformAnalysis();
    }, [resumeId, initialJobDescription]);

    const overallScore = safeNumber(analysis?.score, 0);
    const matchLevel = safeString(analysis?.overall_assessment?.match_level, 'Evaluated');
    const summaryText = safeString(analysis?.overall_assessment?.summary, 'Analysis completed.');
    const readinessText = safeString(analysis?.overall_assessment?.hiring_readiness, 'Interview Ready');
    const keywordMatchPct = safeNumber(analysis?.keyword_analysis?.keyword_match_percentage, 0);

    return (
        <div className='h-screen overflow-hidden w-screen bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950 text-white flex flex-col'>
            <Navbar />
            <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden">
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8">
                    {/* 1. CONSISTENT LOADING SCREEN */}
                    {loading && (
                        <div className="min-h-[500px] h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
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
                    )}

                    {/* 2. ERROR SCREEN */}
                    {!loading && error && (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Analysis Could Not Complete</h2>
                            <p className="text-gray-400 text-sm max-w-md mt-2 mb-6">{error}</p>
                            <div className="flex gap-4">
                                <Link
                                    to="/home"
                                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition"
                                >
                                    Upload Resume Again
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* 3. EMPTY STATE (No resume selected) */}
                    {!loading && !error && !analysis && (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 mb-4">
                                <FileText size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">No Resume Analysis Selected</h2>
                            <p className="text-gray-400 text-sm max-w-md mt-2 mb-6">
                                Upload your PDF resume on the Home page to generate a comprehensive ATS score and customized recommendations.
                            </p>
                            <Link
                                to="/home"
                                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition flex items-center gap-2"
                            >
                                <span>Go to Resume Upload</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}

                    {/* 4. RESULTS DASHBOARD (Plain look with highlighted ATS score & details) */}
                    {!loading && !error && analysis && (
                        <div className="max-w-5xl mx-auto space-y-6 pb-12">
                            {/* Top Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                        Resume Analysis
                                    </h1>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {fileName} • Detailed ATS match report
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/home"
                                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white transition"
                                    >
                                        + Analyze Another Resume
                                    </Link>
                                </div>
                            </div>

                            {/* HIGHLIGHTED ATS SCORE BOX */}
                            <div className="rounded-2xl bg-white/10 border border-white/10 p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            ATS Compatibility Score
                                        </span>
                                        <div className="flex items-baseline gap-3 mt-1.5">
                                            <span className="text-5xl sm:text-6xl font-black text-cyan-400">
                                                {overallScore}
                                            </span>
                                            <span className="text-2xl text-gray-400">/ 100</span>
                                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                                {matchLevel}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-3 max-w-2xl leading-relaxed">
                                            {summaryText}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 min-w-[220px] w-full sm:w-auto">
                                        <div className="text-xs text-gray-400">Hiring Readiness</div>
                                        <div className="text-base font-bold text-white mt-0.5">
                                            {readinessText}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2">
                                            Keyword Match: <span className="text-cyan-400 font-bold">{keywordMatchPct}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SCORE BREAKDOWN */}
                            {analysis.score_breakdown && typeof analysis.score_breakdown === 'object' && !Array.isArray(analysis.score_breakdown) && (
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-3">Score Breakdown</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {Object.entries(analysis.score_breakdown).map(([key, val]) => {
                                            const label = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                            const valNum = safeNumber(val, 0);
                                            return (
                                                <div key={key} className="p-4 rounded-xl bg-white/10 border border-white/10">
                                                    <span className="text-xs text-gray-400 block truncate">{label}</span>
                                                    <span className="text-2xl font-bold text-white mt-1 block">{valNum}%</span>
                                                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                                                        <div
                                                            className="bg-cyan-400 h-1.5 rounded-full"
                                                            style={{ width: `${Math.min(Math.max(valNum, 0), 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* STRENGTHS AND GAPS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 rounded-xl bg-white/10 border border-white/10">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                                        Key Strength
                                    </span>
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {safeString(analysis.overall_assessment?.main_strength, "Strong alignment with core technical requirements.")}
                                    </p>
                                </div>

                                <div className="p-5 rounded-xl bg-white/10 border border-white/10">
                                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                                        Primary Gap / Area to Improve
                                    </span>
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {safeString(analysis.overall_assessment?.main_gap, "Missing specific emphasized keywords and measurable impact.")}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Highlights if available */}
                            {((Array.isArray(analysis.quick_wins) && analysis.quick_wins.length > 0) || (Array.isArray(analysis.high_impact_changes) && analysis.high_impact_changes.length > 0)) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Array.isArray(analysis.quick_wins) && analysis.quick_wins.length > 0 && (
                                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                                                <Zap size={14} /> Quick Wins (Fast ATS Score Boosts)
                                            </div>
                                            <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-200">
                                                {analysis.quick_wins.map((qw, idx) => (
                                                    <li key={idx}>{safeString(qw)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {Array.isArray(analysis.high_impact_changes) && analysis.high_impact_changes.length > 0 && (
                                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                                                <TrendingUp size={14} /> High Impact Adjustments
                                            </div>
                                            <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-200">
                                                {analysis.high_impact_changes.map((hic, idx) => (
                                                    <li key={idx}>{safeString(hic)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB NAVIGATION */}
                            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                                {[
                                    { id: 'improvements', label: 'Action Plan & Improvements', icon: Sparkles },
                                    { id: 'skills', label: 'Skills & Keywords Matrix', icon: Code2 },
                                    { id: 'projects', label: 'Projects & Experience', icon: Briefcase },
                                    { id: 'audit', label: 'Job Match & ATS Audit', icon: FileCheck }
                                ].map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                                                isActive
                                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm'
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-400'} />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* TAB 1: ACTION PLAN & IMPROVEMENTS */}
                            {activeTab === 'improvements' && (
                                <div className="space-y-6">
                                    {/* RESUME IMPROVEMENTS LIST */}
                                    <div className="rounded-2xl bg-white/10 border border-white/10 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-white">Prioritized Improvements</h2>
                                                <p className="text-xs text-gray-400 mt-0.5">Ranked by expected ATS score impact and ease of implementation</p>
                                            </div>
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                                                {Array.isArray(analysis.resume_improvements) ? analysis.resume_improvements.length : 0} items
                                            </span>
                                        </div>

                                        {Array.isArray(analysis.resume_improvements) && analysis.resume_improvements.length > 0 ? (
                                            <div className="space-y-3">
                                                {analysis.resume_improvements.map((item, idx) => {
                                                    const priority = typeof item === 'object' && item !== null ? (item.priority || idx + 1) : idx + 1;
                                                    const category = typeof item === 'object' && item !== null ? safeString(item.category, "General") : "General";
                                                    const impact = typeof item === 'object' && item !== null ? safeString(item.expected_ats_impact, '') : '';
                                                    const difficulty = typeof item === 'object' && item !== null ? safeString(item.difficulty, '') : '';
                                                    const problem = typeof item === 'object' && item !== null ? safeString(item.problem) : safeString(item);
                                                    const recommendation = typeof item === 'object' && item !== null ? safeString(item.recommended_change) : '';

                                                    return (
                                                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                                                                        #{priority}
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-white">
                                                                        {category}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {impact && (
                                                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                                                                            impact.toLowerCase().includes('high')
                                                                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                                                                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                                                        }`}>
                                                                            Impact: {impact}
                                                                        </span>
                                                                    )}
                                                                    {difficulty && (
                                                                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-white/5 text-gray-300 border border-white/10">
                                                                            Difficulty: {difficulty}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {problem && (
                                                                <div className="text-xs text-gray-300 mt-1">
                                                                    <span className="text-rose-400 font-semibold">Issue:</span> {problem}
                                                                </div>
                                                            )}
                                                            {recommendation && (
                                                                <div className="text-xs text-gray-100 mt-1.5 pt-1.5 border-t border-white/5">
                                                                    <span className="text-cyan-400 font-semibold">Recommended Fix:</span> {recommendation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400">No specific improvements suggested.</p>
                                        )}
                                    </div>

                                    {/* LEARNING RECOMMENDATIONS */}
                                    {Array.isArray(analysis.learning_recommendations) && analysis.learning_recommendations.length > 0 && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <BookOpen size={18} className="text-amber-400" />
                                                <h2 className="text-lg font-bold text-white">Recommended Skills to Learn</h2>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-4">
                                                Genuinely missing skills from your profile that are key requirements for this position
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {analysis.learning_recommendations.map((lr, idx) => {
                                                    const skill = typeof lr === 'object' && lr !== null ? safeString(lr.skill, `Skill #${idx + 1}`) : safeString(lr);
                                                    const reason = typeof lr === 'object' && lr !== null ? safeString(lr.reason) : '';
                                                    const jobReq = typeof lr === 'object' && lr !== null ? safeString(lr.job_requirement) : '';
                                                    const priority = typeof lr === 'object' && lr !== null ? safeString(lr.priority) : '';

                                                    return (
                                                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <span className="text-sm font-bold text-amber-300">{skill}</span>
                                                                {priority && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                                                                        {priority.toUpperCase()} PRIORITY
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {jobReq && (
                                                                <p className="text-xs text-gray-300 mt-1">
                                                                    <span className="text-gray-400">Job Requirement:</span> {jobReq}
                                                                </p>
                                                            )}
                                                            {reason && (
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {reason}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* DO NOT ADD SAFEGUARDS */}
                                    {Array.isArray(analysis.do_not_add) && analysis.do_not_add.length > 0 && (
                                        <div className="rounded-2xl bg-rose-500/5 border border-rose-500/20 p-6">
                                            <div className="flex items-center gap-2 mb-1 text-rose-400">
                                                <ShieldAlert size={18} />
                                                <h2 className="text-lg font-bold text-white">Honest ATS Safeguards (Do Not Add)</h2>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-4">
                                                Avoid blindly adding these keywords without genuine hands-on experience to prevent disqualification during technical interviews
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {analysis.do_not_add.map((item, idx) => {
                                                    const skill = typeof item === 'string' ? item : (item.skill_or_keyword || item.skill || item.keyword || safeString(item));
                                                    const reason = typeof item === 'object' && item !== null ? safeString(item.reason) : '';
                                                    return (
                                                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-rose-500/20 text-xs">
                                                            <span className="font-semibold text-rose-400 block">{skill}</span>
                                                            {reason && <span className="text-gray-300 block mt-0.5">{reason}</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* FINAL RECOMMENDATIONS */}
                                    {Array.isArray(analysis.final_recommendations) && analysis.final_recommendations.length > 0 && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6">
                                            <h2 className="text-lg font-bold text-white mb-3">Key Takeaways & Next Steps</h2>
                                            <ul className="space-y-2 text-xs text-gray-300 list-disc list-inside">
                                                {analysis.final_recommendations.map((rec, idx) => (
                                                    <li key={idx} className="leading-relaxed">{safeString(rec)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: SKILLS & KEYWORDS MATRIX */}
                            {activeTab === 'skills' && (
                                <div className="space-y-6">
                                    {/* KEYWORDS SUMMARY & LISTS */}
                                    {analysis.keyword_analysis && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                                <div>
                                                    <h2 className="text-lg font-bold text-white">Keyword Matching Analysis</h2>
                                                    <p className="text-xs text-gray-400 mt-0.5">Evaluation of job description terms and exact keyword matches</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black text-cyan-400">{keywordMatchPct}%</span>
                                                    <span className="text-xs text-gray-400 block">Keyword Match Rate</span>
                                                </div>
                                            </div>

                                            {/* MATCHED KEYWORDS */}
                                            <div>
                                                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
                                                    Matched Keywords ({Array.isArray(analysis.keyword_analysis.matched_keywords) ? analysis.keyword_analysis.matched_keywords.length : 0})
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(analysis.keyword_analysis.matched_keywords) && analysis.keyword_analysis.matched_keywords.length > 0 ? (
                                                        analysis.keyword_analysis.matched_keywords.map((kw, i) => (
                                                            <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                                                                ✓ {safeKeyword(kw)}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No matched keywords detected</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* PARTIALLY MATCHED KEYWORDS */}
                                            {Array.isArray(analysis.keyword_analysis.partially_matched_keywords) && analysis.keyword_analysis.partially_matched_keywords.length > 0 && (
                                                <div>
                                                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-2">
                                                        Partially Matched ({analysis.keyword_analysis.partially_matched_keywords.length})
                                                    </span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.keyword_analysis.partially_matched_keywords.map((kw, i) => (
                                                            <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300">
                                                                ~ {safeKeyword(kw)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* MISSING KEYWORDS */}
                                            {Array.isArray(analysis.keyword_analysis.missing_keywords) && analysis.keyword_analysis.missing_keywords.length > 0 && (
                                                <div>
                                                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-2">
                                                        General Missing Keywords ({analysis.keyword_analysis.missing_keywords.length})
                                                    </span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.keyword_analysis.missing_keywords.map((kw, i) => (
                                                            <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 border border-rose-500/20 text-rose-300">
                                                                ✗ {safeKeyword(kw)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* IMPORTANT MISSING KEYWORDS WITH REASONS */}
                                            {Array.isArray(analysis.keyword_analysis.important_missing_keywords) && analysis.keyword_analysis.important_missing_keywords.length > 0 && (
                                                <div>
                                                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-2">
                                                        Critical Missing Keywords Breakdown ({analysis.keyword_analysis.important_missing_keywords.length})
                                                    </span>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {analysis.keyword_analysis.important_missing_keywords.map((kw, i) => {
                                                            const name = safeKeyword(kw);
                                                            const reason = typeof kw === 'object' && kw !== null ? safeString(kw.reason) : '';
                                                            const shouldLearn = typeof kw === 'object' && kw !== null ? kw.should_candidate_learn : null;

                                                            return (
                                                                <div key={i} className="p-3 rounded-xl bg-white/5 border border-rose-500/20 text-xs">
                                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                                        <span className="font-bold text-rose-300">{name}</span>
                                                                        {shouldLearn !== null && (
                                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                                                                shouldLearn
                                                                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                                                                    : 'bg-white/5 text-gray-300 border-white/10'
                                                                            }`}>
                                                                                {shouldLearn ? 'Candidate Should Learn' : 'Context Gapped'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {reason && <p className="text-gray-400 mt-1">{reason}</p>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* OPTIONAL MISSING KEYWORDS */}
                                            {Array.isArray(analysis.keyword_analysis.optional_missing_keywords) && analysis.keyword_analysis.optional_missing_keywords.length > 0 && (
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                                                        Optional Missing Keywords ({analysis.keyword_analysis.optional_missing_keywords.length})
                                                    </span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.keyword_analysis.optional_missing_keywords.map((kw, i) => (
                                                            <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400">
                                                                {safeKeyword(kw)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* KEYWORD PLACEMENT SUGGESTIONS */}
                                    {Array.isArray(analysis.keyword_placement_suggestions) && analysis.keyword_placement_suggestions.length > 0 && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6">
                                            <h2 className="text-lg font-bold text-white mb-1">Keyword Placement Recommendations</h2>
                                            <p className="text-xs text-gray-400 mb-4">
                                                Skills you have evidence for that should be more prominently placed in specific resume sections
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {analysis.keyword_placement_suggestions.map((kps, idx) => (
                                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <span className="font-bold text-cyan-300">{safeKeyword(kps.keyword)}</span>
                                                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold">
                                                                Place in: {safeString(kps.recommended_section, 'Experience')}
                                                            </span>
                                                        </div>
                                                        {kps.reason && (
                                                            <p className="text-gray-300 mt-1">{safeString(kps.reason)}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* SKILLS ANALYSIS CATEGORIES MATRIX */}
                                    {analysis.skills_analysis && typeof analysis.skills_analysis === 'object' && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-white">Categorized Skills Matrix</h2>
                                                <p className="text-xs text-gray-400 mt-0.5">Deep inspection by technology stack and qualification domain</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(analysis.skills_analysis).map(([catKey, catVal]) => {
                                                    if (!catVal || typeof catVal !== 'object') return null;
                                                    const catTitle = catKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                                    const matched = Array.isArray(catVal.matched) ? catVal.matched : [];
                                                    const partial = Array.isArray(catVal.partially_matched) ? catVal.partially_matched : [];
                                                    const missing = Array.isArray(catVal.missing) ? catVal.missing : [];

                                                    if (matched.length === 0 && partial.length === 0 && missing.length === 0) return null;

                                                    return (
                                                        <div key={catKey} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                                                            <h3 className="text-sm font-bold text-white mb-3 pb-2 border-b border-white/10 flex items-center justify-between">
                                                                <span>{catTitle}</span>
                                                                <span className="text-[10px] text-gray-400 font-normal">
                                                                    {matched.length} matched / {matched.length + partial.length + missing.length} total
                                                                </span>
                                                            </h3>

                                                            <div className="space-y-2.5 text-xs">
                                                                {matched.length > 0 && (
                                                                    <div>
                                                                        <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Matched</span>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {matched.map((s, idx) => (
                                                                                <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                                                                                    {safeKeyword(s)}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {partial.length > 0 && (
                                                                    <div>
                                                                        <span className="text-[11px] font-semibold text-amber-400 block mb-1">Partial Match</span>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {partial.map((s, idx) => (
                                                                                <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                                                                                    {safeKeyword(s)}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {missing.length > 0 && (
                                                                    <div>
                                                                        <span className="text-[11px] font-semibold text-rose-400 block mb-1">Missing</span>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {missing.map((s, idx) => (
                                                                                <span key={idx} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px]">
                                                                                    {safeKeyword(s)}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: PROJECTS & EXPERIENCE */}
                            {activeTab === 'projects' && (
                                <div className="space-y-6">
                                    {/* PROJECT ANALYSIS */}
                                    <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-white">Project Evaluation & Bullets</h2>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Relevance scoring, technology alignment, and ATS-optimized bullet recommendations
                                            </p>
                                        </div>

                                        {Array.isArray(analysis.project_analysis) && analysis.project_analysis.length > 0 ? (
                                            <div className="space-y-4">
                                                {analysis.project_analysis.map((proj, idx) => {
                                                    const pTitle = safeString(proj.project, `Project #${idx + 1}`);
                                                    const pScore = safeNumber(proj.relevance_score, 0);
                                                    const keep = proj.keep_project;
                                                    const techDemo = Array.isArray(proj.technologies_demonstrated) ? proj.technologies_demonstrated : [];
                                                    const reqMatched = Array.isArray(proj.job_requirements_matched) ? proj.job_requirements_matched : [];
                                                    const missingEv = Array.isArray(proj.missing_evidence) ? proj.missing_evidence : [];
                                                    const improvements = Array.isArray(proj.improvements) ? proj.improvements : [];
                                                    const bullets = Array.isArray(proj.suggested_bullets) ? proj.suggested_bullets : [];

                                                    return (
                                                        <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                                                                <div>
                                                                    <h3 className="text-base font-bold text-white">{pTitle}</h3>
                                                                    {keep !== undefined && (
                                                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border inline-block mt-1 ${
                                                                            keep
                                                                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                                                                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                                                        }`}>
                                                                            {keep ? 'Keep Project' : 'Consider Revising / Replacing'}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="text-right">
                                                                    <span className="text-xs text-gray-400 block">Relevance</span>
                                                                    <span className="text-lg font-black text-cyan-400">{pScore}%</span>
                                                                </div>
                                                            </div>

                                                            {/* Demonstrated Tech & Matched */}
                                                            {techDemo.length > 0 && (
                                                                <div>
                                                                    <span className="text-xs font-semibold text-gray-400 block mb-1">Demonstrated Tech:</span>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {techDemo.map((t, tIdx) => (
                                                                            <span key={tIdx} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs">
                                                                                {safeKeyword(t)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {reqMatched.length > 0 && (
                                                                <div>
                                                                    <span className="text-xs font-semibold text-emerald-400 block mb-1">Job Requirements Satisfied:</span>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {reqMatched.map((m, mIdx) => (
                                                                            <span key={mIdx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">
                                                                                ✓ {safeString(m)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Missing Evidence & Improvements */}
                                                            {missingEv.length > 0 && (
                                                                <div className="text-xs text-gray-300">
                                                                    <span className="text-rose-400 font-semibold">Missing Evidence: </span>
                                                                    {missingEv.map(e => safeString(e)).join('; ')}
                                                                </div>
                                                            )}

                                                            {improvements.length > 0 && (
                                                                <div className="text-xs text-gray-300">
                                                                    <span className="text-amber-400 font-semibold">Recommended Improvements: </span>
                                                                    {improvements.map(imp => safeString(imp)).join('; ')}
                                                                </div>
                                                            )}

                                                            {/* SUGGESTED BULLETS WITH COPY BUTTON */}
                                                            {bullets.length > 0 && (
                                                                <div className="pt-2 border-t border-white/5 space-y-2">
                                                                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                                                                        Suggested Action-Oriented Bullets
                                                                    </span>
                                                                    <div className="space-y-2">
                                                                        {bullets.map((bullet, bIdx) => {
                                                                            const bulletText = safeString(bullet);
                                                                            const bulletId = `proj_${idx}_${bIdx}`;
                                                                            const isCopied = copiedId === bulletId;

                                                                            return (
                                                                                <div
                                                                                    key={bIdx}
                                                                                    className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-3 group"
                                                                                >
                                                                                    <p className="text-xs text-gray-200 leading-relaxed flex-1">
                                                                                        • {bulletText}
                                                                                    </p>
                                                                                    <button
                                                                                        onClick={() => handleCopy(bulletText, bulletId)}
                                                                                        title="Copy bullet point to clipboard"
                                                                                        className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition border ${
                                                                                            isCopied
                                                                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                                                                : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'
                                                                                        }`}
                                                                                    >
                                                                                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                                                                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400">No project data analyzed.</p>
                                        )}
                                    </div>

                                    {/* EXPERIENCE ANALYSIS */}
                                    <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-white">Work Experience Evaluation</h2>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Relevance scoring, matched job responsibilities, and quantified bullet revisions
                                            </p>
                                        </div>

                                        {Array.isArray(analysis.experience_analysis) && analysis.experience_analysis.length > 0 ? (
                                            <div className="space-y-4">
                                                {analysis.experience_analysis.map((exp, idx) => {
                                                    const expTitle = safeString(exp.experience, `Experience #${idx + 1}`);
                                                    const expScore = safeNumber(exp.relevance_score, 0);
                                                    const matched = Array.isArray(exp.matched_requirements) ? exp.matched_requirements : [];
                                                    const missing = Array.isArray(exp.missing_evidence) ? exp.missing_evidence : [];
                                                    const improvements = Array.isArray(exp.improvements) ? exp.improvements : [];
                                                    const bullets = Array.isArray(exp.suggested_bullets) ? exp.suggested_bullets : [];

                                                    return (
                                                        <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                                                                <h3 className="text-base font-bold text-white">{expTitle}</h3>
                                                                <div className="text-right">
                                                                    <span className="text-xs text-gray-400 block">Relevance</span>
                                                                    <span className="text-lg font-black text-cyan-400">{expScore}%</span>
                                                                </div>
                                                            </div>

                                                            {matched.length > 0 && (
                                                                <div>
                                                                    <span className="text-xs font-semibold text-emerald-400 block mb-1">Matched Responsibilities:</span>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {matched.map((m, mIdx) => (
                                                                            <span key={mIdx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">
                                                                                ✓ {safeString(m)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {missing.length > 0 && (
                                                                <div className="text-xs text-gray-300">
                                                                    <span className="text-rose-400 font-semibold">Missing Evidence: </span>
                                                                    {missing.map(e => safeString(e)).join('; ')}
                                                                </div>
                                                            )}

                                                            {improvements.length > 0 && (
                                                                <div className="text-xs text-gray-300">
                                                                    <span className="text-amber-400 font-semibold">Suggested Improvements: </span>
                                                                    {improvements.map(imp => safeString(imp)).join('; ')}
                                                                </div>
                                                            )}

                                                            {/* SUGGESTED BULLETS WITH COPY BUTTON */}
                                                            {bullets.length > 0 && (
                                                                <div className="pt-2 border-t border-white/5 space-y-2">
                                                                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                                                                        Suggested High-Impact Bullets
                                                                    </span>
                                                                    <div className="space-y-2">
                                                                        {bullets.map((bullet, bIdx) => {
                                                                            const bulletText = safeString(bullet);
                                                                            const bulletId = `exp_${idx}_${bIdx}`;
                                                                            const isCopied = copiedId === bulletId;

                                                                            return (
                                                                                <div
                                                                                    key={bIdx}
                                                                                    className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-3"
                                                                                >
                                                                                    <p className="text-xs text-gray-200 leading-relaxed flex-1">
                                                                                        • {bulletText}
                                                                                    </p>
                                                                                    <button
                                                                                        onClick={() => handleCopy(bulletText, bulletId)}
                                                                                        title="Copy bullet point to clipboard"
                                                                                        className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition border ${
                                                                                            isCopied
                                                                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                                                                : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'
                                                                                        }`}
                                                                                    >
                                                                                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                                                                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400">No work experience entries evaluated.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: JOB MATCH & ATS AUDIT */}
                            {activeTab === 'audit' && (
                                <div className="space-y-6">
                                    {/* CANDIDATE STRENGTHS & WEAKNESSES DETAIL */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* STRENGTHS */}
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-3">
                                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                                                <CheckCircle2 size={18} />
                                                <span>Demonstrated Strengths</span>
                                            </div>
                                            {Array.isArray(analysis.candidate_strengths) && analysis.candidate_strengths.length > 0 ? (
                                                <div className="space-y-3">
                                                    {analysis.candidate_strengths.map((cs, idx) => (
                                                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <span className="font-bold text-white">{safeString(cs.strength, `Strength #${idx + 1}`)}</span>
                                                                {cs.job_relevance && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                                                                        {safeString(cs.job_relevance).toUpperCase()} RELEVANCE
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {cs.evidence && <p className="text-gray-300 mt-1"><span className="text-gray-400">Evidence:</span> {safeString(cs.evidence)}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400">
                                                    {safeString(analysis.overall_assessment?.main_strength, "No detailed strengths listed.")}
                                                </p>
                                            )}
                                        </div>

                                        {/* WEAKNESSES */}
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-3">
                                            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                                                <AlertTriangle size={18} />
                                                <span>Identified Application Gaps</span>
                                            </div>
                                            {Array.isArray(analysis.candidate_weaknesses) && analysis.candidate_weaknesses.length > 0 ? (
                                                <div className="space-y-3">
                                                    {analysis.candidate_weaknesses.map((cw, idx) => (
                                                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <span className="font-bold text-white">{safeString(cw.weakness, `Gap #${idx + 1}`)}</span>
                                                                {cw.impact_on_application && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                                                                        {safeString(cw.impact_on_application).toUpperCase()} IMPACT
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {cw.evidence && <p className="text-gray-300 mt-1"><span className="text-gray-400">Note:</span> {safeString(cw.evidence)}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400">
                                                    {safeString(analysis.overall_assessment?.main_gap, "No critical gaps listed.")}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* MISSING REQUIREMENTS LIST */}
                                    {Array.isArray(analysis.missing_requirements) && analysis.missing_requirements.length > 0 && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6">
                                            <h2 className="text-lg font-bold text-white mb-1">Missing Requirements Analysis</h2>
                                            <p className="text-xs text-gray-400 mb-4">Detailed breakdown of missing job requirements and whether they can be addressed</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {analysis.missing_requirements.map((mr, idx) => (
                                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="font-bold text-white text-sm">{safeString(mr.requirement, `Requirement #${idx + 1}`)}</span>
                                                            {mr.importance && (
                                                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-semibold">
                                                                    {safeString(mr.importance).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {mr.reason && <p className="text-gray-300">{safeString(mr.reason)}</p>}
                                                        <div className="flex flex-wrap gap-2 pt-1">
                                                            {mr.can_be_added_from_existing_experience && (
                                                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                                                                    Can add from experience
                                                                </span>
                                                            )}
                                                            {mr.should_candidate_learn && (
                                                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                                                                    Recommend learning
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* JOB REQUIREMENTS EXTRACTED */}
                                    {analysis.job_requirements && typeof analysis.job_requirements === 'object' && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-white">Extracted Job Requirements</h2>
                                                <p className="text-xs text-gray-400 mt-0.5">Parsed requirements from the uploaded job description</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(analysis.job_requirements).map(([reqKey, reqVal]) => {
                                                    if (!Array.isArray(reqVal) || reqVal.length === 0) return null;
                                                    const reqTitle = reqKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                                                    return (
                                                        <div key={reqKey} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                                                                {reqTitle} ({reqVal.length})
                                                            </h3>
                                                            <ul className="space-y-1 list-disc list-inside text-xs text-gray-300">
                                                                {reqVal.map((item, i) => (
                                                                    <li key={i}>{safeString(item)}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* FORMATTING & ATS AUDIT */}
                                    {analysis.formatting_analysis && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-4">
                                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                                                <div>
                                                    <h2 className="text-lg font-bold text-white">Resume Formatting Audit</h2>
                                                    <p className="text-xs text-gray-400 mt-0.5">ATS machine readability and document structure</p>
                                                </div>
                                                <div>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                                                        analysis.formatting_analysis.ats_friendly
                                                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                                    }`}>
                                                        {analysis.formatting_analysis.ats_friendly ? '✓ ATS Friendly Format' : '⚠ Formatting Needs Revision'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                {analysis.formatting_analysis.date_consistency && (
                                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                        <span className="text-gray-400 block mb-0.5 font-medium">Date Consistency:</span>
                                                        <span className="text-white font-semibold">{safeString(analysis.formatting_analysis.date_consistency)}</span>
                                                    </div>
                                                )}
                                                {analysis.formatting_analysis.bullet_consistency && (
                                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                        <span className="text-gray-400 block mb-0.5 font-medium">Bullet Consistency:</span>
                                                        <span className="text-white font-semibold">{safeString(analysis.formatting_analysis.bullet_consistency)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Formatting Issues */}
                                            {Array.isArray(analysis.formatting_analysis.issues) && analysis.formatting_analysis.issues.length > 0 && (
                                                <div>
                                                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1.5">
                                                        Detected Formatting Issues ({analysis.formatting_analysis.issues.length})
                                                    </span>
                                                    <ul className="space-y-1 list-disc list-inside text-xs text-gray-300">
                                                        {analysis.formatting_analysis.issues.map((iss, i) => (
                                                            <li key={i}>{safeString(iss)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Formatting Recommendations */}
                                            {Array.isArray(analysis.formatting_analysis.formatting_recommendations) && analysis.formatting_analysis.formatting_recommendations.length > 0 && (
                                                <div>
                                                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1.5">
                                                        Formatting Recommendations
                                                    </span>
                                                    <ul className="space-y-1 list-disc list-inside text-xs text-gray-300">
                                                        {analysis.formatting_analysis.formatting_recommendations.map((rec, i) => (
                                                            <li key={i}>{safeString(rec)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* CONTENT QUALITY EVALUATION */}
                                    {analysis.content_analysis && typeof analysis.content_analysis === 'object' && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-white">Content Quality Analysis</h2>
                                                <p className="text-xs text-gray-400 mt-0.5">Linguistic strength, action verbs, and quantifiable impact</p>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {Object.entries(analysis.content_analysis).map(([cqKey, cqVal]) => {
                                                    const cqLabel = cqKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                                    return (
                                                        <div key={cqKey} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                                                            <span className="text-gray-400 block mb-1 truncate">{cqLabel}</span>
                                                            <span className="text-white font-semibold block leading-tight">{safeString(cqVal, 'N/A')}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* EDUCATION ANALYSIS */}
                                    {analysis.education_analysis && (
                                        <div className="rounded-2xl bg-white/10 border border-white/10 p-6 space-y-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 text-white font-bold text-base">
                                                    <GraduationCap size={18} className="text-cyan-400" />
                                                    <span>Education Alignment</span>
                                                </div>
                                                {analysis.education_analysis.education_strength && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                                        {safeString(analysis.education_analysis.education_strength)}
                                                    </span>
                                                )}
                                            </div>

                                            {Array.isArray(analysis.education_analysis.matched_requirements) && analysis.education_analysis.matched_requirements.length > 0 && (
                                                <div className="text-xs text-gray-300">
                                                    <span className="text-emerald-400 font-semibold">Matched Education: </span>
                                                    {analysis.education_analysis.matched_requirements.map(e => safeString(e)).join(', ')}
                                                </div>
                                            )}

                                            {Array.isArray(analysis.education_analysis.missing_requirements) && analysis.education_analysis.missing_requirements.length > 0 && (
                                                <div className="text-xs text-gray-300">
                                                    <span className="text-rose-400 font-semibold">Missing Education: </span>
                                                    {analysis.education_analysis.missing_requirements.map(e => safeString(e)).join(', ')}
                                                </div>
                                            )}

                                            {Array.isArray(analysis.education_analysis.recommendations) && analysis.education_analysis.recommendations.length > 0 && (
                                                <div className="pt-2 border-t border-white/5">
                                                    <span className="text-xs font-semibold text-gray-400 block mb-1">Recommendations:</span>
                                                    <ul className="space-y-1 list-disc list-inside text-xs text-gray-300">
                                                        {analysis.education_analysis.recommendations.map((r, i) => (
                                                            <li key={i}>{safeString(r)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ResumeAnalysis = () => {
    return (
        <ErrorBoundary>
            <ResumeAnalysisContent />
        </ErrorBoundary>
    );
};

export default ResumeAnalysis;