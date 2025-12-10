import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, LogOut, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session on mount
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);
      } catch (err) {
        // ignore
      }
    };
    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => {
      // unsubscribe listener
      try { listener.subscription.unsubscribe(); } catch (e) {}
    };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message || 'Sign-in failed');
      } else {
        // Listen for SIGNED_IN event and navigate only after session is confirmed
        const { data: authListener } = supabase.auth.onAuthStateChange((event, payload) => {
          if (event === 'SIGNED_IN' && payload?.session) {
            setSession(payload.session);
            setMessage('Signed in');
            // Unsubscribe immediately after first successful sign-in
            try { authListener.subscription.unsubscribe(); } catch (e) {}
            navigate('/admin');
          }
        });
      }
    } catch (err: any) {
      setMessage(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setMessage('Signed out');
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#0f1012]">
      <div className="max-w-md mx-auto">
        <div className="clay-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock size={20} /> Admin Login
          </h2>

          {session ? (
            <div className="space-y-4">
              <p className="text-gray-300">Signed in as <strong className="text-white">{session.user?.email}</strong></p>
              <div className="flex gap-2">
                <button onClick={() => navigate('/admin')} className="clay-btn-accent flex-1 py-2 flex items-center justify-center gap-2">
                  <LogIn size={16} /> Go to Admin
                </button>
                <button onClick={handleSignOut} className="clay-btn flex-1 py-2 flex items-center justify-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <p className="text-gray-400">Admin login — enter the email and password registered in Supabase Auth.</p>
              <input
                type="email"
                placeholder="you@example.com"
                className="clay-input w-full p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="clay-input w-full p-3 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="clay-btn-accent flex-1 py-3 font-bold flex items-center justify-center gap-2">
                  <LogIn size={16} /> {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <button type="button" onClick={() => { setEmail(''); setPassword(''); setMessage(''); }} className="clay-btn flex-1 py-3">
                  Clear
                </button>
              </div>
              {message && <p className="text-sm text-gray-300">{message}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
