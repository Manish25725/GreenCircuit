import React, { useState } from 'react';
import { api } from '../services/api';

const Login = () => {
  const [mode, setMode] = useState<'Login' | 'Sign Up'>('Login');
  const [role, setRole] = useState('resident');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Map frontend role to backend role
      const roleMap: Record<string, string> = {
        'resident': 'user',
        'business': 'business', 
        'partner': 'agency',
        'admin': 'admin'
      };
      const backendRole = roleMap[role] || 'user';

      let user;
      if (mode === 'Login') {
        user = await api.login(email, password);
        
        // Navigate based on user role from response
        if (user.role === 'agency') {
          // Check if agency is approved before redirecting to dashboard
          try {
            const agencyStatus = await api.get('/agencies/dashboard/me');
            const responseData = agencyStatus.data?.data || agencyStatus.data;
            const status = responseData?.status;
            
            console.log('Agency status response:', agencyStatus.data);
            console.log('Parsed status:', status);
            
            if (status === 'approved') {
              window.location.hash = '#/agency';
            } else {
              // pending, rejected, or any other status - show tracker
              window.location.hash = '#/partner/pending';
            }
          } catch (error) {
            console.error('Error checking agency status:', error);
            // No agency found or error, redirect to registration
            window.location.hash = '#/partner/register';
          }
        } else if (user.role === 'business') {
          window.location.hash = '#/business';
        } else if (user.role === 'admin') {
          window.location.hash = '#/admin';
        } else {
          window.location.hash = '#/dashboard';
        }
      } else {
        // Sign up
        user = await api.register(name, email, password, backendRole);
        
        // For new partner signup, redirect to registration form
        if (user.role === 'agency') {
          window.location.hash = '#/partner/register';
        } else if (user.role === 'business') {
          window.location.hash = '#/business';
        } else if (user.role === 'admin') {
          window.location.hash = '#/admin';
        } else {
          window.location.hash = '#/dashboard';
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0B1120] font-sans text-slate-300 selection:bg-[#34D399] selection:text-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#34D399]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="size-10 text-[#34D399] flex items-center justify-center">
                    <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                    </svg>
                </div>
                <span className="text-white text-2xl font-black tracking-tight hidden sm:block">EcoCycle</span>
            </div>
            <button onClick={() => window.location.hash = '#/'} className="text-sm font-bold text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                Back to Home
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-md p-6 animate-fade-in-up">
        <div className="bg-[#1E293B]/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{mode} to EcoCycle</h1>
                <p className="text-slate-400">Welcome back! Please select your role to continue.</p>
            </div>

            {/* Toggle */}
            <div className="bg-[#0B1120] p-1 rounded-xl flex mb-6">
                {['Login', 'Sign Up'].map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m as 'Login' | 'Sign Up')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${
                            mode === m 
                            ? 'bg-[#34D399] text-[#0B1120] shadow-lg' 
                            : 'bg-transparent text-slate-400 hover:text-white'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Role Selection */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'resident', label: 'Resident', icon: 'person' },
                        { id: 'business', label: 'Business', icon: 'apartment' },
                        { id: 'partner', label: 'Partner', icon: 'recycling' }
                    ].map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => setRole(item.id)}
                            className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${
                                role === item.id 
                                ? 'bg-[#34D399]/10 border-[#34D399] text-[#34D399]' 
                                : 'bg-[#0B1120]/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#0B1120]'
                            }`}
                        >
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            <span className="text-xs font-bold">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#34D399] transition-colors text-[20px]">mail</span>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0B1120] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    {mode === 'Sign Up' && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#34D399] transition-colors text-[20px]">person</span>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0B1120] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#34D399] transition-colors text-[20px]">lock</span>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0B1120] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-white/10 bg-[#0B1120] text-[#34D399] focus:ring-[#34D399] focus:ring-offset-0" />
                        <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                    </label>
                    <a href="#" className="text-[#34D399] hover:text-[#6EE7B7] font-medium transition-colors">Forgot password?</a>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#34D399] text-[#0B1120] font-bold text-base shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] hover:bg-[#6EE7B7] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Please wait...' : (mode === 'Login' ? 'Sign In' : 'Create Account')}
                </button>
                
                <div className="mt-2 flex items-center justify-center gap-2 border-t border-white/5 pt-6">
                    <span className="material-symbols-outlined text-slate-500 text-[18px]">admin_panel_settings</span>
                    <p className="text-xs text-slate-500">
                    Are you an Administrator? 
                    <a className="font-medium text-[#34D399] hover:underline hover:text-[#34D399]/80 ml-1 cursor-pointer" onClick={() => window.location.hash = '#/admin'}>
                        Log in here
                    </a>
                    </p>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
};

export default Login;