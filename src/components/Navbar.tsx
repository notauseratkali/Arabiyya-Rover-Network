import React from 'react';
import { Compass, LogOut, LayoutDashboard, Shield, Menu } from 'lucide-react';
import { RoverMember, ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: RoverMember | null;
  onLogout: () => void;
  onOpenIdCard?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenIdCard,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Sidebar Toggle + Brand wordmark with subtle insignia */}
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-maroon-700"
              title="Open Navigation Menu"
              aria-label="Toggle Sidebar Navigation"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          )}

          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-700 rounded-md"
          >
            <div className="w-9 h-9 rounded-lg bg-maroon-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-skyrover-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Arabiyya <span className="text-maroon-800">Rovers</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation link */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors hover:text-maroon-900 pb-1 ${
                activeTab === 'dashboard'
                  ? 'text-maroon-900 border-b-2 border-maroon-800 font-semibold'
                  : ''
              }`}
            >
              Member Dashboard
            </button>
          </nav>
        )}

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-maroon-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-skyrover-400" />
                <span>My Dashboard</span>
              </button>

              {onOpenIdCard && (
                <button
                  onClick={onOpenIdCard}
                  title="View Digital Membership ID Card"
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-navy-800 bg-skyrover-50 border border-skyrover-100 hover:bg-skyrover-100 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-skyrover-600" />
                  <span>ID Card</span>
                </button>
              )}

              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-900 truncate max-w-[110px]">{currentUser.name}</div>
                  <div className="text-slate-500 text-[11px] truncate max-w-[110px]">{currentUser.role}</div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out of portal"
                className="p-1.5 text-slate-400 hover:text-maroon-800 hover:bg-rose-50 rounded-lg transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-maroon-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Portal Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                Join / Sign Up
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile secondary tab strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-2 text-xs">
        {currentUser ? (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded ${activeTab === 'dashboard' ? 'font-bold text-maroon-900 bg-maroon-100' : 'text-slate-700'}`}
          >
            Dashboard
          </button>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-3 py-1 rounded ${activeTab === 'login' ? 'font-bold text-maroon-900' : 'text-slate-600'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-3 py-1 rounded ${activeTab === 'signup' ? 'font-bold text-maroon-900' : 'text-slate-600'}`}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};
