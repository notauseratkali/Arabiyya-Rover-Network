import React, { useState, useEffect } from 'react';
import { Send, Bell, Mail, Smartphone, CheckCircle2, ShieldCheck, Eye, Plus, MessageSquare } from 'lucide-react';
import { BroadcastMessage, UserRole } from '../types';

interface BroadcastsViewProps {
  currentRole: UserRole;
  currentUserName: string;
}

export const BroadcastsView: React.FC<BroadcastsViewProps> = ({ currentRole, currentUserName }) => {
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<BroadcastMessage['priority']>('High');
  const [targetAudience, setTargetAudience] = useState<BroadcastMessage['targetAudience']>('All');
  const [content, setContent] = useState('');
  const [channelPortal, setChannelPortal] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelTelegram, setChannelTelegram] = useState(true);

  // Previews
  const [previewTab, setPreviewTab] = useState<'portal' | 'email' | 'telegram'>('email');
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const canBroadcast = currentRole === 'Secretary' || currentRole === 'Admin' || currentRole === 'Leader';

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch('/api/broadcasts');
      if (res.ok) {
        const data = await res.json();
        setBroadcasts(data);
      }
    } catch (e) {
      console.error('Failed to load broadcasts', e);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch('/api/broadcasts/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          priority,
          targetAudience,
          channels: {
            inPortalBanner: channelPortal,
            emailHtml: channelEmail,
            telegramChannel: channelTelegram,
          },
          content,
          dispatchedBy: currentUserName,
        }),
      });

      if (res.ok) {
        setShowComposeModal(false);
        setTitle('');
        setContent('');
        setDispatchSuccess('Omnichannel broadcast successfully dispatched across selected channels!');
        fetchBroadcasts();
        setTimeout(() => setDispatchSuccess(null), 4000);
      }
    } catch (e) {
      console.error('Dispatch failed', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Arabiyya Scout Network &bull; Dispatch Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Omnichannel Broadcast Center
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Synchronously broadcast urgent orders, safety bulletins, and moot notifications across In-Portal Banners, Dedicated SMTP HTML Emails, and Telegram Channels.
          </p>
        </div>

        {canBroadcast && (
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Send className="w-4 h-4 text-skyrover-300" />
            <span>+ Dispatch Omnichannel Alert</span>
          </button>
        )}
      </div>

      {dispatchSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* Synchronous Channel Status Ribbons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Channel 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-50 text-maroon-800">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">In-Portal Banners</h4>
                <span className="text-[10px] text-slate-400">WebSocket / Client DOM</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Active Sync
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            High-visibility priority banners shown to all authenticated Rovers and Explorers upon login.
          </p>
        </div>

        {/* Channel 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-skyrover-50 text-skyrover-600">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Automated HTML Email</h4>
                <span className="text-[10px] text-slate-400">Dedicated SMTP Engine</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Active Sync
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Responsive HTML templates with Arabiyya branding, typography, and one-click action links.
          </p>
        </div>

        {/* Channel 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-slate-100 text-navy-900">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Telegram Bot API</h4>
                <span className="text-[10px] text-slate-400">@ArabiyyaRoverBot</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Active Sync
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Instant push delivery to the official Arabiyya Rover Network announcement telegram channel.
          </p>
        </div>

      </div>

      {/* Broadcast History & Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-900">Recent Dispatched Transmissions</h3>

        <div className="space-y-4">
          {broadcasts.map(msg => (
            <div
              key={msg.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    msg.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                    msg.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {msg.priority} Priority
                  </span>

                  <h4 className="text-sm font-bold text-slate-900">{msg.title}</h4>
                </div>

                <div className="text-[11px] text-slate-400">
                  Target: <strong className="text-slate-700">{msg.targetAudience}</strong> &bull; {new Date(msg.timestamp).toLocaleDateString()}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {msg.content}
              </p>

              {/* Delivery Metrics */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-200/60">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-rose-700" />
                    <span>In-Portal: <strong className="font-mono text-slate-800">{msg.metrics.inPortalViews}</strong> views</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-skyrover-600" />
                    <span>Emails: <strong className="font-mono text-slate-800">{msg.metrics.emailsSent}</strong> delivered</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-navy-900" />
                    <span>Telegram: <strong className="font-mono text-slate-800">{msg.metrics.telegramDeliveries}</strong> reached</span>
                  </span>
                </div>

                <span className="text-[10px] text-slate-400">Dispatched by: {msg.dispatchedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose & Live Preview Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-5 py-4 bg-maroon-900 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-skyrover-300" />
                <span>Omnichannel Broadcast Dispatcher</span>
              </h3>
              <button onClick={() => setShowComposeModal(false)} className="text-slate-300 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleDispatch} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Broadcast Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. National Spring Rover Moot 2026: Mandatory Delegate Briefing"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Classification</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as BroadcastMessage['priority'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  >
                    <option value="Normal">Normal Operational</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent / Safety Warning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Section</label>
                  <select
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value as BroadcastMessage['targetAudience'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  >
                    <option value="All">All Network Members</option>
                    <option value="Rovers">Rovers Only (18–26)</option>
                    <option value="Explorers">Explorers Only (&lt;18)</option>
                    <option value="Leaders">Leaders & Officers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Active Dispatch Channels</label>
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channelPortal}
                      onChange={e => setChannelPortal(e.target.checked)}
                      className="rounded text-maroon-800 focus:ring-maroon-800"
                    />
                    <span>In-Portal Announcement Banner</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channelEmail}
                      onChange={e => setChannelEmail(e.target.checked)}
                      className="rounded text-maroon-800 focus:ring-maroon-800"
                    />
                    <span>Automated HTML Email</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channelTelegram}
                      onChange={e => setChannelTelegram(e.target.checked)}
                      className="rounded text-maroon-800 focus:ring-maroon-800"
                    />
                    <span>Telegram Channel Push</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Content & Directives *</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Detail the mandatory briefing details, safety measures, location coordinates, or deadlines..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>

              {/* Live Channel Previews */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-skyrover-600" />
                    <span>Synchronous Live Channel Preview</span>
                  </span>

                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('email')}
                      className={`px-2 py-0.5 rounded ${previewTab === 'email' ? 'bg-white font-bold text-slate-900' : 'text-slate-600'}`}
                    >
                      Email HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('telegram')}
                      className={`px-2 py-0.5 rounded ${previewTab === 'telegram' ? 'bg-white font-bold text-slate-900' : 'text-slate-600'}`}
                    >
                      Telegram
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('portal')}
                      className={`px-2 py-0.5 rounded ${previewTab === 'portal' ? 'bg-white font-bold text-slate-900' : 'text-slate-600'}`}
                    >
                      Portal Banner
                    </button>
                  </div>
                </div>

                {previewTab === 'email' && (
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 font-sans text-slate-800">
                    <div className="bg-maroon-900 text-white p-3 rounded-t-lg flex items-center justify-between">
                      <span className="font-bold text-xs">Arabiyya Rover Scout Dispatch</span>
                      <span className="text-[10px] text-skyrover-300 font-mono">OFFICIAL NOTICE</span>
                    </div>
                    <div className="bg-white p-4 border border-t-0 border-slate-200 rounded-b-lg space-y-2">
                      <h4 className="font-bold text-sm text-slate-900">{title || 'Subject Headline'}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{content || 'Message body text will appear formatted here...'}</p>
                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 bg-maroon-900 text-white text-[10px] font-bold rounded">
                          Access Arabiyya Portal
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === 'telegram' && (
                  <div className="p-3 bg-[#17212b] text-white rounded-xl font-mono text-[11px] space-y-1">
                    <div className="text-skyrover-400 font-bold">📢 Arabiyya Rover Network Channel</div>
                    <div className="font-bold text-amber-300">🚨 {title || 'Headline'}</div>
                    <div className="text-slate-200">{content || 'Content payload in Telegram markdown format...'}</div>
                    <div className="text-slate-400 text-[10px] pt-1">#ArabiyyaScouts #Service</div>
                  </div>
                )}

                {previewTab === 'portal' && (
                  <div className="p-3 rounded-xl bg-navy-950 text-white flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-skyrover-400" />
                      <div>
                        <strong>{title || 'Portal Banner Headline'}:</strong> {content || 'Brief overview ticker text.'}
                      </div>
                    </div>
                    <span className="text-[10px] bg-maroon-800 text-white px-2 py-0.5 rounded font-bold shrink-0">
                      DISMISSIBLE
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Synchronous Dispatch</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
