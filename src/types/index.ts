export type RoverRole = 
  | 'Crew Leader' 
  | 'Assistant Crew Leader' 
  | 'Senior Rover' 
  | 'Rover Scout' 
  | 'Explorer Scout' 
  | 'Rover Squire' 
  | 'Leader Candidate' 
  | 'Rover Scout Leader' 
  | 'Group Scout Leader' 
  | 'Explorer' 
  | 'Rover' 
  | 'Leader' 
  | 'Secretary' 
  | 'Admin' 
  | 'Guest';

export type UserRole = RoverRole;

export type SectionType = 'Underage' | 'Junior / Underage' | 'Explorer' | 'Explorer Scout' | 'Rover' | 'Rover Scout' | 'Leader' | 'Leader Track';

export type ApplicationStatus = 
  | 'Pending Verification' 
  | 'Pending Review'
  | 'Interview Scheduled' 
  | 'Approved' 
  | 'Investiture Ready' 
  | 'Active' 
  | 'Archived'
  | 'Rejected';

export type RankStage = 
  | 'Explorer Scout'
  | 'Explorer Candidate'
  | 'President Scout Candidate'
  | 'President Scout Award Candidate'
  | 'President Scout Awardee'
  | 'Rover Squire' 
  | 'Stage 1 - Membership' 
  | 'Stage 2 - Training' 
  | 'Stage 3 - Service' 
  | 'B.P. Award Candidate' 
  | 'Baden-Powell Awardee'
  | 'Leader Track Candidate';

export type ScoutingSection = SectionType;
export type DobVerificationResult = DobVerificationResponse;
export type MemberApplication = MemberApplicationRecord;
export type LeaderApplication = LeaderApplicationRecord;

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
  memberId?: string;
  memberName?: string;
  memberSection?: string;
  title: string;
  type: 'Service' | 'Training' | 'Crew Meet' | 'Camp' | 'Hike' | 'Milestone';
  date: string;
  hours: number;
  location: string;
  verified: boolean;
  status?: 'Draft' | 'Pending Review' | 'Verified' | 'Revision Requested';
  reflections?: string;
  skillsPracticed?: string[];
  submittedAt?: string;
  reviewerName?: string;
  reviewerRole?: string;
  reviewerNotes?: string;
  verifiedAt?: string;
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
  commonName?: string;
  nationalId?: string;
  idCardNumber?: string;
  email: string;
  password?: string;
  username?: string;
  role: RoverRole;
  section?: SectionType;
  crewId: string;
  crewName: string;
  unitDistrict: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  telegramTag?: string;
  instagramHandle?: string;
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
  awardGoal?: string;
  status?: ApplicationStatus;
  applicationId?: string;
  dateOfBirth?: string;
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

export interface BroadcastMessage {
  id: string;
  title: string;
  priority: 'High' | 'Normal' | 'Urgent';
  targetAudience: 'All' | 'Rovers' | 'Leaders' | 'Explorers';
  channels: {
    inPortalBanner: boolean;
    emailHtml: boolean;
    telegramChannel: boolean;
  };
  content: string;
  dispatchedBy: string;
  timestamp: string;
  metrics: {
    inPortalViews: number;
    emailsSent: number;
    telegramDeliveries: number;
  };
}

export interface AttendanceExcuse {
  id: string;
  memberId: string;
  memberName: string;
  eventId: string;
  eventTitle: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  filedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface ConstitutionArticle {
  id: string;
  number?: string | number;
  articleNumber?: number;
  title: string;
  titleAr?: string;
  summary?: string;
  content?: string;
  sections?: string[];
  subsections?: string[];
  subclauses?: string[];
  category: string;
}

export interface MeetingMinutes {
  id: string;
  referenceNumber: string;
  title: string;
  date: string;
  location: string;
  chairPerson: string;
  secretary: string;
  attendees: string[];
  absentees: string[];
  agenda: string[];
  resolutions: Array<{
    id: string;
    topic: string;
    decision: string;
    assignedTo: string;
    deadline: string;
  }>;
  bodyHtml: string;
  status: 'Draft' | 'Published';
  publishedAt?: string;
}

export type ActiveTab = 'home' | 'login' | 'signup' | 'dashboard' | 'council';

// Verification & Onboarding Data Structures
export interface ExactAge {
  years: number;
  months: number;
  days: number;
}

export interface DobVerificationResponse {
  isEligible?: boolean;
  eligible?: boolean;
  section: SectionType;
  exactAge: ExactAge;
  age?: ExactAge & { totalDays?: number };
  awardPathway?: string;
  cutoffAge?: number;
  deadlineDate?: string;
  keyDeadlineRule?: string;
  cutoffDate?: string;
  deadlineRule?: string;
  timeRemaining?: {
    years: number;
    months: number;
    days: number;
  };
  remainingTime: {
    years: number;
    months: number;
    days: number;
    totalDays?: number;
  };
  completionBenchmarkMonths?: number;
  standardBenchmarkMonths?: number;
  feasibilityStatus?: 'Optimal' | 'Feasible' | 'Tight Schedule' | 'Extremely Tight';
  isLeaderTrack?: boolean;
  redirectLeader?: boolean;
  message: string;
  [key: string]: any;
}

export interface MemberApplicationRecord {
  id?: string;
  applicationId: string;
  section: SectionType;
  status: ApplicationStatus | 'Pending Verification';
  dob?: { year?: number; month?: number; day?: number; isoString?: string };
  exactAge?: ExactAge;
  age?: { years: number; months: number; days: number };
  awardGoal?: {
    willingForAward: boolean;
    goalTitle: string;
  };
  targetAward?: string;
  standing?: {
    currentBadgeLevel: string;
    remainingYears: number;
    remainingMonths: number;
    remainingDays: number;
    deadlineDate: string;
  };
  currentBadgeLevel?: string;
  countdown?: {
    years: number;
    months: number;
    days: number;
    cutoffDate?: string;
    deadlineFormatted?: string;
    feasible?: boolean | string;
    [key: string]: any;
  };
  commitmentsAccepted?: boolean;
  background?: {
    type: 'new' | 'former';
    troopNumber?: string;
    atollIsland?: string;
    officialDesignation?: string;
  };
  scoutingBackground?: string | {
    isNewToScouting?: boolean;
    previousGroupNumber?: string;
    previousAtollIsland?: string;
    formattedDesignation?: string;
  };
  personal: {
    fullName: string;
    commonName?: string;
    nationalId?: string;
    idCardNumber?: string;
    gender?: 'Male' | 'Female';
  };
  permanentAddress?: {
    country?: string;
    dialCode?: string;
    atoll?: string;
    atollState?: string;
    island?: string;
    islandCity?: string;
    ward?: string;
    districtWard?: string;
    streetAddress?: string;
    streetLine?: string;
  };
  livingAddress?: {
    isSameAsPermanent: boolean;
    country?: string;
    atoll?: string;
    island?: string;
    ward?: string;
    streetAddress?: string;
  };
  contacts?: {
    phone?: string;
    mobilePhone?: string;
    dialCode?: string;
    secondaryPhone?: string;
    telegramTag?: string;
    instagramHandle?: string;
    email?: string;
  };
  account?: {
    username?: string;
    password?: string;
    passwordHash?: string;
  };
  emergencyContact?: {
    fullName?: string;
    name?: string;
    relationship?: string;
    relation?: string;
    phone?: string;
  };
  credentials?: {
    username?: string;
    password?: string;
  };
  policyAccepted?: boolean;
  submittedAt: string;
  councilReviewNotes?: string;
  councilNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  phoneInterviewDate?: string;
  investitureDate?: string;
  [key: string]: any;
}

export interface LeaderApplicationRecord {
  id?: string;
  applicationId: string;
  fullName?: string;
  legalName?: string;
  nationalId?: string;
  idCardNumber?: string;
  country?: string;
  atoll?: string;
  island?: string;
  ward?: string;
  streetAddress?: string;
  phone?: string;
  mobileNumber?: string;
  email?: string;
  officialEmail?: string;
  woodBadgeStatus?: string;
  areaOfExpertise?: string;
  scoutingExperience?: string;
  leadershipMotivation?: string;
  motivation?: string;
  status: 'Pending Review' | 'Approved' | 'Archived' | 'Pending Verification' | ApplicationStatus;
  submittedAt: string;
  reviewNotes?: string;
  [key: string]: any;
}

export interface PipelineApplication {
  trackingCode: string;
  name: string;
  email: string;
  phone: string;
  telegramHandle: string;
  dob: string;
  calculatedAge: number;
  allocatedSection: SectionType;
  bloodGroup: string;
  scoutBackground: string;
  emergencyContact: EmergencyContact;
  otp?: string;
  status: 'otp_pending' | 'submitted' | 'interview_scheduled' | 'approved' | 'investiture_ready' | 'rejected';
  createdAt: string;
  notes?: string;
}
