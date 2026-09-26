import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, MapPin, Users, CheckCircle2, Clock, Search, ChevronRight } from 'lucide-react';
import { MeetingMinutes, UserRole } from '../types';

interface MinutesViewProps {
  currentRole: UserRole;
  currentUserName: string;
}

export const MinutesView: React.FC<MinutesViewProps> = ({ currentRole, currentUserName }) => {
  const [minutesList, setMinutesList] = useState<MeetingMinutes[]>([]);
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinutes | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);

  // New Draft Form
  const [title, setTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Arabiyya Scout HQ & Hybrid Net');
  const [chairPerson, setChairPerson] = useState('Crew Leader');
  const [attendeesText, setAttendeesText] = useState('Sarah Al-Mansoor, Liam Vance, Julian Reed');
  const [agendaText, setAgendaText] = useState('1. Expedition Safety\n2. Budget Allocation\n3. Logbook Audit');
  const [bodyHtml, setBodyHtml] = useState('Council convened at 18:00. Quorum established.');

  const canManage = currentRole === 'Secretary' || currentRole === 'Admin' || currentRole === 'Leader';

  const fetchMinutes = async () => {
    try {
      const res = await fetch(`/api/minutes?showDrafts=${canManage ? 'true' : 'false'}`);
      if (res.ok) {
        const data = await res.json();
        setMinutesList(data);
        if (data.length > 0 && !selectedMinute) {
          setSelectedMinute(data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load meeting minutes', e);
    }
  };

  useEffect(() => {
    fetchMinutes();
  }, [canManage]);

  const handleCreateMinutes = async (status: 'Draft' | 'Published') => {
    if (!title) return;

    const attendees = attendeesText.split(',').map(s => s.trim()).filter(Boolean);
    const agenda = agendaText.split('\n').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/minutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber: referenceNumber || `MIN-ROV-${new Date().getFullYear()}/${minutesList.length + 1}`,
          title,
          date,
          location,
          chairPerson,
          secretary: currentUserName,
          attendees,
          agenda,
          resolutions: [
            {
              id: 'res-new-1',
              topic: 'Quarterly Expedition Logistics',
              decision: 'Approved supply requisition and route risk assessment.',
              assignedTo: currentUserName,
              deadline: 'End of Month',
            }
          ],
          bodyHtml,
          status,
        }),
      });

      if (res.ok) {
        setShowDraftModal(false);
        fetchMinutes();
      }
    } catch (e) {
      console.error('Failed to record minutes', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Governance & Assembly Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Council Meeting Minutes & Resolutions
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Official records of Arabiyya Rover Council Assemblies, policy debates, and ratified action items.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowDraftModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 text-skyrover-300" />
            <span>+ Draft Council Minutes</span>
          </button>
        )}
      </div>

      {/* Main Grid: Sidebar of Assemblies + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Archived Assemblies
          </div>

          {minutesList.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedMinute(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedMinute?.id === item.id
                  ? 'bg-white border-maroon-800 shadow-md ring-1 ring-maroon-800'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-mono font-bold text-maroon-900">{item.referenceNumber}</span>
                <span className={`px-2 py-0.2 rounded font-semibold ${
                  item.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {item.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                <span>{item.date}</span>
                <span aria-hidden="true">&bull;</span>
                <span className="truncate">{item.chairPerson}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail Pane (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          {selectedMinute ? (
            <div className="space-y-6 text-xs text-slate-700">
              
              {/* Document Header */}
              <div className="border-b border-slate-200 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-maroon-800 bg-rose-50 px-2 py-1 rounded">
                    {selectedMinute.referenceNumber}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Status: <strong className="text-slate-800">{selectedMinute.status}</strong>
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedMinute.title}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-slate-600 text-[11px]">
                  <div>
                    <span className="text-slate-400 block uppercase text-[10px]">Date</span>
                    <span className="font-semibold text-slate-800">{selectedMinute.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase text-[10px]">Location</span>
                    <span className="font-semibold text-slate-800 truncate block">{selectedMinute.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase text-[10px]">Chairperson</span>
                    <span className="font-semibold text-slate-800 truncate block">{selectedMinute.chairPerson}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase text-[10px]">Recording Secretary</span>
                    <span className="font-semibold text-slate-800 truncate block">{selectedMinute.secretary}</span>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div>
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Council Quorum & Roll Call
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMinute.attendees.map((attendee: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium">
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              <div>
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Agenda Items Debated
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedMinute.agenda.map((item: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ol>
              </div>

              {/* Actionable Resolutions */}
              <div>
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2.5">
                  Actionable Resolutions & Decrees
                </h3>
                <div className="space-y-2">
                  {selectedMinute.resolutions.map((res: any) => (
                    <div key={res.id} className="p-3 rounded-xl bg-skyrover-50/50 border border-skyrover-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy-950">{res.topic}</span>
                        <span className="font-mono text-[10px] text-maroon-800 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                          Deadline: {res.deadline}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{res.decision}</p>
                      <div className="text-[10px] text-slate-500 pt-0.5">
                        Assigned Officer: <strong className="text-slate-800">{res.assignedTo}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body Text */}
              <div>
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Summary Deliberations
                </h3>
                <div
                  className="prose prose-sm max-w-none text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200"
                  dangerouslySetInnerHTML={{ __html: selectedMinute.bodyHtml }}
                />
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Select meeting minutes from the left panel to inspect.</div>
          )}
        </div>

      </div>

      {/* Draft New Minutes Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-maroon-900 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider">Draft Arabiyya Council Meeting Minutes</h3>
              <button onClick={() => setShowDraftModal(false)} className="text-slate-300 hover:text-white">&times;</button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Arabiyya Rover Council 4th Ordinary Assembly"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reference Number</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    placeholder="MIN-ROV-2026/04"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attendees (Comma-separated)</label>
                <input
                  type="text"
                  value={attendeesText}
                  onChange={e => setAttendeesText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agenda Items (One per line)</label>
                <textarea
                  rows={3}
                  value={agendaText}
                  onChange={e => setAgendaText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deliberation Notes (Rich Text)</label>
                <textarea
                  rows={3}
                  value={bodyHtml}
                  onChange={e => setBodyHtml(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleCreateMinutes('Draft')}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateMinutes('Published')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg shadow-2xs transition-colors"
                >
                  Publish Minutes to Network
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
