import React from 'react';
import { 
  X, 
  Home, 
  LayoutDashboard, 
  Shield, 
  Clock, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Compass, 
  ChevronRight,
  User
} from 'lucide-react';
import { RoverMember, RoverCrew, ActiveTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: RoverMember | null;
  crews?: RoverCrew[];
  onLogout: () => void;
  onOpenIdCard?: () => void;
  onOpenLogHours?: () => void;
  onOpenEditProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenIdCard,
  onOpenLogHours,
}) => {
  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Backdrop for mobile & slide-over */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Portal Sidebar Navigation"
      >
        {/* Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-maroon-900 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-4 h-4 text-skyrover-400" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Rover<span className="text-maroon-800">Net</span>
              </span>
              <span className="text-[10px] text-slate-500 block leading-none font-medium">
                Scout Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 text-xs">
          
          {/* Member Card if logged in */}
          {currentUser ? (
            <div className="p-3.5 bg-gradient-to-br from-slate-900 via-navy-950 to-maroon-950 text-white rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-xl object-cover border-2 border-white/20 bg-white"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-maroon-700 text-white font-mono text-[9px] font-bold px-1 rounded border border-white/40">
                    {currentUser.bloodGroup}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-white truncate leading-snug">{currentUser.name}</h4>
                  <p className="text-[11px] text-rose-300 font-semibold truncate">{currentUser.role}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.crewName}</p>
                </div>
              </div>

              {/* Quick metrics in card */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                <div className="bg-white/5 rounded-lg p-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Service</span>
                  <span className="font-bold font-mono text-skyrover-300 text-xs">
                    {currentUser.totalServiceHours} hrs
                  </span>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Badges</span>
                  <span className="font-bold font-mono text-emerald-300 text-xs">
                    {currentUser.badges?.length || currentUser.badgesCount}
                  </span>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {onOpenIdCard && (
                  <button
                    onClick={() => {
                      onOpenIdCard();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-semibold text-white transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-skyrover-400" />
                    <span>ID Pass</span>
                  </button>
                )}

                {onOpenLogHours && (
                  <button
                    onClick={() => {
                      onOpenLogHours();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-maroon-800 hover:bg-maroon-700 rounded-lg text-[11px] font-semibold text-white transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-rose-300" />
                    <span>Log Hours</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-maroon-100 text-maroon-900 mx-auto flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Rover Scout Portal</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sign in to access your digital ID card and log community service.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="flex-1 py-1.5 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Primary Navigation Menu */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Menu Navigation
            </span>

            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                activeTab === 'home'
                  ? 'bg-maroon-50 text-maroon-900 font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-maroon-900' : 'text-slate-400'}`} />
                <span>Home Page</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {currentUser ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-maroon-50 text-maroon-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-maroon-900' : 'text-slate-400'}`} />
                  <span>Member Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                    activeTab === 'login'
                      ? 'bg-maroon-50 text-maroon-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="w-4 h-4 text-slate-400" />
                    <span>Member Login</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('signup')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                    activeTab === 'signup'
                      ? 'bg-maroon-50 text-maroon-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4 text-slate-400" />
                    <span>Join / Sign Up</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </>
            )}
          </div>

        </div>

        {/* Footer Area: User logout or Portal info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 shrink-0">
          {currentUser ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Portal</span>
            </button>
          ) : (
            <div className="text-center text-[10px] text-slate-400">
              Rover Scout Network Portal &bull; Youth Service
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
