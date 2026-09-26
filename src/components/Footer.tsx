import React from 'react';
import { Compass, Heart, Shield, Award } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-12 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-navy-800/80">
          
          {/* Column 1: Brand & Ethos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-maroon-800 flex items-center justify-center text-white">
                <Compass className="w-4 h-4 text-skyrover-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Rover<span className="text-rose-400">Net</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official membership management portal for the Rover Scout Network. Fostering character, community leadership, and lifelong civic service.
            </p>
            <div className="pt-1 text-xs text-slate-400">
              <span className="font-semibold text-skyrover-300">Rover Motto:</span> Service
            </div>
          </div>

          {/* Column 2: Portal Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Portal Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('login')} className="hover:text-white transition-colors">
                  Member Login
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('signup')} className="hover:text-white transition-colors">
                  Join / Sign Up
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Rover Scout Resources */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Rover Resources & Values</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-skyrover-400" />
                <span>Baden-Powell Award Syllabus</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Code of Safety & Conduct</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-400" />
                <span>Community Service Logbook Standards</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Rover Scout Network Portal. Clean, youth-oriented fellowship & service.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Rover Scout Promise & Law</span>
            <span aria-hidden="true">·</span>
            <span>Safe from Harm</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
