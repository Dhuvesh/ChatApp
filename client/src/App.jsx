import { Navigate, Route, Routes } from "react-router-dom";
import  Navbar  from "./components/Navbar";
import { axiosInstance } from "./lib/axios";
import { useAuthStore } from "./store/useAuthStore";
import { use, useEffect } from "react";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import {Loader} from 'lucide-react'
import { useThemeStore } from "./store/useThemeStore";

export default function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});



  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
  
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage />:<Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage />:<Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage />: <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}