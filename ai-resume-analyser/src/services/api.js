import axios from 'axios';

const getBaseURL = () => {
    let rawUrl = import.meta.env.VITE_API_URL;
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

// Request interceptor to attach token from localStorage if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle unauthenticated 401 responses
API.interceptors.response.use(
    (response) => response,
    (error) => {
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
