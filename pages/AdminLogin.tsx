import React, { useState } from 'react';

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate against the admin key from environment
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey })
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        window.location.hash = '#/admin';
        window.location.reload();
      } else {
        setError(data.message || 'Invalid admin key');
      }
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#0f1729] to-[#0B1120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <main className="w-full max-w-md relative z-10">
        <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5">
          {/* Back Button */}
          <button
            onClick={() => window.location.hash = '#/login'}
            className="flex items-center gap-2 text-slate-400 hover:text-[#34D399] transition-colors mb-6 bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="text-sm">Back to Login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#34D399]/10 mb-4">
              <span className="material-symbols-outlined text-[#34D399] text-4xl">admin_panel_settings</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Administrator Access</h1>
            <p className="text-slate-400 text-sm">Enter your admin key to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-400 text-xl">error</span>
                <p className="text-red-400 text-sm flex-1">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="adminKey" className="block text-sm font-medium text-slate-300">
                Admin Key
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">key</span>
                <input
                  id="adminKey"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter your admin key"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0f1729] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#34D399]/50 focus:border-[#34D399]/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !adminKey}
              className="w-full py-3.5 rounded-xl bg-[#34D399] text-[#0B1120] font-bold text-base shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] hover:bg-[#6EE7B7] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-400 text-xl">shield</span>
              <div className="flex-1">
                <p className="text-amber-400 text-xs font-medium mb-1">Security Notice</p>
                <p className="text-slate-400 text-xs">
                  This is a protected area. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
