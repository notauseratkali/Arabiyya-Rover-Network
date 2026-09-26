import React, { useState } from 'react';
import { 
  Shield, 
  Clock, 
  Award, 
  Compass, 
  Plus, 
  Edit3, 
  Users, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Bell, 
  ChevronRight,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { RoverMember, RoverCrew, Announcement, ActivityLog, ActiveTab } from '../types';
import { ANNOUNCEMENTS } from '../data/mockData';
import { CouncilReviewPanel } from '../components/CouncilReviewPanel';

interface DashboardViewProps {
  currentUser: RoverMember;
  crews: RoverCrew[];
  allMembers: RoverMember[];
  onOpenIdCard: () => void;
  onOpenLogHours: () => void;
  onOpenEditProfile: () => void;
  onSelectMember: (member: RoverMember) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  crews,
  allMembers,
  onOpenIdCard,
  onOpenLogHours,
  onOpenEditProfile,
  onSelectMember,
}) => {
  const [dashboardMode, setDashboardMode] = useState<'member' | 'council'>('member');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Service' | 'Training' | 'Crew Meet'>('All');

  // Find user's crew
  const myCrew = crews.find(c => c.id === currentUser.crewId) || crews[0];
  
  // Find crew mates
  const crewMates = allMembers.filter(m => m.crewId === currentUser.crewId && m.id !== currentUser.id);

  // Filter activities
  const filteredActivities = (currentUser.recentActivities || []).filter(act => {
    if (activityFilter === 'All') return true;
    return act.type === activityFilter;
  });

  // Calculate BP Award progress estimation
  const bpTargetHours = 100;
  const serviceProgressPercent = Math.min(100, Math.round((currentUser.totalServiceHours / bpTargetHours) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Top Welcome & Member Credential Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Banner strip in maroon & navy */}
        <div className="h-24 sm:h-28 bg-gradient-to-r from-maroon-950 via-maroon-900 to-navy-900 relative">
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <span className="text-[11px] text-skyrover-300 font-mono">PORTAL ID: {currentUser.id}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Member profile bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                <span className="absolute bottom-1 right-1 bg-navy-900 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-white">
                  {currentUser.bloodGroup}
                </span>
              </div>

              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {currentUser.name}
                  </h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-maroon-100 text-maroon-900 border border-maroon-200">
                    {currentUser.role}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  <span className="font-semibold text-navy-900">{currentUser.crewName}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>{currentUser.unitDistrict}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span className="text-slate-500">Member since {currentUser.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              <button
                onClick={onOpenIdCard}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-navy-900 bg-skyrover-50 hover:bg-skyrover-100 border border-skyrover-200 rounded-xl transition-colors shadow-2xs"
              >
                <Shield className="w-3.5 h-3.5 text-skyrover-600" />
                <span>View Digital ID Card</span>
              </button>

              <button
                onClick={onOpenLogHours}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-skyrover-300" />
                <span>Log Service Hours</span>
              </button>

              <button
                onClick={onOpenEditProfile}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                title="Edit My Profile"
                aria-label="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Quick Bio snippet */}
          <div className="pt-2 text-xs text-slate-600 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="italic text-slate-700">
              &ldquo;{currentUser.bio}&rdquo;
            </p>
            <div className="flex items-center gap-3 shrink-0 text-slate-500">
              <span>ICE Contact: <strong className="text-slate-700">{currentUser.emergencyContact.name} ({currentUser.emergencyContact.relation})</strong></span>
              <span className="font-mono text-slate-700">{currentUser.emergencyContact.phone}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Dashboard Sub-View Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDashboardMode('member')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              dashboardMode === 'member'
                ? 'bg-maroon-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-skyrover-300" />
            <span>My Scout Progression &amp; Crew Records</span>
          </button>

          <button
            onClick={() => setDashboardMode('council')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              dashboardMode === 'council'
                ? 'bg-navy-950 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Council Review &amp; Pipeline Applications</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
          1st Arabiyya Scout Group / Arabiyya Rover Network
        </span>
      </div>

      {dashboardMode === 'council' ? (
        <CouncilReviewPanel />
      ) : (
        <>
          {/* Quantitative Metric Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Service Hours</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-maroon-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {currentUser.totalServiceHours} <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span className="text-maroon-800 font-semibold">{serviceProgressPercent}%</span> toward 100hr Service Star
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-maroon-800 h-1.5 rounded-full" style={{ width: `${serviceProgressPercent}%` }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rank & Stage</span>
            <div className="p-1.5 rounded-lg bg-skyrover-50 text-skyrover-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {currentUser.rankStage}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Progressing to Baden-Powell Award
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-skyrover-500 h-1.5 rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Badges Earned</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {currentUser.badges?.length || currentUser.badgesCount} <span className="text-xs font-normal text-slate-500">badges</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Leadership & community skills
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Logged Sessions</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-navy-900">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {currentUser.recentActivities?.length || 0} <span className="text-xs font-normal text-slate-500">events</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Recorded in member logbook
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-navy-800 h-1.5 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>

      </div>

      {/* Main Grid: Left Column (Logbook & Badges) + Right Column (Crew Roster & Bulletins) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Activity & Service Logbook */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Rover Logbook & Service Records
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified community service hours, scout workshops, and crew meetings.
                </p>
              </div>

              {/* Segmented Filter Control */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
                {(['All', 'Service', 'Training', 'Crew Meet'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActivityFilter(tab)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      activityFilter === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filteredActivities.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {filteredActivities.map(act => (
                  <div key={act.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">{act.title}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                          act.type === 'Service'
                            ? 'bg-rose-50 text-maroon-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {act.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{act.date}</span>
                        <span aria-hidden="true">&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{act.location}</span>
                        </span>
                      </div>
                      {act.notes && (
                        <p className="text-[11px] text-slate-600 italic line-clamp-1">{act.notes}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        +{act.hours} hrs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">No activity records found under &ldquo;{activityFilter}&rdquo;.</p>
                <button
                  onClick={onOpenLogHours}
                  className="mt-3 text-xs font-semibold text-maroon-800 hover:underline"
                >
                  + Log your first {activityFilter} hours
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Records signed off by Crew Council
              </span>
              <button
                onClick={onOpenLogHours}
                className="text-xs font-semibold text-maroon-900 hover:text-maroon-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Service Hours</span>
              </button>
            </div>
          </div>

          {/* Badges & Specializations Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  My Scouting Badges & Certifications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Milestones verified by the District Court of Honor.
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                {currentUser.badges?.length || 0} Badges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(currentUser.badges || []).map(badge => (
                <div
                  key={badge.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-maroon-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Award className="w-4 h-4 text-skyrover-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{badge.name}</h4>
                      {badge.status === 'completed' ? (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Earned</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-semibold shrink-0">
                          {badge.progressPercent}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{badge.description}</p>
                    {badge.dateEarned && (
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Verified: {badge.dateEarned}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Baden-Powell Award Candidate Roadmap */}
          <div className="bg-gradient-to-br from-navy-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-maroon-800 flex items-center justify-center text-white font-bold text-xs">
                  BP
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white uppercase">
                    Baden-Powell Award Syllabus Checklist
                  </h3>
                  <p className="text-xs text-slate-300">
                    Highest recognition in the Rover Scout Section
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-skyrover-500/20 text-skyrover-300 border border-skyrover-400/30">
                Service Capstone
              </span>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-white">Community Service Project (Minimum 100 Hours)</div>
                  <div className="text-slate-400 text-[11px]">
                    Current logged: {currentUser.totalServiceHours} hours {currentUser.totalServiceHours >= 100 ? '(Requirement Met!)' : `(${100 - currentUser.totalServiceHours} hours remaining)`}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-white">Youth Mentorship & Civic Leadership</div>
                  <div className="text-slate-400 text-[11px]">
                    Lead a community welfare initiative approved by the Crew Council.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-white">First Aid & Emergency Response Certification</div>
                  <div className="text-slate-400 text-[11px]">
                    Active credential verified with regional scout rescue cadre.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* My Crew Info & Fellow Rovers */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-maroon-800 uppercase tracking-wider">
                My Assigned Unit
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">
                {myCrew.name}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;{myCrew.motto}&rdquo;
            </p>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{myCrew.meetingSchedule}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{myCrew.memberCount} Active Rovers in Unit</span>
              </div>
            </div>

            {/* Crew Mates Roster */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-navy-900 uppercase tracking-wider mb-2.5">
                Fellow Crew Rovers
              </h4>

              <div className="space-y-2">
                {crewMates.map(mate => (
                  <div
                    key={mate.id}
                    onClick={() => onSelectMember(mate)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={mate.avatarUrl}
                        alt={mate.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">{mate.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{mate.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {mate.totalServiceHours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Network Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-maroon-800" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Network Bulletins & Notices
              </h3>
            </div>

            <div className="space-y-3">
              {ANNOUNCEMENTS.map(ann => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 line-clamp-1">{ann.title}</span>
                    {ann.isPinned && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-maroon-900 text-white font-bold shrink-0">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>{ann.author}</span>
                    <span>{ann.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
        </>
      )}

    </div>
  );
};
