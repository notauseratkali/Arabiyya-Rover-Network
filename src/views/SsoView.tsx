import React, { useState } from 'react';
import { KeyRound, Shield, ExternalLink, RefreshCw, CheckCircle2, Lock, ArrowRight, Layers, Database } from 'lucide-react';
import { UserRole } from '../types';

interface SsoViewProps {
  currentRole: UserRole;
  currentMemberId: string;
  currentMemberName: string;
}

export const SsoView: React.FC<SsoViewProps> = ({
  currentRole,
  currentMemberId,
  currentMemberName,
}) => {
  const [targetPortal, setTargetPortal] = useState<'courses' | 'finance' | 'armory'>('courses');
  const [ssoResponse, setSsoResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rotateMessage, setRotateMessage] = useState<string | null>(null);

  const affiliatedPortals = [
    {
      id: 'courses' as const,
      name: 'Arabiyya Scout Courses & E-Learning',
      url: 'learn.arabiyyascouts.org',
      description: 'LMS portal for Wood Badge training, Wilderness First Responder modules, and knotcraft certifications.',
      badge: 'Active SSO Node',
    },
    {
      id: 'finance' as const,
      name: 'Arabiyya Finance & Dues Management',
      url: 'finance.arabiyyascouts.org',
      description: 'Audited financial ledger, annual membership dues payment gateway, and expedition grant reimbursements.',
      badge: 'Active SSO Node',
    },
    {
      id: 'armory' as const,
      name: 'District Quartermaster & Equipment Armory',
      url: 'armory.arabiyyascouts.org',
      description: 'Inventory management for crew tents, satellite beacons, pioneering ropes, and bivouac equipment.',
      badge: 'Active SSO Node',
    },
  ];

  const handleLaunchSSO = async () => {
    setIsLoading(true);
    setSsoResponse(null);

    try {
      const res = await fetch('/api/sso/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPortal,
          memberId: currentMemberId,
          timestamp: Date.now(),
        }),
      });

      const data = await res.json();
      setSsoResponse(data);
    } catch (e) {
      console.error('SSO handshake failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotateKey = async () => {
    try {
      const res = await fetch('/api/sso/rotate-key', { method: 'POST' });
      const data = await res.json();
      setRotateMessage(`SSO Key successfully rotated! Key fingerprint: ${data.keyFingerprint}`);
      setTimeout(() => setRotateMessage(null), 4000);
    } catch (e) {
      console.error('Key rotation failed', e);
    }
  };

  const isAdmin = currentRole === 'Admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Network Infrastructure & Identity
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Federated Single Sign-On (SSO) & Node Governance
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Cryptographic shared-secret authentication handshake seamlessly unifying the Arabiyya Rover Portal with courses, finance, and armory portals.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleRotateKey}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-maroon-800" />
            <span>Rotate Network Secret Key</span>
          </button>
        )}
      </div>

      {rotateMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-mono">
          {rotateMessage}
        </div>
      )}

      {/* Affiliated Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {affiliatedPortals.map(portal => (
          <div
            key={portal.id}
            onClick={() => setTargetPortal(portal.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              targetPortal === portal.id
                ? 'bg-white border-maroon-800 shadow-md ring-1 ring-maroon-800'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-skyrover-50 text-navy-900 border border-skyrover-200">
                  {portal.badge}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{portal.url}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{portal.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{portal.description}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <span className={`font-semibold ${targetPortal === portal.id ? 'text-maroon-800' : 'text-slate-600'}`}>
                {targetPortal === portal.id ? 'Selected for Handshake' : 'Select Target'}
              </span>
              <ArrowRight className={`w-3.5 h-3.5 ${targetPortal === portal.id ? 'text-maroon-800' : 'text-slate-400'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Handshake Console */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Federated Identity Ticket Generator</h3>
            <p className="text-xs text-slate-500">
              Simulates the HMAC-SHA256 authenticated ticket exchange between portal nodes.
            </p>
          </div>

          <button
            onClick={handleLaunchSSO}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4 text-skyrover-300" />
            <span>{isLoading ? 'Computing HMAC Signature...' : `Authenticate SSO Session (${targetPortal.toUpperCase()})`}</span>
          </button>
        </div>

        {/* Handshake Result Box */}
        {ssoResponse && (
          <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs space-y-4 border border-slate-800 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-skyrover-400 font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>FEDERATED_HANDSHAKE_200_OK</span>
              </div>
              <span className="text-[11px] text-slate-400">STATUS: {ssoResponse.handshakeStatus}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Generated SSO Ticket</span>
                <span className="text-amber-400 font-bold text-sm">{ssoResponse.federatedTicket}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Key ID & Expiration</span>
                <span className="text-slate-300">{ssoResponse.activeKeyId} (TTL: {ssoResponse.expiresInSeconds}s)</span>
              </div>

              <div className="md:col-span-2 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">HMAC-SHA256 Cryptographic Signature</span>
                <span className="text-emerald-400 text-[11px] break-all">{ssoResponse.signature}</span>
              </div>

              <div className="md:col-span-2 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Redirect Endpoint URL</span>
                <span className="text-skyrover-300 text-[11px] break-all">{ssoResponse.redirectUrl}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Claims: memberId={currentMemberId}, role={currentRole}, domain={targetPortal}</span>
              <span className="text-emerald-400 font-bold">Session Validated</span>
            </div>
          </div>
        )}

        {/* Dual Layer Firestore Architecture Explainer */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-navy-950 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-maroon-800" />
              <span>Dual-Layer Firestore Persistence</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Admin SDK orchestrates server-side cryptographic validations and role-based permissions, while Web SDK caches localized field state for offline outdoor resilience.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-navy-950 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-skyrover-600" />
              <span>Role-Based Access Enforcement</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Session tokens dynamically restrict module access based on verified scout ranking, protecting governance minutes and member medical registries.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
