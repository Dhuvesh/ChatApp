import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User, Lock, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const {signup, isSigningUp} = useAuthStore();

  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!/^\S+@\S+\.\S+$/.test(formData.email)) return toast.error("Invalid email format");
    if(!formData.password.trim()) return toast.error("Password is required");
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters long");

    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if(success){
      signup(formData);
    }
  };

  const getRandomSize = () => Math.random() * 6 + 2;
  const getRandomDuration = () => Math.random() * 15 + 10;

  return (
    <div className="min-h-screen relative bg-base-300 flex items-center justify-center overflow-hidden pt-20">
      {/* Background animations - same as before */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-[800px] h-[800px] bg-primary/40 rounded-full mix-blend-overlay filter blur-3xl opacity-80 animate-float" />
        <div className="absolute -bottom-8 right-0 w-[800px] h-[800px] bg-secondary/40 rounded-full mix-blend-overlay filter blur-3xl opacity-80 animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-accent/40 rounded-full mix-blend-overlay filter blur-3xl opacity-80 animate-float-slow" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-overlay filter blur-xl opacity-60 animate-float-slower" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/30 rounded-full mix-blend-overlay filter blur-xl opacity-60 animate-float-fast" />
        
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:50px_50px] animate-grid-fade" />
        
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-base-content/20 animate-particle"
            style={{
              width: `${getRandomSize()}px`,
              height: `${getRandomSize()}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${getRandomDuration()}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md p-6 mx-4">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-base-200/70 backdrop-blur-md rounded-xl shadow-lg">
              <MessageSquare size={32} className="text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-base-content mb-2">Create Account</h2>
          <p className="text-base-content/70">Join our chat community today</p>
        </div>

        {/* Signup Form with Fixed Input Alignment */}
        <div className="card bg-base-200/70 backdrop-blur-md shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input - Fixed Alignment */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input input-bordered w-full pl-10 bg-base-100/70"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-base-content/60" />
                  </div>
                </div>
              </div>

              {/* Email Input - Fixed Alignment */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input input-bordered w-full pl-10 bg-base-100/70"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/60" />
                  </div>
                </div>
              </div>

              {/* Password Input - Fixed Alignment */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input input-bordered w-full pl-10 pr-10 bg-base-100/70"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/60" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-base-content/60 hover:text-base-content" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/60 hover:text-base-content" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            </form>

            {/* Sign In Link */}
            <div className="text-center text-base-content/70 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>

            {/* Theme Selector */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;