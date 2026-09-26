import React, { useState, useEffect } from 'react';
import { Calendar, FileQuestion, CheckCircle2, XCircle, Clock, Plus, AlertCircle } from 'lucide-react';
import { AttendanceExcuse, UserRole } from '../types';

interface ExcusesViewProps {
  currentRole: UserRole;
  currentMemberId: string;
  currentMemberName: string;
}

export const ExcusesView: React.FC<ExcusesViewProps> = ({
  currentRole,
  currentMemberId,
  currentMemberName,
}) => {
  const [excuses, setExcuses] = useState<AttendanceExcuse[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('National Spring Rover Moot 2026');
  const [reason, setReason] = useState('');

  const canAudit = currentRole === 'Leader' || currentRole === 'Secretary' || currentRole === 'Admin';

  const fetchExcuses = async () => {
    try {
      const res = await fetch('/api/attendance/excuses');
      if (res.ok) {
        const data = await res.json();
        setExcuses(data);
      }
    } catch (e) {
      console.error('Failed to load excuses', e);
    }
  };

  useEffect(() => {
    fetchExcuses();
  }, []);

  const handleFileExcuse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    try {
      const res = await fetch('/api/attendance/excuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: currentMemberId,
          memberName: currentMemberName,
          eventId: 'EVT-01',
          eventTitle,
          reason,
        }),
      });

      if (res.ok) {
        setShowFileModal(false);
        setReason('');
        fetchExcuses();
      }
    } catch (e) {
      console.error('Failed to file excuse', e);
    }
  };

  const handleReviewExcuse = async (id: string, status: 'Approved' | 'Declined') => {
    try {
      const res = await fetch(`/api/attendance/excuse/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewedBy: currentMemberName,
          reviewNotes: status === 'Approved' ? 'Validated official excuse.' : 'Insufficient justification.',
        }),
      });

      if (res.ok) {
        fetchExcuses();
      }
    } catch (e) {
      console.error('Review failed', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Operational Attendance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Attendance Records & Absence Excuses
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Formal submission and council auditing of official absence notices for mandatory moots, assemblies, and bivouacs.
          </p>
        </div>

        <button
          onClick={() => setShowFileModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-skyrover-300" />
          <span>+ File Official Absence Notice</span>
        </button>
      </div>

      {/* Excuses List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-900">Submitted Absence Requests ({excuses.length})</h3>

        <div className="space-y-3">
          {excuses.map(exc => (
            <div
              key={exc.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{exc.memberName}</span>
                  <span className="text-slate-400 font-mono">({exc.memberId})</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                    exc.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    exc.status === 'Declined' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {exc.status}
                  </span>
                </div>

                <div className="text-slate-600">
                  Event: <strong className="text-navy-950">{exc.eventTitle}</strong> &bull; Filed: {new Date(exc.filedAt).toLocaleDateString()}
                </div>

                <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200/80">
                  &ldquo;{exc.reason}&rdquo;
                </p>

                {exc.reviewedBy && (
                  <div className="text-[11px] text-slate-500">
                    Audited by: <strong>{exc.reviewedBy}</strong> ({exc.reviewNotes})
                  </div>
                )}
              </div>

              {canAudit && exc.status === 'Pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReviewExcuse(exc.id, 'Declined')}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleReviewExcuse(exc.id, 'Approved')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg"
                  >
                    Approve Excuse
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Excuse Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-maroon-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider">File Absence Notice</h3>
              <button onClick={() => setShowFileModal(false)} className="text-slate-300 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleFileExcuse} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheduled Event</label>
                <select
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-700"
                >
                  <option value="National Spring Rover Moot 2026">National Spring Rover Moot 2026</option>
                  <option value="48-Hour Backcountry Traverse Expedition">48-Hour Backcountry Traverse Expedition</option>
                  <option value="Quarterly Council General Assembly">Quarterly Council General Assembly</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Absence (Official Excuse) *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Detail academic examination, family emergency, or certified illness..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg shadow-2xs transition-colors"
                >
                  Submit Official Excuse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
