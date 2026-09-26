import { 
  DobVerificationResult, 
  ScoutingSection, 
  MemberApplication, 
  LeaderApplication, 
  RoverMember, 
  ApplicationStatus 
} from '../types';
import { getStoredMembers, saveMembers } from './storageService';

// Storage Keys
const MEMBER_APPS_KEY = 'arabiyya_member_applications_v1';
const LEADER_APPS_KEY = 'arabiyya_leader_applications_v1';
const COUNCIL_NOTIFICATIONS_KEY = 'arabiyya_council_notifications_v1';

// Ordinal helper
export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Auto-format Scout Unit Identification (e.g. 1 and Male' => "1st Male' Scout Group")
export function formatUnitDesignation(groupNumberStr: string, atollIslandStr: string): string {
  const trimmedNum = groupNumberStr.trim();
  const trimmedLoc = atollIslandStr.trim();

  if (!trimmedNum && !trimmedLoc) return '';
  const num = parseInt(trimmedNum, 10);
  
  if (isNaN(num)) {
    return trimmedLoc ? `${trimmedNum} ${trimmedLoc} Scout Group` : trimmedNum;
  }

  const ordinal = getOrdinal(num);
  return trimmedLoc 
    ? `${ordinal} ${trimmedLoc} Scout Group`
    : `${ordinal} Scout Group`;
}

// Calculate exact age in years, months, and days down to the exact day
export function calculateExactAge(birthDate: Date, targetDate: Date = new Date()): { years: number; months: number; days: number; totalDays: number } {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = targetDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
}

// Exact date calculation to cutoff birthday (18th or 26th birthday minus 1 day)
export function calculateAwardCutoff(birthDate: Date, cutoffAge: number): { cutoffDate: Date; yearsRemaining: number; monthsRemaining: number; daysRemaining: number } {
  const cutoffBirthday = new Date(birthDate.getFullYear() + cutoffAge, birthDate.getMonth(), birthDate.getDate());
  // Deadline is 1 day prior to the milestone birthday
  const deadlineDate = new Date(cutoffBirthday);
  deadlineDate.setDate(deadlineDate.getDate() - 1);

  const today = new Date();
  const remaining = calculateExactAge(today, deadlineDate);

  return {
    cutoffDate: deadlineDate,
    yearsRemaining: Math.max(0, remaining.years),
    monthsRemaining: Math.max(0, remaining.months),
    daysRemaining: Math.max(0, remaining.days),
  };
}

// Main DOB verification algorithm
export function verifyDobAlgorithm(year: number, month: number, day: number): DobVerificationResult {
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  const emptyAge = { years: 0, months: 0, days: 0 };
  const emptyRemaining = { years: 0, months: 0, days: 0, totalDays: 0 };

  // Validate real date
  if (isNaN(birthDate.getTime()) || birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
    return {
      isEligible: false,
      eligible: false,
      section: 'Junior / Underage',
      exactAge: emptyAge,
      remainingTime: emptyRemaining,
      awardPathway: 'Ineligible',
      cutoffAge: 16,
      deadlineDate: '',
      deadlineRule: '',
      standardBenchmarkMonths: 0,
      feasibilityStatus: 'Extremely Tight',
      isLeaderTrack: false,
      message: 'Invalid date of birth provided. Please check Year, Month, and Day.',
    };
  }

  if (birthDate > today) {
    return {
      isEligible: false,
      eligible: false,
      section: 'Junior / Underage',
      exactAge: emptyAge,
      remainingTime: emptyRemaining,
      awardPathway: 'Ineligible',
      cutoffAge: 16,
      deadlineDate: '',
      deadlineRule: '',
      standardBenchmarkMonths: 0,
      feasibilityStatus: 'Extremely Tight',
      isLeaderTrack: false,
      message: 'Date of birth cannot be in the future.',
    };
  }

  const age = calculateExactAge(birthDate, today);
  const exactAge = { years: age.years, months: age.months, days: age.days };

  // 1. Under 16 years
  if (age.years < 16) {
    return {
      isEligible: false,
      eligible: false,
      section: 'Junior / Underage',
      exactAge,
      remainingTime: emptyRemaining,
      awardPathway: 'Ineligible',
      cutoffAge: 16,
      deadlineDate: '',
      deadlineRule: 'Must be at least 16 years old to join.',
      standardBenchmarkMonths: 0,
      feasibilityStatus: 'Extremely Tight',
      isLeaderTrack: false,
      message: 'Applications are not accepted; applicants must be at least 16 years old to join the Arabiyya Rover Network.',
    };
  }

  // 2. 16 to < 18 years: Explorer Scout
  if (age.years >= 16 && age.years < 18) {
    const cutoff = calculateAwardCutoff(birthDate, 18);
    const benchmarkMonths = 15;
    const totalRemainingMonths = cutoff.yearsRemaining * 12 + cutoff.monthsRemaining + cutoff.daysRemaining / 30;
    const remainingTime = {
      years: cutoff.yearsRemaining,
      months: cutoff.monthsRemaining,
      days: cutoff.daysRemaining,
      totalDays: Math.floor(totalRemainingMonths * 30),
    };

    return {
      isEligible: true,
      eligible: true,
      section: 'Explorer Scout',
      exactAge,
      remainingTime,
      awardPathway: 'President Scout (PS) Award',
      cutoffAge: 18,
      deadlineDate: cutoff.cutoffDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      deadlineRule: 'Final portfolio/badge submission deadline is 1 day prior to the 18th birthday.',
      standardBenchmarkMonths: benchmarkMonths,
      feasibilityStatus: totalRemainingMonths >= benchmarkMonths ? 'Feasible' : 'Tight Schedule',
      isLeaderTrack: false,
      message: totalRemainingMonths >= benchmarkMonths
        ? `You have ${cutoff.yearsRemaining}y ${cutoff.monthsRemaining}m ${cutoff.daysRemaining}d remaining. Standard completion benchmark is ~15 months.`
        : `Timeline Notice: You have ${cutoff.yearsRemaining}y ${cutoff.monthsRemaining}m remaining. Accelerated badge planning is recommended for PS Award completion.`,
    };
  }

  // 3. 18 to < 26 years: Rover Scout
  if (age.years >= 18 && age.years < 26) {
    const cutoff = calculateAwardCutoff(birthDate, 26);
    const benchmarkMonths = 36; // ~3 years
    const totalRemainingMonths = cutoff.yearsRemaining * 12 + cutoff.monthsRemaining + cutoff.daysRemaining / 30;
    const remainingTime = {
      years: cutoff.yearsRemaining,
      months: cutoff.monthsRemaining,
      days: cutoff.daysRemaining,
      totalDays: Math.floor(totalRemainingMonths * 30),
    };

    return {
      isEligible: true,
      eligible: true,
      section: 'Rover Scout',
      exactAge,
      remainingTime,
      awardPathway: 'Baden-Powell (BP) Award',
      cutoffAge: 26,
      deadlineDate: cutoff.cutoffDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      deadlineRule: 'Final portfolio/badge submission deadline is 1 day prior to the 26th birthday.',
      standardBenchmarkMonths: benchmarkMonths,
      feasibilityStatus: totalRemainingMonths >= benchmarkMonths ? 'Feasible' : 'Tight Schedule',
      isLeaderTrack: false,
      message: totalRemainingMonths >= benchmarkMonths
        ? `You have ${cutoff.yearsRemaining}y ${cutoff.monthsRemaining}m ${cutoff.daysRemaining}d remaining before your 26th birthday. Standard completion benchmark is ~3 years.`
        : `Timeline Notice: You have ${cutoff.yearsRemaining}y ${cutoff.monthsRemaining}m remaining. A structured progression plan will help you achieve the BP Award!`,
    };
  }

  // 4. 26 years and above: Leader Track
  return {
    isEligible: true,
    eligible: true,
    section: 'Leader Track',
    exactAge,
    remainingTime: emptyRemaining,
    redirectLeader: true,
    awardPathway: 'Leadership / Adult Scouting',
    cutoffAge: 26,
    deadlineDate: 'N/A (Adult Leadership)',
    deadlineRule: 'Automatically diverted to the Arabiyya Leader Candidate Pathway.',
    standardBenchmarkMonths: 0,
    feasibilityStatus: 'Optimal',
    isLeaderTrack: true,
    message: 'Welcome! Applicants 26 and above join our distinguished Leader Candidate Pathway for leadership and mentorship.',
  };
}

// Live Availability / Conflict Checker
export function checkFieldAvailability(field: string, value: string): { available: boolean; message?: string } {
  const val = value.trim().toLowerCase();
  if (!val) return { available: true };

  const members = getStoredMembers();
  const pendingApps = getStoredMemberApplications();

  // Check Members
  for (const m of members) {
    if (field === 'idCard' && m.idCardNumber && m.idCardNumber.toLowerCase() === val) {
      return { available: false, message: 'This National ID / Passport is already registered.' };
    }
    if (field === 'email' && m.email && m.email.toLowerCase() === val) {
      return { available: false, message: 'This email address is already associated with an existing account.' };
    }
    if (field === 'phone' && m.phone && m.phone.replace(/\D/g, '') === val.replace(/\D/g, '')) {
      return { available: false, message: 'This phone number is already registered.' };
    }
    if (field === 'telegram' && m.telegramTag && m.telegramTag.toLowerCase().replace('@', '') === val.replace('@', '')) {
      return { available: false, message: 'This Telegram tag is already claimed.' };
    }
    if (field === 'instagram' && m.instagramHandle && m.instagramHandle.toLowerCase().replace('@', '') === val.replace('@', '')) {
      return { available: false, message: 'This Instagram handle is already registered.' };
    }
    if (field === 'username' && m.username && m.username.toLowerCase() === val) {
      return { available: false, message: 'This username is already taken. Please choose another.' };
    }
  }

  // Check Pending Applications
  for (const app of pendingApps) {
    if (field === 'idCard' && (app.personal?.idCardNumber || app.personal?.nationalId || '').toLowerCase() === val) {
      return { available: false, message: 'An active application with this ID Card number is already pending review.' };
    }
    if (field === 'email' && (app.contacts?.email || '').toLowerCase() === val) {
      return { available: false, message: 'An active application with this email is currently pending review.' };
    }
    if (field === 'username' && (app.account?.username || app.credentials?.username || '').toLowerCase() === val) {
      return { available: false, message: 'This username has been reserved by a pending applicant.' };
    }
  }

  return { available: true };
}

// Application Persistence
export function getStoredMemberApplications(): MemberApplication[] {
  try {
    const raw = localStorage.getItem(MEMBER_APPS_KEY);
    if (!raw) {
      // Seed with initial realistic pending applications for council review
      const sampleApps: MemberApplication[] = [
        {
          id: 'app-901',
          applicationId: 'mem-847291',
          status: 'Pending Verification',
          submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          section: 'Rover Scout',
          dob: { year: 2005, month: 4, day: 15, isoString: '2005-04-15' },
          age: { years: 21, months: 5, days: 10 },
          awardIntent: 'Yes, I am willing!',
          targetAward: 'Baden-Powell (BP) Award',
          currentBadgeLevel: 'Bushman’s Thong',
          countdown: {
            years: 4,
            months: 6,
            days: 19,
            cutoffDate: 'April 14, 2031',
            feasible: true,
            benchmarkMonths: 36,
          },
          commitmentAccepted: true,
          scoutingBackground: {
            isNewToScouting: false,
            previousGroupNumber: '1',
            previousAtollIsland: "Male'",
            formattedDesignation: "1st Male' Scout Group",
          },
          personal: {
            fullName: 'Ibrahim Zayan',
            commonName: 'Zayan',
            idCardNumber: 'A293841',
            gender: 'Male',
          },
          permanentAddress: {
            country: 'Maldives',
            atollState: "Kaafu Atoll",
            islandCity: "Male'",
            districtWard: 'Henveiru',
            streetLine: 'H. Moonlight Breeze, 4th Floor',
          },
          currentAddress: {
            sameAsPermanent: true,
            country: 'Maldives',
            atollState: "Kaafu Atoll",
            islandCity: "Male'",
            districtWard: 'Henveiru',
            streetLine: 'H. Moonlight Breeze, 4th Floor',
          },
          contacts: {
            dialCode: '+960',
            mobilePhone: '7914567',
            secondaryPhone: '3321122',
            telegramTag: '@zayan_scout',
            instagramHandle: '@zayan.ibrahim',
            email: 'zayan.ibrahim@arabiyya.edu.mv',
          },
          emergencyContact: {
            fullName: 'Ahmed Zayan Senior',
            relationship: 'Parent',
            phone: '+960 7712345',
          },
          account: {
            username: 'zayan.rov',
            password: 'password123',
          },
          policyRatified: true,
        },
        {
          id: 'app-902',
          applicationId: 'mem-619420',
          status: 'Pending Verification',
          submittedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
          section: 'Explorer Scout',
          dob: { year: 2009, month: 8, day: 20, isoString: '2009-08-20' },
          age: { years: 17, months: 1, days: 5 },
          awardIntent: 'Yes, I am willing!',
          targetAward: 'President Scout (PS) Award',
          currentBadgeLevel: 'Advanced Scout Standard',
          countdown: {
            years: 0,
            months: 10,
            days: 24,
            cutoffDate: 'August 19, 2027',
            feasible: true,
            benchmarkMonths: 15,
          },
          commitmentAccepted: true,
          scoutingBackground: {
            isNewToScouting: false,
            previousGroupNumber: '7',
            previousAtollIsland: 'Hulhumale',
            formattedDesignation: '7th Hulhumale Scout Group',
          },
          personal: {
            fullName: 'Aishath Rimsha',
            commonName: 'Rimsha',
            idCardNumber: 'A381920',
            gender: 'Female',
          },
          permanentAddress: {
            country: 'Maldives',
            atollState: 'Kaafu Atoll',
            islandCity: 'Hulhumale',
            districtWard: 'Phase 1',
            streetLine: 'Flat 10-2-B, Nirolhu Magu',
          },
          currentAddress: {
            sameAsPermanent: true,
            country: 'Maldives',
            atollState: 'Kaafu Atoll',
            islandCity: 'Hulhumale',
            districtWard: 'Phase 1',
            streetLine: 'Flat 10-2-B, Nirolhu Magu',
          },
          contacts: {
            dialCode: '+960',
            mobilePhone: '9123891',
            telegramTag: '@rimsha_explorer',
            instagramHandle: '@rimsha.adventures',
            email: 'rimsha.scout@gmail.com',
          },
          emergencyContact: {
            fullName: 'Mariyam Shifana',
            relationship: 'Parent',
            phone: '+960 9988776',
          },
          account: {
            username: 'rimsha.exp',
            password: 'password123',
          },
          policyRatified: true,
        }
      ];
      localStorage.setItem(MEMBER_APPS_KEY, JSON.stringify(sampleApps));
      return sampleApps;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveMemberApplications(apps: MemberApplication[]): void {
  localStorage.setItem(MEMBER_APPS_KEY, JSON.stringify(apps));
}

export function getStoredLeaderApplications(): LeaderApplication[] {
  try {
    const raw = localStorage.getItem(LEADER_APPS_KEY);
    if (!raw) {
      const sampleLeaders: LeaderApplication[] = [
        {
          id: 'ldr-01',
          applicationId: 'ldr-582910',
          status: 'Pending Verification',
          submittedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
          legalName: 'Mohamed Niyaz Ali',
          idCardNumber: 'A109283',
          ageYears: 29,
          dob: { year: 1997, month: 3, day: 12 },
          address: {
            country: 'Maldives',
            atollState: 'Kaafu Atoll',
            islandCity: "Male'",
            districtWard: 'Galolhu',
            streetLine: 'G. Green Garden, Boduthakurufaanu Magu',
          },
          mobileNumber: '+960 7794321',
          officialEmail: 'niyaz.ali@arabiyya.edu.mv',
          scoutingExperience: 'Former Senior Rover with Arabiyya Scouts (2015-2021). Assistant Scout Leader for 3rd Male Troop.',
          woodBadgeStatus: 'Wood Badge Part II (Section Leader Training Completed)',
          motivation: 'To mentor our next generation of Arabiyya Rovers and coordinate international disaster response training drills.',
        }
      ];
      localStorage.setItem(LEADER_APPS_KEY, JSON.stringify(sampleLeaders));
      return sampleLeaders;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveLeaderApplications(apps: LeaderApplication[]): void {
  localStorage.setItem(LEADER_APPS_KEY, JSON.stringify(apps));
}

// Submit Member Application
export function submitMemberApplication(appData: Omit<MemberApplication, 'id' | 'applicationId' | 'status' | 'submittedAt'>): MemberApplication {
  const applicationId = `mem-${Math.floor(100000 + Math.random() * 900000)}`;
  const newApp: MemberApplication = {
    ...appData,
    id: `app-${Date.now()}`,
    applicationId,
    status: 'Pending Verification',
    submittedAt: new Date().toISOString(),
  } as MemberApplication;

  const current = getStoredMemberApplications();
  const updated = [newApp, ...current];
  saveMemberApplications(updated);

  // Dispatch simulated council notification
  dispatchCouncilNotification({
    type: 'NEW_MEMBER_APPLICATION',
    applicationId,
    applicantName: appData.personal?.fullName || 'Applicant',
    section: appData.section,
    submittedAt: newApp.submittedAt,
  });

  return newApp;
}

// Submit Leader Track Application
export function submitLeaderApplication(leaderData: Omit<LeaderApplication, 'id' | 'applicationId' | 'status' | 'submittedAt'>): LeaderApplication {
  const applicationId = `ldr-${Math.floor(100000 + Math.random() * 900000)}`;
  const newLeaderApp: LeaderApplication = {
    ...leaderData,
    id: `ldr-${Date.now()}`,
    applicationId,
    status: 'Pending Verification',
    submittedAt: new Date().toISOString(),
  };

  const current = getStoredLeaderApplications();
  const updated = [newLeaderApp, ...current];
  saveLeaderApplications(updated);

  dispatchCouncilNotification({
    type: 'NEW_LEADER_APPLICATION',
    applicationId,
    applicantName: leaderData.legalName,
    section: 'Leader Track',
    submittedAt: newLeaderApp.submittedAt,
  });

  return newLeaderApp;
}

// Council Notifications
export function dispatchCouncilNotification(notif: any): void {
  try {
    const raw = localStorage.getItem(COUNCIL_NOTIFICATIONS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({ ...notif, id: `notif-${Date.now()}` });
    localStorage.setItem(COUNCIL_NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    // ignore
  }
}

// Council Decision: Approve Application and activate member
export function approveMemberApplication(
  applicationId: string, 
  investitureDate: string, 
  councilNotes: string,
  reviewerName: string = 'Arabiyya Rover Council'
): RoverMember | null {
  const apps = getStoredMemberApplications();
  const index = apps.findIndex(a => a.applicationId === applicationId);
  if (index === -1) return null;

  const app = apps[index];
  app.status = 'Approved';
  app.investitureDate = investitureDate;
  app.councilNotes = councilNotes;
  app.reviewedBy = reviewerName;
  app.reviewedAt = new Date().toISOString();
  apps[index] = app;
  saveMemberApplications(apps);

  // Convert to full active RoverMember
  const newMemberId = `ROV-${Math.floor(1000 + Math.random() * 9000)}`;
  const activeMember: RoverMember = {
    id: newMemberId,
    applicationId: app.applicationId,
    name: app.personal?.fullName || 'Rover Member',
    commonName: app.personal?.commonName || '',
    idCardNumber: app.personal?.idCardNumber || app.personal?.nationalId || '',
    nationalId: app.personal?.nationalId || app.personal?.idCardNumber || '',
    email: app.contacts?.email || '',
    username: app.account?.username || app.credentials?.username || '',
    password: app.account?.password || '',
    role: (app.section === 'Explorer Scout' || app.section === 'Explorer') ? 'Explorer Scout' : 'Rover Scout',
    crewId: 'CREW-01',
    crewName: 'Arabiyya Central Rover Crew',
    unitDistrict: "Al-Madhrasathul Arabiyyathul Islaamiyya (Unit 01)",
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    bio: `${app.section} enrolled in the Arabiyya Rover Network. Aspiring for the ${app.targetAward || 'Baden-Powell Award'}.`,
    phone: `${app.contacts?.dialCode || '+960'} ${app.contacts?.mobilePhone || app.contacts?.phone || ''}`,
    telegramTag: app.contacts?.telegramTag || '',
    instagramHandle: app.contacts?.instagramHandle || '',
    bloodGroup: 'O+',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    investitureDate,
    rankStage: (app.section === 'Explorer Scout' || app.section === 'Explorer') ? 'President Scout Candidate' : 'Rover Squire',
    section: app.section as any,
    totalServiceHours: 0,
    badgesCount: 1,
    emergencyContact: {
      name: app.emergencyContact?.fullName || app.emergencyContact?.name || 'Guardian',
      relation: app.emergencyContact?.relationship || app.emergencyContact?.relation || 'Parent',
      phone: app.emergencyContact?.phone || '',
    },
    skills: ['Campcraft', 'Scout Law Knowledge', 'First Aid', 'Pioneering'],
    badges: [
      {
        id: 'badge-init',
        name: app.currentBadgeLevel || app.standing?.currentBadgeLevel || 'Scout Standard',
        category: 'Skill',
        description: `Verified previous scout standing: ${app.currentBadgeLevel || app.standing?.currentBadgeLevel || 'Scout Standard'}.`,
        status: 'completed',
        dateEarned: new Date().toISOString().split('T')[0],
        progressPercent: 100,
      }
    ],
    recentActivities: [],
    status: 'Active',
  };

  const members = getStoredMembers();
  saveMembers([activeMember, ...members]);

  return activeMember;
}

// Council Decision: Reject Application
export function rejectMemberApplication(
  applicationId: string, 
  reason: string,
  reviewerName: string = 'Arabiyya Rover Council'
): boolean {
  const apps = getStoredMemberApplications();
  const index = apps.findIndex(a => a.applicationId === applicationId);
  if (index === -1) return false;

  apps[index].status = 'Rejected';
  apps[index].councilNotes = reason;
  apps[index].reviewedBy = reviewerName;
  apps[index].reviewedAt = new Date().toISOString();
  saveMemberApplications(apps);
  return true;
}
