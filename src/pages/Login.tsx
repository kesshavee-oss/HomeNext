import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Home, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full -ml-48 -mb-48 blur-3xl" />
        
        <Link to="/" className="flex items-center space-x-2 relative z-10">
          <div className="bg-white p-1.5 rounded-lg">
            <Home className="h-6 w-6 text-primary-600" />
          </div>
          <span className="text-2xl font-display font-bold">HomeNest India</span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Your journey to a <br />
            <span className="text-primary-200">perfect home</span> starts here.
          </h1>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-1 rounded-full mt-1">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-primary-50">Access to 10,000+ mid-budget properties across India.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-1 rounded-full mt-1">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-primary-50">Save your favorite homes and track your visits.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-1 rounded-full mt-1">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-primary-50">Direct contact with verified real estate agents.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-primary-200 text-sm">
          &copy; {new Date().getFullYear()} HomeNest India. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Enter your credentials to access your account' : 'Join HomeNest India and find your dream home'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center">
              <X className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-white border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-white border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-slate-600">Remember me</span>
                </label>
                <button type="button" className="text-sm font-bold text-primary-600 hover:underline">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center group"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-primary-600 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Login;
