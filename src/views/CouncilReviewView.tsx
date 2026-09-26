import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  FileText, 
  ExternalLink, 
  Filter, 
  Search,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { MemberApplication, LeaderApplication, RoverMember, ApplicationStatus } from '../types';
import { 
  getStoredMemberApplications, 
  getStoredLeaderApplications, 
  approveMemberApplication, 
  rejectMemberApplication 
} from '../services/onboardingService';

interface CouncilReviewViewProps {
  onMemberActivated?: (member: RoverMember) => void;
}

export const CouncilReviewView: React.FC<CouncilReviewViewProps> = ({ onMemberActivated }) => {
  const [memberApps, setMemberApps] = useState<MemberApplication[]>([]);
  const [leaderApps, setLeaderApps] = useState<LeaderApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'leaders'>('members');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [selectedApp, setSelectedApp] = useState<MemberApplication | null>(null);

  // Approval modal state
  const [isApproving, setIsApproving] = useState(false);
  const [investitureDate, setInvestitureDate] = useState('2026-10-15');
  const [councilNotes, setCouncilNotes] = useState('Candidate verified via telephone interview. Prior troop records confirmed. Recommended for Arabiyya Rover Squire Investiture.');

  // Rejection modal state
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('Incomplete previous troop verification or failed to respond to interview schedule.');

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const loadData = () => {
    setMemberApps(getStoredMemberApplications());
    setLeaderApps(getStoredLeaderApplications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = () => {
    if (!selectedApp) return;
    const activated = approveMemberApplication(selectedApp.applicationId, investitureDate, councilNotes);
    if (activated) {
      loadData();
      setIsApproving(false);
      setSelectedApp(null);
      setFeedbackToast(`Application ${activated.applicationId} APPROVED! ${activated.name} is now an Active ${activated.role}. Investiture scheduled for ${investitureDate}.`);
      if (onMemberActivated) onMemberActivated(activated);
    }
  };

  const handleReject = () => {
    if (!selectedApp) return;
    const ok = rejectMemberApplication(selectedApp.applicationId, rejectReason);
    if (ok) {
      loadData();
      setIsRejecting(false);
      setSelectedApp(null);
      setFeedbackToast(`Application ${selectedApp.applicationId} has been archived as Rejected.`);
    }
  };

  const filteredMemberApps = memberApps.filter(a => {
    if (statusFilter === 'All') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-navy-950 via-maroon-950 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Shield className="w-6 h-6 text-skyrover-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-skyrover-300 uppercase tracking-widest block">
              Arabiyya Executive Scout Council
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Candidate Verification &amp; Admissions Panel
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Review applicant dossiers, log phone interviews, and authorize official scout investiture dates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white border border-white/15">
            Pending Reviews: {memberApps.filter(a => a.status === 'Pending Verification').length + leaderApps.filter(a => a.status === 'Pending Verification').length}
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="text-emerald-800 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Section Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'members'
                ? 'bg-maroon-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Explorer &amp; Rover Applications ({memberApps.length})
          </button>

          <button
            onClick={() => setActiveTab('leaders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leaders'
                ? 'bg-maroon-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Leader Candidate Track ({leaderApps.length})
          </button>
        </div>

        {activeTab === 'members' && (
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Filter:</span>
            {(['All', 'Pending Verification', 'Approved', 'Rejected'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'members' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Applications List */}
          <div className="lg:col-span-1 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Applicant Queue ({filteredMemberApps.length})
            </span>

            {filteredMemberApps.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No applications matching filter.
              </div>
            ) : (
              filteredMemberApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedApp?.id === app.id
                      ? 'bg-rose-50/60 border-maroon-800 shadow-sm ring-1 ring-maroon-800/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs truncate">{app.personal.fullName}</h4>
                      <span className="font-mono text-[10px] text-slate-400">{app.applicationId}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                      app.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>Section: <strong className="text-slate-700">{app.section}</strong></div>
                    <div>Target: <span className="text-maroon-800 font-semibold">{app.targetAward || app.awardGoal?.goalTitle || 'Baden-Powell Award'}</span></div>
                    <div>Group: {typeof app.scoutingBackground === 'string' ? app.scoutingBackground : app.scoutingBackground?.formattedDesignation || app.background?.officialDesignation || 'New Scout'}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dossier Inspection Panel */}
          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs text-slate-700">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Applicant Dossier &bull; {selectedApp.applicationId}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {selectedApp.personal?.fullName || 'Applicant'} {selectedApp.personal?.commonName ? `(${selectedApp.personal.commonName})` : ''}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      ID: <span className="font-mono font-semibold text-slate-700">{selectedApp.personal?.idCardNumber || selectedApp.personal?.nationalId || 'N/A'}</span> &bull; {selectedApp.personal?.gender || 'Male'} &bull; Age: {selectedApp.age?.years ?? selectedApp.exactAge?.years ?? 20}y {selectedApp.age?.months ?? selectedApp.exactAge?.months ?? 0}m {selectedApp.age?.days ?? selectedApp.exactAge?.days ?? 0}d
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(selectedApp.status === 'Pending Verification' || selectedApp.status === 'Pending Review') && (
                      <>
                        <button
                          onClick={() => setIsRejecting(true)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => setIsApproving(true)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl transition-colors shadow-xs"
                        >
                          Approve &amp; Set Investiture
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Section & Award Intent */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Assigned Scouting Section
                    </span>
                    <span className="font-bold text-sm text-navy-950 block">{selectedApp.section}</span>
                    <span className="text-[11px] text-slate-500">Pinnacle Award: {selectedApp.targetAward || selectedApp.awardGoal?.goalTitle || 'Baden-Powell Award'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Prior Scout Badge Level
                    </span>
                    <span className="font-bold text-sm text-maroon-900 block">{selectedApp.currentBadgeLevel || selectedApp.standing?.currentBadgeLevel || 'Scout Standard'}</span>
                    <span className="text-[11px] text-slate-500">
                      {selectedApp.countdown?.years ?? selectedApp.standing?.remainingYears ?? 3}y {selectedApp.countdown?.months ?? selectedApp.standing?.remainingMonths ?? 0}m {selectedApp.countdown?.days ?? selectedApp.standing?.remainingDays ?? 0}d to milestone cutoff
                    </span>
                  </div>
                </div>

                {/* Background & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">Previous Scout Group</span>
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {typeof selectedApp.scoutingBackground === 'string' 
                        ? selectedApp.scoutingBackground 
                        : selectedApp.scoutingBackground?.formattedDesignation || selectedApp.background?.officialDesignation || 'New to Scouting'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">Permanent Address</span>
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {selectedApp.permanentAddress?.streetAddress || selectedApp.permanentAddress?.streetLine || ''}, {selectedApp.permanentAddress?.ward || selectedApp.permanentAddress?.districtWard || ''}, {selectedApp.permanentAddress?.island || selectedApp.permanentAddress?.islandCity || ''}, {selectedApp.permanentAddress?.country || 'Maldives'}
                    </p>
                  </div>
                </div>

                {/* Contacts & Telegram */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 text-xs block">Contact &amp; Telegram Bot Credentials</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Phone</span>
                      <span className="font-mono font-semibold text-slate-800 text-[11px]">
                        {selectedApp.contacts?.dialCode || '+960'} {selectedApp.contacts?.phone || selectedApp.contacts?.mobilePhone || ''}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Telegram</span>
                      <span className="font-mono font-semibold text-navy-800 text-[11px]">
                        {selectedApp.contacts?.telegramTag || '@rover'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Instagram</span>
                      <span className="font-mono font-semibold text-slate-800 text-[11px]">
                        {selectedApp.contacts?.instagramHandle || '@rover'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Emergency ICE</span>
                      <span className="font-semibold text-slate-800 text-[11px] block truncate">
                        {selectedApp.emergencyContact?.fullName || selectedApp.emergencyContact?.name || 'Guardian'} ({selectedApp.emergencyContact?.relationship || selectedApp.emergencyContact?.relation || 'Parent'})
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{selectedApp.emergencyContact?.phone || ''}</span>
                    </div>
                  </div>
                </div>

                {/* Council Notes & Investiture Info if already decided */}
                {selectedApp.status === 'Approved' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-1">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Investiture Scheduled: {selectedApp.investitureDate}</span>
                    </span>
                    <p className="text-[11px] text-emerald-800">{selectedApp.councilNotes}</p>
                    <span className="text-[10px] text-emerald-600 block">
                      Approved by: {selectedApp.reviewedBy} on {new Date(selectedApp.reviewedAt || '').toLocaleDateString()}
                    </span>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-full min-h-[350px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
                <FileText className="w-10 h-10 text-slate-300 mb-2" />
                <span>Select an applicant from the queue to review their complete onboarding file.</span>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Leader Candidate Applications */
        <div className="space-y-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Adult Leader Applications ({leaderApps.length})
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaderApps.map(ldr => (
              <div key={ldr.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{ldr.legalName}</h4>
                    <span className="font-mono text-[10px] text-slate-400">{ldr.applicationId}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    {ldr.status}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div>ID Card: <strong className="font-mono text-slate-800">{ldr.idCardNumber}</strong></div>
                  <div>Email: <strong className="text-slate-800">{ldr.officialEmail}</strong></div>
                  <div>Phone: <strong className="font-mono text-slate-800">{ldr.mobileNumber}</strong></div>
                  <div>Wood Badge: <strong className="text-maroon-800">{ldr.woodBadgeStatus || 'Not Started'}</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">Scouting History &amp; Motivation:</span>
                  <p>{ldr.scoutingExperience}</p>
                  {ldr.motivation && <p className="italic mt-1 text-slate-500">&ldquo;{ldr.motivation}&rdquo;</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPROVAL DIALOG MODAL */}
      {isApproving && selectedApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Approve Membership: {selectedApp.personal.fullName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official Investiture Date *
                </label>
                <input
                  type="date"
                  value={investitureDate}
                  onChange={e => setInvestitureDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Council Interview &amp; Verification Notes
                </label>
                <textarea
                  rows={3}
                  value={councilNotes}
                  onChange={e => setCouncilNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsApproving(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs"
              >
                Confirm Approval &amp; Activate Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION DIALOG MODAL */}
      {isRejecting && selectedApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-rose-900">
              Reject Application: {selectedApp.personal.fullName}
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Reason for Council Rejection
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejecting(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
