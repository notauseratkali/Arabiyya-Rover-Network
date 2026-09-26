import React from 'react';
import { X, MapPin, Award, Heart, Compass, Shield, Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { RoverMember } from '../types';

interface MemberProfileModalProps {
  member: RoverMember;
  onClose: () => void;
  onOpenIdCard?: (member: RoverMember) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  member,
  onClose,
  onOpenIdCard,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Banner with Profile Header */}
        <div className="relative bg-gradient-to-r from-maroon-900 via-maroon-800 to-navy-900 text-white p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-20 h-20 rounded-xl object-cover border-2 border-white/50 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-skyrover-500/20 text-skyrover-300 border border-skyrover-400/30">
                  {member.role}
                </span>
                <span className="text-xs text-slate-300">
                  ID: <span className="font-mono text-white font-medium">{member.id}</span>
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">{member.name}</h2>
              <div className="text-xs text-slate-200 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-medium text-skyrover-200">{member.crewName}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-skyrover-300" />
                  {member.unitDistrict}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Rank Stage</div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 truncate">{member.rankStage}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Service Hours</div>
              <div className="font-bold text-maroon-800 text-sm mt-0.5 font-mono tabular-nums">
                {member.totalServiceHours} hrs
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Badges Earned</div>
              <div className="font-bold text-navy-800 text-sm mt-0.5 font-mono tabular-nums">
                {member.badges.length} badges
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Blood Group</div>
              <div className="font-bold text-rose-700 text-sm mt-0.5 font-mono">
                {member.bloodGroup}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
              Scouting Bio & Focus
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              {member.bio || 'Active Rover Scout contributing to crew expeditions and community civic service.'}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Scouting & Field Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {member.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium text-navy-800 bg-skyrover-50 border border-skyrover-200 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Badges Earned */}
          <div>
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Earned Badges & Recognitions ({member.badges.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {member.badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-maroon-100 flex items-center justify-center shrink-0 text-maroon-800">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{badge.name}</span>
                      {badge.status === 'completed' ? (
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Earned</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-medium">In Progress ({badge.progressPercent}%)</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{badge.description}</p>
                    {badge.dateEarned && (
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Earned: {badge.dateEarned}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          {member.recentActivities && member.recentActivities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Recent Logged Activity
              </h3>
              <div className="space-y-2">
                {member.recentActivities.slice(0, 3).map(act => (
                  <div key={act.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <div className="font-semibold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <span>{act.date}</span>
                        <span className="mx-1">·</span>
                        <span>{act.location}</span>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-navy-800 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
                      {act.hours} hrs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contact & Contact info */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">Direct Contact</span>
              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{member.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">Emergency (ICE) Contact</span>
              <div className="mt-1 space-y-0.5">
                <div className="font-medium text-slate-900">
                  {member.emergencyContact.name} ({member.emergencyContact.relation})
                </div>
                <div className="font-mono text-slate-600 flex items-center gap-1 text-[11px]">
                  <Phone className="w-3 h-3 text-rose-600" />
                  <span>{member.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {onOpenIdCard ? (
            <button
              onClick={() => {
                onClose();
                onOpenIdCard(member);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-900 bg-skyrover-100 hover:bg-skyrover-200 rounded-lg transition-colors border border-skyrover-300"
            >
              <Shield className="w-4 h-4 text-skyrover-600" />
              <span>Generate Membership ID Pass</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
