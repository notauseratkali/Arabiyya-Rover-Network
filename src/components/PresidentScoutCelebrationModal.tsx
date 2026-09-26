import React from 'react';
import { Award, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface PresidentScoutCelebrationModalProps {
  onClose: () => void;
  section: 'Explorer' | 'Rover';
}

export const PresidentScoutCelebrationModal: React.FC<PresidentScoutCelebrationModalProps> = ({
  onClose,
  section,
}) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-navy-950 border border-amber-500/40 rounded-3xl p-6 text-white text-center shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-maroon-600/30 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
          <Award className="w-8 h-8 text-slate-950" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold mb-3 border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>President Scout Distinction</span>
        </div>

        <h3 className="text-xl font-black tracking-tight text-white mb-2">
          Mabrouk! Congratulations!
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Holding or achieving the highest youth scouting distinction—the <strong>President Scout (PS) Award</strong>—places you in an esteemed cadre within the Arabiyya Scout Network.
          {section === 'Rover' 
            ? ' Your President Scout foundation grants you accelerated standing towards the coveted Baden-Powell (BP) Award.' 
            : ' Your dedication exemplifies the highest ideals of leadership, service, and scouting honor.'}
        </p>

        <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-left space-y-2 mb-6 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Honors Cataloged for Council Verification</span>
          </div>
          <div className="flex items-center gap-2 text-skyrover-300 font-semibold text-[11px]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Eligible for Patrol Leadership &amp; Senior Rover Mentorship</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95"
        >
          Proceed to Timeline Estimation
        </button>

      </div>
    </div>
  );
};
