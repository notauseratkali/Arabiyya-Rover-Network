import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Award, 
  Filter, 
  Search, 
  Check, 
  RotateCcw,
  Sparkles,
  FileText
} from 'lucide-react';
import { ActivityLog, UserRole } from '../types';

interface LogbookViewProps {
  currentRole: UserRole;
  currentMemberId: string;
  currentMemberName: string;
}

export const LogbookView: React.FC<LogbookViewProps> = ({
  currentRole,
  currentMemberId,
  currentMemberName,
}) => {
  const [entries, setEntries] = useState<ActivityLog[]>([]);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'myLogs' | 'reviewQueue'>('myLogs');

  // Form State for New Entry
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityLog['type']>('Service');
  const [hours, setHours] = useState(4);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [reflections, setReflections] = useState('');
  const [skillsText, setSkillsText] = useState('Pioneering, Community Outreach');

  // Review State
  const [selectedEntryForReview, setSelectedEntryForReview] = useState<ActivityLog | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logbook');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (e) {
      console.error('Failed to load logbook entries', e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreateEntry = async (submitForReview: boolean) => {
    if (!title || !location) return;

    const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: currentMemberId,
          memberName: currentMemberName,
          memberSection: currentRole === 'Explorer' ? 'Explorer' : 'Rover',
          title,
          type,
          hours: Number(hours),
          date,
          location,
          reflections,
          skillsPracticed: skills,
          submitForReview,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTitle('');
        setReflections('');
        fetchLogs();
      }
    } catch (e) {
      console.error('Failed to create logbook entry', e);
    }
  };

  const handleVerifyEntry = async (id: string, status: 'Verified' | 'Revision Requested') => {
    try {
      const res = await fetch(`/api/logbook/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewerName: currentMemberName,
          reviewerRole: currentRole,
          reviewerNotes: reviewerNotes || 'Verified as complying with Scout Law and syllabus requirements.',
        }),
      });

      if (res.ok) {
        setSelectedEntryForReview(null);
        setReviewerNotes('');
        fetchLogs();
      }
    } catch (e) {
      console.error('Failed to verify logbook entry', e);
    }
  };

  const isReviewer = currentRole === 'Leader' || currentRole === 'Secretary' || currentRole === 'Admin';

  const pendingReviewCount = entries.filter(e => e.status === 'Pending Review').length;

  const filteredEntries = entries.filter(e => {
    if (activeTab === 'reviewQueue') {
      return e.status === 'Pending Review';
    }
    // Filter for current member in 'myLogs' unless reviewer
    if (filterType !== 'All' && e.type !== filterType) return false;
    if (filterStatus !== 'All' && e.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Operational Logbook
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Digital Logbook & Multi-Stage Verification
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Official field logbook tracking Camps, Hikes, Service, and Milestones through Draft, Pending Review, and Verified stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isReviewer && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mr-2">
              <button
                onClick={() => setActiveTab('myLogs')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'myLogs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Entries
              </button>
              <button
                onClick={() => setActiveTab('reviewQueue')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviewQueue' ? 'bg-maroon-900 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <span>Audit Queue</span>
                {pendingReviewCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-white text-maroon-900 rounded font-bold">
                    {pendingReviewCount}
                  </span>
                )}
              </button>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 text-skyrover-300" />
            <span>+ New Activity Log</span>
          </button>
        </div>
      </div>

      {/* Workflow Stage Explainer Ribbon */}
      <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 text-slate-600">
          <span className="font-bold text-navy-900 uppercase tracking-wide">Review SLA Stages:</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <strong>1. Draft</strong> (Member Editing)
          </span>
          <span aria-hidden="true">&rarr;</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <strong>2. Pending Review</strong> (Submitted to Crew Leader)
          </span>
          <span aria-hidden="true">&rarr;</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <strong>3. Verified</strong> (Sign-off & Credential Logged)
          </span>
        </div>

        <div className="text-[11px] text-slate-500">
          Approved logs automatically count toward Baden-Powell & President Scout Awards.
        </div>
      </div>

      {/* Filter Bar */}
      {activeTab === 'myLogs' && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-600">Category:</span>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-300 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Camp">Camp</option>
                <option value="Hike">Hike</option>
                <option value="Service">Service</option>
                <option value="Milestone">Milestone</option>
                <option value="Training">Training</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-600">Review Status:</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-300 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Verified">Verified</option>
                <option value="Revision Requested">Revision Requested</option>
              </select>
            </div>
          </div>

          <span className="text-slate-500">
            Showing <strong className="text-slate-800">{filteredEntries.length}</strong> logbook records
          </span>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.map(entry => (
          <div
            key={entry.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  entry.type === 'Service' ? 'bg-rose-50 text-maroon-800' :
                  entry.type === 'Hike' ? 'bg-skyrover-50 text-skyrover-700' :
                  entry.type === 'Camp' ? 'bg-emerald-50 text-emerald-800' :
                  entry.type === 'Milestone' ? 'bg-purple-50 text-purple-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {entry.type}
                </span>

                <h3 className="text-sm font-bold text-slate-900 truncate">{entry.title}</h3>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  entry.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  entry.status === 'Pending Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  entry.status === 'Revision Requested' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {entry.status === 'Verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {entry.status === 'Pending Review' && <Clock className="w-3 h-3 text-amber-600" />}
                  <span>{entry.status}</span>
                </span>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>By: <strong className="text-slate-700">{entry.memberName}</strong></span>
                <span aria-hidden="true">&bull;</span>
                <span>Date: {entry.date}</span>
                <span aria-hidden="true">&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{entry.location}</span>
                </span>
                <span aria-hidden="true">&bull;</span>
                <span className="font-mono text-navy-900 font-bold">+{entry.hours} Hours</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {entry.reflections}
              </p>

              {entry.reviewerNotes && (
                <div className="text-[11px] bg-emerald-50/60 border border-emerald-200 p-2 rounded-lg text-emerald-900 space-y-0.5">
                  <div className="font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Reviewer Sign-off: {entry.reviewerName} ({entry.reviewerRole})</span>
                  </div>
                  <div className="italic text-emerald-800 text-[10px]">&ldquo;{entry.reviewerNotes}&rdquo;</div>
                </div>
              )}
            </div>

            {/* Actions for Reviewers */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
              {isReviewer && entry.status === 'Pending Review' && (
                <button
                  onClick={() => setSelectedEntryForReview(entry)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg shadow-2xs transition-colors"
                >
                  Verify Log Entry &rarr;
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reviewer Verification Modal */}
      {selectedEntryForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-maroon-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider">Official Logbook Verification Review</h3>
              <button onClick={() => setSelectedEntryForReview(null)} className="text-slate-300 hover:text-white">&times;</button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{selectedEntryForReview.title}</div>
                <div className="text-slate-500">
                  Logged by: <strong>{selectedEntryForReview.memberName}</strong> &bull; {selectedEntryForReview.hours} hrs &bull; {selectedEntryForReview.location}
                </div>
                <p className="text-slate-700 italic pt-1">&ldquo;{selectedEntryForReview.reflections}&rdquo;</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Reviewer Endorsement / Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewerNotes}
                  onChange={e => setReviewerNotes(e.target.value)}
                  placeholder="Enter verification notes according to Baden-Powell Award criteria or reason for revision..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleVerifyEntry(selectedEntryForReview.id, 'Revision Requested')}
                  className="px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                >
                  Request Revisions
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyEntry(selectedEntryForReview.id, 'Verified')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-2xs"
                >
                  Sign Off & Verify Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Logbook Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-maroon-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider">Record New Activity in Logbook</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white">&times;</button>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleCreateEntry(true); }} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Tuwaiq Escarpment 25km Orienteering Trek"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ActivityLog['type'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  >
                    <option value="Camp">Camp</option>
                    <option value="Hike">Hike</option>
                    <option value="Service">Community Service</option>
                    <option value="Milestone">Milestone / Vigil</option>
                    <option value="Training">Training Drill</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hours Logged *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={hours}
                    onChange={e => setHours(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location Site</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Wadi Hanifa Sector 2"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Reflection Statement (Mandatory for BP Award)</label>
                <textarea
                  rows={3}
                  required
                  value={reflections}
                  onChange={e => setReflections(e.target.value)}
                  placeholder="Detail the obstacles overcome, lessons learned in team leadership, and scout spirit demonstrated..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleCreateEntry(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg shadow-2xs transition-colors"
                >
                  Submit for Crew Leader Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
