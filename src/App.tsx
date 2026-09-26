/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { HomePage } from './views/HomePage';
import { LoginPage } from './views/LoginPage';
import { SignUpPage } from './views/SignUpPage';
import { DashboardView } from './views/DashboardView';
import { DigitalIdCard } from './components/DigitalIdCard';
import { ServiceHoursModal } from './components/ServiceHoursModal';
import { EditProfileModal } from './components/EditProfileModal';
import { MemberProfileModal } from './components/MemberProfileModal';

import { RoverMember, RoverCrew, ActiveTab, ActivityLog } from './types';
import { 
  getStoredMembers, 
  getStoredCrews, 
  getCurrentUser, 
  setCurrentUserId, 
  updateMemberProfile, 
  logNewActivity, 
  saveMembers
} from './services/storageService';
import { isFirebaseConfigured } from './firebase';
import { fetchMembersFromFirestore, fetchCrewsFromFirestore, saveMemberToFirestore } from './services/firebaseService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [members, setMembers] = useState<RoverMember[]>([]);
  const [crews, setCrews] = useState<RoverCrew[]>([]);
  const [currentUser, setCurrentUser] = useState<RoverMember | null>(null);

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [profileModalMember, setProfileModalMember] = useState<RoverMember | null>(null);
  const [idCardMember, setIdCardMember] = useState<RoverMember | null>(null);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initialize data on mount (with Firestore sync if configured)
  useEffect(() => {
    const loadedMembers = getStoredMembers();
    const loadedCrews = getStoredCrews();
    const activeUser = getCurrentUser();

    setMembers(loadedMembers);
    setCrews(loadedCrews);
    setCurrentUser(activeUser);

    if (isFirebaseConfigured) {
      // Load live from Firestore
      fetchMembersFromFirestore().then(firestoreMembers => {
        if (firestoreMembers && firestoreMembers.length > 0) {
          setMembers(firestoreMembers);
          saveMembers(firestoreMembers);
        }
      }).catch(err => {
        console.warn('Firestore initial fetch fallback:', err);
      });

      fetchCrewsFromFirestore().then(firestoreCrews => {
        if (firestoreCrews && firestoreCrews.length > 0) {
          setCrews(firestoreCrews);
        }
      }).catch(err => {
        console.warn('Firestore crews fetch fallback:', err);
      });
    }
  }, []);

  // Handle Tab navigation with auth guard for dashboard
  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'dashboard' && !currentUser) {
      showToast('Authentication required to access the Member Dashboard. Please log in or choose a demo profile.');
      setActiveTab('login');
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLoginSuccess = (member: RoverMember) => {
    setCurrentUser(member);
    setCurrentUserId(member.id);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${member.name}! Accessing your Rover dashboard.`);
  };

  const handleSignUpSuccess = (newMember: RoverMember) => {
    const updated = [newMember, ...members];
    setMembers(updated);
    saveMembers(updated);
    setCurrentUser(newMember);
    setCurrentUserId(newMember.id);
    setActiveTab('dashboard');

    if (isFirebaseConfigured) {
      saveMemberToFirestore(newMember).catch(err => console.warn('Could not sync new member to Firestore:', err));
    }

    showToast(`Congratulations ${newMember.name}! You are now enrolled in ${newMember.crewName}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserId(null);
    setActiveTab('home');
    showToast('You have successfully logged out of the portal.');
  };

  // Member Action Handlers
  const handleSaveProfile = (updated: RoverMember) => {
    const saved = updateMemberProfile(updated);
    setMembers(prev => prev.map(m => m.id === saved.id ? saved : m));
    if (currentUser?.id === saved.id) {
      setCurrentUser(saved);
    }

    if (isFirebaseConfigured) {
      saveMemberToFirestore(saved).catch(err => console.warn('Could not sync profile to Firestore:', err));
    }

    showToast('Your profile and emergency contact details have been updated.');
  };

  const handleLogActivity = (activity: Omit<ActivityLog, 'id' | 'verified'>) => {
    if (!currentUser) return;
    const updated = logNewActivity(currentUser.id, activity);
    if (updated) {
      setCurrentUser(updated);
      setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));

      if (isFirebaseConfigured) {
        saveMemberToFirestore(updated).catch(err => console.warn('Could not sync logbook to Firestore:', err));
      }

      showToast(`Logged ${activity.hours} hours for "${activity.title}". Records updated!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-maroon-800 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 max-w-md bg-navy-950 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-navy-800 flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar Navigation with Sidebar Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenIdCard={currentUser ? () => setIdCardMember(currentUser) : undefined}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        crews={crews}
        onLogout={handleLogout}
        onOpenIdCard={currentUser ? () => setIdCardMember(currentUser) : undefined}
        onOpenLogHours={() => setIsLogHoursOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            crews={crews}
            members={members}
            setActiveTab={handleTabChange}
            onSelectMember={(m) => setProfileModalMember(m)}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            members={members}
            onLoginSuccess={handleLoginSuccess}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === 'signup' && (
          <SignUpPage
            crews={crews}
            onSignUpSuccess={handleSignUpSuccess}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            crews={crews}
            allMembers={members}
            onOpenIdCard={() => setIdCardMember(currentUser)}
            onOpenLogHours={() => setIsLogHoursOpen(true)}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onSelectMember={(m) => setProfileModalMember(m)}
            setActiveTab={handleTabChange}
          />
        )}
      </main>

      {/* Digital Membership ID Pass Modal */}
      {idCardMember && (
        <DigitalIdCard
          member={idCardMember}
          onClose={() => setIdCardMember(null)}
        />
      )}

      {/* Member Profile Inspection Modal */}
      {profileModalMember && (
        <MemberProfileModal
          member={profileModalMember}
          onClose={() => setProfileModalMember(null)}
          onOpenIdCard={(m) => setIdCardMember(m)}
        />
      )}

      {/* Log Service Hours Modal */}
      {isLogHoursOpen && (
        <ServiceHoursModal
          onClose={() => setIsLogHoursOpen(false)}
          onSubmit={handleLogActivity}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && currentUser && (
        <EditProfileModal
          member={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />

    </div>
  );
}
