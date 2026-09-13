import axios from 'axios';

export const getBaseURL = () => {
    let rawUrl = import.meta.env.VITE_API_URL;

    // Check runtime browser environment for smart auto-detection
    if (typeof window !== 'undefined') {
        const storedUrl = localStorage.getItem('API_URL') || window.__API_URL__;
        if (storedUrl) {
            rawUrl = storedUrl;
        } else if (!rawUrl) {
            const host = window.location.hostname;
            // Only fallback to localhost if actually running on localhost
            if (host === 'localhost' || host === '127.0.0.1') {
                return 'http://localhost:3000/api/auth';
            }
            // Auto-detect Render Blueprint companion backend (frontend -> backend)
            if (host.includes('-frontend.onrender.com')) {
                rawUrl = `https://${host.replace('-frontend.onrender.com', '-backend.onrender.com')}`;
            } else if (host.includes('-frontend.')) {
                rawUrl = `https://${host.replace('-frontend.', '-backend.')}`;
            } else {
                // Same-origin deployment (e.g. single service or reverse proxy)
                rawUrl = window.location.origin;
            }
        }
    }

    if (!rawUrl) {
        return 'http://localhost:3000/api/auth';
    }

    rawUrl = rawUrl.trim();
    if (rawUrl.startsWith('/')) {
        return rawUrl.endsWith('/api/auth') ? rawUrl : `${rawUrl.replace(/\/+$/, '')}/api/auth`;
    }
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        rawUrl = `https://${rawUrl}`;
    }
    if (!rawUrl.endsWith('/api/auth')) {
        rawUrl = `${rawUrl.replace(/\/+$/, '')}/api/auth`;
    }
    return rawUrl;
};

const API = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// Request interceptor to attach dynamic baseURL and token
API.interceptors.request.use((config) => {
    config.baseURL = getBaseURL();
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle unauthenticated 401 responses and network error hints
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.warn(
                `[API Network Error] Could not reach backend API at: ${getBaseURL()}.\n` +
                `If deployed on Render, verify:\n` +
                `1. Your backend Web Service is active (not crashed/spinning up).\n` +
                `2. VITE_API_URL is set in your frontend Static Site environment settings on Render.\n` +
                `3. You triggered "Clear build cache & deploy" after setting VITE_API_URL.\n` +
                `You can also set localStorage.setItem('API_URL', 'https://your-backend.onrender.com') in the browser console.`
            );
        }
        if (error.response && error.response.status === 401) {
            const path = window.location.pathname;
            if (path !== '/login' && path !== '/signup' && path !== '/') {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authApi = {
    login: async (credentials) => {
        const response = await API.post('/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await API.post('/register', userData);
        return response.data;
    },
    logout: async () => {
        const response = await API.post('/logout');
        return response.data;
    },
    getMe: async () => {
        const response = await API.get('/me');
        return response.data;
    }
};

// Resume and Analysis endpoints
export const resumeApi = {
    uploadPDF: async (file) => {
        const formData = new FormData();
        formData.append('pdf', file);
        const response = await API.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    analyzeResume: async (resumeId, jobDescription) => {
        const response = await API.post(`/analysis/${resumeId}`, {
            jobDescription
        });
        return response.data;
    },
    getAnalysis: async (resumeId) => {
        const response = await API.get(`/analysis/${resumeId}/response`);
        return response.data;
    },
    getHistory: async () => {
        const response = await API.get('/history');
        return response.data;
    }
};

export default API;
