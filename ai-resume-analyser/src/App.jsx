import React from "react";
import Maincomp from "./components/Maincomp";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResumeAnalysis from "./components/ResumeAnalysis";
import History from "./components/History";
import Profile from "./components/Profile";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Maincomp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/resumeanalysis" element={<ResumeAnalysis />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;