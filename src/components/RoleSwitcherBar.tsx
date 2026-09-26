import React from 'react';
import { Shield, User, Users, CheckCircle, ChevronRight, Sliders, Globe } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSwitcherBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userName: string;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onRoleChange,
  userName,
}) => {
  const roles: Array<{ id: UserRole; label: string; desc: string; color: string }> = [
    { id: 'Guest', label: 'Guest / Public', desc: 'Public Portal & Tracker', color: 'bg-slate-700' },
    { id: 'Explorer', label: 'Explorer (<18)', desc: 'Explorer Logbook & Badges', color: 'bg-sky-600' },
    { id: 'Rover', label: 'Rover (18–26)', desc: 'Full Dashboard & Roster', color: 'bg-rose-900' },
    { id: 'Leader', label: 'Crew Leader', desc: 'Logbook Review & Pipeline', color: 'bg-emerald-800' },
    { id: 'Secretary', label: 'Council Secretary', desc: 'Minutes, Events & Broadcast', color: 'bg-amber-800' },
    { id: 'Admin', label: 'System Admin', desc: 'Full Control & SSO Keys', color: 'bg-purple-900' },
  ];

  return (
    <div className="bg-navy-950 text-white border-b border-navy-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Portal Host Identity */}
        <div className="flex items-center gap-2 text-slate-300">
          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-navy-900 px-2.5 py-0.5 rounded border border-navy-700 text-skyrover-300">
            <Globe className="w-3 h-3 text-skyrover-400" />
            <span>portal.arabiyyascouts.org</span>
          </div>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300 font-medium">
            Active Identity: <strong className="text-white">{userName}</strong> ({currentRole})
          </span>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mr-1 shrink-0 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-skyrover-400" />
            <span>Switch RBAC:</span>
          </span>

          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => onRoleChange(r.id)}
              title={r.desc}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                currentRole === r.id
                  ? `${r.color} text-white font-bold ring-2 ring-white/30 shadow-sm`
                  : 'bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700/60'
              }`}
            >
              <span>{r.label}</span>
              {currentRole === r.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
