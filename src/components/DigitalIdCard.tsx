import React from 'react';
import { X, Printer, Shield, Droplets, Phone, MapPin, Compass, CheckCircle2, QrCode } from 'lucide-react';
import { RoverMember } from '../types';
import { ASSETS } from '../data/mockData';

interface DigitalIdCardProps {
  member: RoverMember;
  onClose: () => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ member, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100/80 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-maroon-800" />
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Official Rover Membership Credential
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Membership Card Container */}
        <div className="p-6 bg-slate-50">
          
          <div className="relative mx-auto bg-white rounded-xl shadow-md border-2 border-slate-200 overflow-hidden print:shadow-none print:border">
            
            {/* Card Header (Deep Maroon with Navy accent line) */}
            <div className="bg-maroon-900 text-white px-5 py-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
                    <img 
                      src={ASSETS.roverCrest} 
                      alt="Rover Crest" 
                      className="w-8 h-8 object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight uppercase leading-none text-white">
                      Rover Scout Network
                    </h3>
                    <p className="text-[11px] text-skyrover-300 tracking-wider font-medium mt-1">
                      MEMBERSHIP IDENTITY PASS
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-300 uppercase tracking-wider">Credential ID</div>
                  <div className="font-mono text-xs font-bold text-white tracking-widest">{member.id}</div>
                </div>
              </div>

              {/* Light blue subtle accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-skyrover-400 via-skyrover-300 to-skyrover-500" />
            </div>

            {/* Card Body */}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                
                {/* Photo & Role */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-maroon-800 shadow-sm"
                    />
                    <div className="absolute -bottom-2 -right-1 bg-navy-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white shadow-xs">
                      {member.bloodGroup}
                    </div>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-maroon-800 text-center uppercase tracking-wide">
                    {member.role}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2.5 w-full">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {member.name}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                      <span className="font-medium text-navy-800">{member.crewName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{member.unitDistrict}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Rank / Stage</span>
                      <span className="font-semibold text-slate-800 text-xs">{member.rankStage}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Member Since</span>
                      <span className="font-mono text-slate-800 text-xs">{member.joinedDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Service Logged</span>
                      <span className="font-semibold text-navy-800 text-xs">{member.totalServiceHours} Hours</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Emergency ICE</span>
                      <span className="font-mono text-slate-800 text-[11px]">{member.emergencyContact.phone}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Security Strip with QR simulation */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between bg-slate-50 p-2.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white p-1 rounded border border-slate-200 flex items-center justify-center">
                    <QrCode className="w-7 h-7 text-slate-800" />
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    <div className="font-semibold text-slate-800">Verified Rover Credential</div>
                    <div className="font-mono text-[9px] text-slate-400">HASH: ROV-AUTH-SEC-2026</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Active Standing</span>
                </div>
              </div>

            </div>

            {/* Micro Motto Footer */}
            <div className="bg-navy-900 text-center py-1.5 text-[10px] font-medium text-slate-300 tracking-wider uppercase">
              Rover Motto: &quot;Service&quot; · Be Prepared
            </div>

          </div>

          <p className="text-center text-[11px] text-slate-500 mt-3 print:hidden">
            Present this credential at all Rover Moots, backcountry expeditions, and community service check-ins.
          </p>

        </div>

      </div>
    </div>
  );
};
