export type RoverRole = 
  | 'Crew Leader' 
  | 'Assistant Crew Leader' 
  | 'Senior Rover' 
  | 'Rover Scout' 
  | 'Rover Squire' 
  | 'Rover Scout Leader';

export type RankStage = 
  | 'Rover Squire' 
  | 'Stage 1 - Membership' 
  | 'Stage 2 - Training' 
  | 'Stage 3 - Service' 
  | 'B.P. Award Candidate' 
  | 'Baden-Powell Awardee';

export interface Badge {
  id: string;
  name: string;
  category: 'Leadership' | 'Service' | 'Skill';
  description: string;
  status: 'completed' | 'in_progress';
  dateEarned?: string;
  progressPercent?: number;
}

export interface ActivityLog {
  id: string;
  title: string;
  type: 'Service' | 'Training' | 'Crew Meet';
  date: string;
  hours: number;
  location: string;
  verified: boolean;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface RoverMember {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: RoverRole;
  crewId: string;
  crewName: string;
  unitDistrict: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  bloodGroup: string;
  joinedDate: string;
  investitureDate?: string;
  rankStage: RankStage;
  totalServiceHours: number;
  badgesCount: number;
  emergencyContact: EmergencyContact;
  skills: string[];
  badges: Badge[];
  recentActivities: ActivityLog[];
}

export interface RoverCrew {
  id: string;
  name: string;
  motto: string;
  district: string;
  foundedYear: number;
  leaderName: string;
  leaderId: string;
  leaderAvatar: string;
  memberCount: number;
  description: string;
  bannerImage: string;
  meetingSchedule: string;
  activeProjects: string[];
  patrols: string[];
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  author: string;
  category: 'Official Notice' | 'Service Call' | 'Event' | 'Court of Honor';
  content: string;
  isPinned?: boolean;
}

export type ActiveTab = 'home' | 'login' | 'signup' | 'dashboard';
