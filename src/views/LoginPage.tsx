import React, { useState } from 'react';
import { Compass, Lock, Mail, ArrowRight, Shield, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { RoverMember, ActiveTab } from '../types';
import { ASSETS } from '../data/mockData';

interface LoginPageProps {
  members: RoverMember[];
  onLoginSuccess: (member: RoverMember) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  members,
  onLoginSuccess,
  setActiveTab,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const member = members.find(m => m.email.toLowerCase() === trimmedEmail);

      if (!member) {
        setError('No active Rover account found matching that email address.');
        setIsLoading(false);
        return;
      }

      // Check password (or accept default password123 for registered mock users)
      if (member.password && member.password !== password) {
        setError('Invalid password. Please check your credentials or test with a preset account.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLoginSuccess(member);
    }, 350);
  };

  const handleQuickDemoLogin = (demoMember: RoverMember) => {
    setEmail(demoMember.email);
    setPassword(demoMember.password || 'password123');
    setError(null);
    onLoginSuccess(demoMember);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-maroon-900 items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6 text-skyrover-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Rover Portal Sign In
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Authentication required to access personal Rover dashboard, logbook, and ID card.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
          
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Scout Network Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="scout.name@network.org"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: password123</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset One-Click Demo Accounts for Testing */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-navy-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-skyrover-600" />
              <span>Instant Test Logins (Select Role)</span>
            </div>

            <div className="space-y-1.5">
              {members.slice(0, 3).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(m)}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-skyrover-50 border border-slate-200/80 hover:border-skyrover-200 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={m.avatarUrl}
                      alt={m.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="text-xs truncate">
                      <span className="font-semibold text-slate-800 group-hover:text-maroon-900">{m.name}</span>
                      <span className="text-slate-400 ml-1.5 text-[11px]">({m.role})</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-navy-800 group-hover:text-maroon-800 shrink-0">
                    Quick Log In &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* New User Link */}
          <div className="text-center pt-2 text-xs text-slate-500">
            <span>Don&apos;t have a Rover account yet? </span>
            <button
              onClick={() => setActiveTab('signup')}
              className="font-bold text-maroon-900 hover:text-maroon-700 underline underline-offset-2"
            >
              Sign Up for Crew Portal
            </button>
          </div>

        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Protected Rover Scout Council Network. Safe from Harm Compliant.</span>
        </p>

      </div>
    </div>
  );
};
