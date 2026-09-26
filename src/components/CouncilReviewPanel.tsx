import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Award, 
  AlertCircle,
  Mail,
  Send,
  Loader2,
  FileText
} from 'lucide-react';
import { ApplicationStatus, SectionType } from '../types';

interface CouncilReviewPanelProps {
  onRefreshMembers?: () => void;
}

export const CouncilReviewPanel: React.FC<CouncilReviewPanelProps> = ({ onRefreshMembers }) => {
  const [memberApplications, setMemberApplications] = useState<any[]>([]);
  const [leaderApplications, setLeaderApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'leaders'>('members');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Decision inputs
  const [decisionNotes, setDecisionNotes] = useState('');
  const [investitureDateInput, setInvestitureDateInput] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchCouncilData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/council/applications');
      if (res.ok) {
        const data = await res.json();
        setMemberApplications(data.memberApplications || []);
        setLeaderApplications(data.leaderApplications || []);
      }
    } catch (e) {
      console.warn('Could not fetch council data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCouncilData();
  }, []);

  const handleTakeDecision = async (action: 'approve' | 'reject' | 'schedule_call' | 'activate') => {
    if (!selectedApp) return;
    setActionLoading(true);
    setActionFeedback(null);

    try {
      const res = await fetch('/api/council/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.applicationId,
          action,
          notes: decisionNotes.trim() || 'Verified by Arabiyya Rover Council quorum.',
          investitureDate: investitureDateInput || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionFeedback(
          action === 'approve'
            ? `Application approved! Investiture set for ${data.application.investitureDate}.`
            : action === 'activate'
            ? `Investiture confirmed. Candidate is now Active in Arabiyya Rover Network!`
            : action === 'schedule_call'
            ? 'Phone interview verification call scheduled.'
            : 'Application marked as rejected.'
        );
        fetchCouncilData();
        setSelectedApp(data.application);
        if (onRefreshMembers) onRefreshMembers();
      }
    } catch (e) {
      setActionFeedback('Failed to record Council decision.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMembers = memberApplications.filter(app => {
    const matchesSearch = 
      app.personal?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personal?.nationalId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-maroon-800 text-skyrover-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold tracking-tight text-white uppercase">
              Arabiyya Rover Council Review &amp; Decision Panel
            </h3>
          </div>
          <p className="text-slate-300 text-[11px]">
            Review incoming Youth &amp; Leader applications, record phone verification calls, and authorize investitures.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('members');
              setSelectedApp(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'members' ? 'bg-maroon-900 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Youth Members ({memberApplications.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('leaders');
              setSelectedApp(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'leaders' ? 'bg-maroon-900 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Leader Track ({leaderApplications.length})
          </button>
        </div>
      </div>

      {/* Main Grid: List + Detail Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[480px]">
        
        {/* Left Column: Applications List (5 cols) */}
        <div className="lg:col-span-5 p-4 space-y-3">
          
          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID card, or App ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            {activeTab === 'members' && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {(['All', 'Pending Verification', 'Interview Scheduled', 'Approved', 'Active', 'Rejected'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap font-medium transition-colors ${
                      statusFilter === s ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List items */}
          <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
            {activeTab === 'members' ? (
              filteredMembers.length > 0 ? (
                filteredMembers.map(app => (
                  <div
                    key={app.applicationId}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedApp?.applicationId === app.applicationId
                        ? 'border-maroon-800 bg-rose-50/50 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-slate-500">
                        {app.applicationId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Active' ? 'bg-navy-950 text-white' :
                        app.status === 'Interview Scheduled' ? 'bg-skyrover-100 text-navy-900' :
                        app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-900'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-xs truncate">
                      {app.personal?.fullName} ({app.personal?.commonName})
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                      <span>{app.section} Scout &bull; {app.awardGoal?.goalTitle}</span>
                      <span className="font-mono text-slate-700">{app.personal?.nationalId}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  No member applications found matching filter.
                </div>
              )
            ) : (
              leaderApplications.length > 0 ? (
                leaderApplications.map(ldr => (
                  <div
                    key={ldr.applicationId}
                    onClick={() => setSelectedApp(ldr)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedApp?.applicationId === ldr.applicationId
                        ? 'border-maroon-800 bg-rose-50/50 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-slate-500">
                        {ldr.applicationId}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-navy-100 text-navy-900">
                        {ldr.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-xs truncate">
                      {ldr.fullName}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {ldr.areaOfExpertise} &bull; {ldr.phone}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  No Leader Track applications on file.
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Column: Dossier Inspection & Council Actions (7 cols) */}
        <div className="lg:col-span-7 p-6 overflow-y-auto max-h-[560px]">
          {selectedApp ? (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Header card */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-maroon-900 block">
                    DOSSIER: {selectedApp.applicationId}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {selectedApp.personal?.fullName || selectedApp.fullName}
                  </h4>
                  <span className="text-slate-500 text-[11px]">
                    National ID: <strong>{selectedApp.personal?.nationalId || selectedApp.nationalId}</strong> &bull; {selectedApp.personal?.gender || 'Adult Candidate'}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedApp.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    selectedApp.status === 'Active' ? 'bg-navy-950 text-white' :
                    selectedApp.status === 'Interview Scheduled' ? 'bg-skyrover-100 text-navy-900' :
                    'bg-amber-100 text-amber-900'
                  }`}>
                    {selectedApp.status}
                  </span>
                  {selectedApp.investitureDate && (
                    <span className="block text-[10px] text-emerald-700 font-mono mt-1">
                      Investiture: {selectedApp.investitureDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Feedback Banner */}
              {actionFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionFeedback}</span>
                </div>
              )}

              {/* Section & Award Standing */}
              {selectedApp.section && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Section</span>
                    <span className="font-bold text-slate-900">{selectedApp.section} Scout</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Award Goal</span>
                    <span className="font-bold text-slate-900">{selectedApp.awardGoal?.goalTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Badge Level</span>
                    <span className="font-bold text-slate-900">{selectedApp.standing?.currentBadgeLevel}</span>
                  </div>
                </div>
              )}

              {/* Contacts & ICE */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                  Contact Channels &amp; Emergency Next of Kin
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Phone:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedApp.contacts?.phone || selectedApp.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Telegram Tag:</span>
                    <span className="font-mono font-bold text-skyrover-600">
                      {selectedApp.contacts?.telegramTag || '@unspecified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email:</span>
                    <span className="font-mono text-slate-800 truncate">
                      {selectedApp.contacts?.email || selectedApp.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Emergency Contact (ICE):</span>
                    <span className="text-slate-800">
                      {selectedApp.emergencyContact?.fullName || 'Guardian'} ({selectedApp.emergencyContact?.relationship || 'Parent'}) &bull; {selectedApp.emergencyContact?.phone || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Council Actions & Decisions */}
              <div className="p-4 bg-rose-50/50 border border-maroon-200 rounded-2xl space-y-3">
                <span className="font-bold text-maroon-950 uppercase tracking-wide text-[11px] block">
                  Arabiyya Rover Council Decision Workflow
                </span>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-700">Council Notes / Verification Record</label>
                  <textarea
                    rows={2}
                    value={decisionNotes}
                    onChange={e => setDecisionNotes(e.target.value)}
                    placeholder="Enter phone interview summary, background check notes, patrol placement..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Set Investiture Date</label>
                    <input
                      type="date"
                      value={investitureDateInput}
                      onChange={e => setInvestitureDateInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleTakeDecision('schedule_call')}
                    className="px-3 py-1.5 bg-skyrover-50 hover:bg-skyrover-100 text-navy-900 border border-skyrover-200 rounded-xl font-semibold text-[11px] transition-colors flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-skyrover-600" />
                    <span>Log Verification Call</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleTakeDecision('approve')}
                    className="px-4 py-1.5 bg-maroon-900 hover:bg-maroon-800 text-white rounded-xl font-semibold text-[11px] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-skyrover-300" />
                    <span>Approve &amp; Set Investiture</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleTakeDecision('activate')}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold text-[11px] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Activate Portal Login</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleTakeDecision('reject')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-semibold text-[11px] transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Select an application from the left list to review dossier and take council decision.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
