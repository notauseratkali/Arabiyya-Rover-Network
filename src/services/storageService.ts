import { RoverMember, RoverCrew, ActivityLog } from '../types';
import { INITIAL_MEMBERS, INITIAL_CREWS } from '../data/mockData';

const STORAGE_KEYS = {
  MEMBERS: 'rovernet_members_v1',
  CREWS: 'rovernet_crews_v1',
  CURRENT_USER_ID: 'rovernet_current_user_id_v1',
};

// Initialize default state if not already in localStorage
export const getStoredMembers = (): RoverMember[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load members from localStorage', e);
    return INITIAL_MEMBERS;
  }
};

export const saveMembers = (members: RoverMember[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
  }
};

export const getStoredCrews = (): RoverCrew[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CREWS, JSON.stringify(INITIAL_CREWS));
      return INITIAL_CREWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load crews from localStorage', e);
    return INITIAL_CREWS;
  }
};

export const getCurrentUserId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  } catch (e) {
    return null;
  }
};

export const setCurrentUserId = (userId: string | null): void => {
  try {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  } catch (e) {
    console.error('Failed to update current user ID in localStorage', e);
  }
};

export const getCurrentUser = (): RoverMember | null => {
  const currentId = getCurrentUserId();
  if (!currentId) return null;
  const members = getStoredMembers();
  return members.find(m => m.id === currentId) || null;
};

export const updateMemberProfile = (updated: RoverMember): RoverMember => {
  const members = getStoredMembers();
  const index = members.findIndex(m => m.id === updated.id);
  if (index !== -1) {
    members[index] = updated;
  } else {
    members.push(updated);
  }
  saveMembers(members);
  return updated;
};

export const logNewActivity = (memberId: string, activity: Omit<ActivityLog, 'id' | 'verified'>): RoverMember | null => {
  const members = getStoredMembers();
  const member = members.find(m => m.id === memberId);
  if (!member) return null;

  const newLog: ActivityLog = {
    ...activity,
    id: `act-${Date.now()}`,
    verified: true,
  };

  const updatedActivities = [newLog, ...(member.recentActivities || [])];
  const newServiceHours = member.totalServiceHours + (activity.type === 'Service' ? activity.hours : 0);

  const updatedMember: RoverMember = {
    ...member,
    recentActivities: updatedActivities,
    totalServiceHours: newServiceHours,
  };

  updateMemberProfile(updatedMember);
  return updatedMember;
};
