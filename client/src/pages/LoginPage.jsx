import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {login, isLoggingIn} = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData);

  };

  const getRandomSize = () => Math.random() * 6 + 2;
  const getRandomDuration = () => Math.random() * 15 + 10;

  return (
    <div className="min-h-screen relative bg-base-300 flex items-center justify-center overflow-hidden pt-20">
      {/* Background animations */}
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
          <h2 className="text-3xl font-bold text-base-content mb-2">Welcome Back</h2>
          <p className="text-base-content/70">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="card bg-base-200/70 backdrop-blur-md shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
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

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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
                {/* <label className="label">
                  <a href="#" className="label-text-alt link link-primary">Forgot password?</a>
                </label> */}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center text-base-content/70 mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="link link-primary">Sign Up</Link>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;