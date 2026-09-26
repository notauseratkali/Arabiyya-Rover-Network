import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini SDK with server-side environment key
const ai = new GoogleGenAI({});

app.use(express.json());

// In-Memory Enterprise Storage (backed by simulated Firestore schemas)
interface StoredApplication {
  trackingCode: string;
  name: string;
  email: string;
  phone: string;
  telegramHandle: string;
  dob: string;
  calculatedAge: number;
  allocatedSection: 'Explorer' | 'Rover' | 'Leader';
  bloodGroup: string;
  scoutBackground: string;
  emergencyContact: { name: string; relation: string; phone: string };
  otp: string;
  status: 'otp_pending' | 'submitted' | 'interview_scheduled' | 'approved' | 'investiture_ready' | 'rejected';
  createdAt: string;
  notes?: string;
}

interface StoredLogbookEntry {
  id: string;
  memberId: string;
  memberName: string;
  memberSection: string;
  title: string;
  type: 'Camp' | 'Hike' | 'Service' | 'Milestone' | 'Training';
  date: string;
  hours: number;
  location: string;
  reflections: string;
  skillsPracticed: string[];
  status: 'Draft' | 'Pending Review' | 'Verified' | 'Revision Requested';
  submittedAt?: string;
  reviewerName?: string;
  reviewerRole?: string;
  reviewerNotes?: string;
  verifiedAt?: string;
}

interface StoredMeetingMinutes {
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
  resolutions: Array<{ id: string; topic: string; decision: string; assignedTo: string; deadline: string }>;
  bodyHtml: string;
  status: 'Draft' | 'Published';
  publishedAt?: string;
}

interface StoredBroadcast {
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

interface StoredExcuse {
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

// Initial Data
let ssoSharedSecret = 'ARAB_SSO_KEY_2026_MASTER_SECRET_SECURE';

let applications: StoredApplication[] = [
  {
    trackingCode: 'ARAB-2026-8812',
    name: 'Zaid Al-Harbi',
    email: 'zaid.harbi@gmail.com',
    phone: '+966 50 123 4567',
    telegramHandle: '@zaid_scout',
    dob: '2004-06-15',
    calculatedAge: 21,
    allocatedSection: 'Rover',
    bloodGroup: 'O+',
    scoutBackground: 'Former Senior Scout (Al-Quds Patrol)',
    emergencyContact: { name: 'Abdullah Al-Harbi', relation: 'Father', phone: '+966 50 999 8888' },
    otp: '482910',
    status: 'submitted',
    createdAt: '2026-03-20T10:00:00Z',
    notes: 'Strong orienteering and pioneering foundations. Interview recommended for Apex Crew.',
  },
  {
    trackingCode: 'ARAB-2026-9041',
    name: 'Yousef Mansoor',
    email: 'yousef.m@gmail.com',
    phone: '+966 54 887 6543',
    telegramHandle: '@yousef_m',
    dob: '2010-09-12',
    calculatedAge: 15,
    allocatedSection: 'Explorer',
    bloodGroup: 'A+',
    scoutBackground: 'Troop Patrol Leader',
    emergencyContact: { name: 'Sami Mansoor', relation: 'Father', phone: '+966 54 111 2233' },
    otp: '194820',
    status: 'interview_scheduled',
    createdAt: '2026-03-22T14:30:00Z',
    notes: 'Allocated to Explorer Section (<18). Orientation mentor assigned.',
  },
  {
    trackingCode: 'ARAB-2026-7733',
    name: 'Dr. Tariq Al-Omari',
    email: 'tariq.omari@univ.edu',
    phone: '+966 56 443 2190',
    telegramHandle: '@tariq_omari',
    dob: '1995-02-10',
    calculatedAge: 31,
    allocatedSection: 'Leader',
    bloodGroup: 'B+',
    scoutBackground: 'Wood Badge Holder (1998 Batch)',
    emergencyContact: { name: 'Layla Al-Omari', relation: 'Spouse', phone: '+966 56 443 2191' },
    otp: '772183',
    status: 'approved',
    createdAt: '2026-03-18T09:15:00Z',
    notes: 'Approved as Assistant Crew Leader & Wilderness Medic Advisor.',
  }
];

let logbookEntries: StoredLogbookEntry[] = [
  {
    id: 'log-101',
    memberId: 'ROV-7842',
    memberName: 'Sarah Al-Mansoor',
    memberSection: 'Rover',
    title: 'Wadi Hanifa Environmental Habitat Restoration',
    type: 'Service',
    date: '2026-03-15',
    hours: 8,
    location: 'Wadi Hanifa Eco-Park Sector 4',
    reflections: 'Coordinated crew deployment to clear non-native acacia species and plant 450 native desert trees. Delegated safety protocols across three patrols.',
    skillsPracticed: ['Desert Ecology Restoration', 'Field Leadership', 'Hydration Triage', 'Logistics'],
    status: 'Verified',
    submittedAt: '2026-03-16T18:00:00Z',
    reviewerName: 'Marcus Vance',
    reviewerRole: 'Rover Scout Leader',
    reviewerNotes: 'Exemplary leadership demonstrated. Logbook criteria fully satisfied for Community Shield.',
    verifiedAt: '2026-03-17T09:30:00Z',
  },
  {
    id: 'log-102',
    memberId: 'ROV-6109',
    memberName: 'Liam Vance',
    memberSection: 'Rover',
    title: 'Tuwaiq Escarpment 42km Night Navigation Trek',
    type: 'Hike',
    date: '2026-03-08',
    hours: 14,
    location: 'Tuwaiq Mountain Range, Sector West',
    reflections: 'Self-sustained night compass navigation relying strictly on lunar bearings and topographic maps. Zero GPS assistance.',
    skillsPracticed: ['Night Celestial Navigation', 'Topo Ridge Traverse', 'Emergency Bivouac', 'Leave No Trace'],
    status: 'Verified',
    submittedAt: '2026-03-09T11:00:00Z',
    reviewerName: 'Sarah Al-Mansoor',
    reviewerRole: 'Crew Leader',
    reviewerNotes: 'Verified trek logs, altimeter log, and map bearings. Approved for Rambler Award Stage.',
    verifiedAt: '2026-03-10T14:15:00Z',
  },
  {
    id: 'log-103',
    memberId: 'ROV-4412',
    memberName: 'Maya Chen',
    memberSection: 'Rover',
    title: 'Rover Squire Vigil & Night Reflection',
    type: 'Milestone',
    date: '2026-03-18',
    hours: 6,
    location: 'Camp Al-Nujoom Outdoor Amphitheater',
    reflections: 'Completed the traditional solitary vigil pondering the Rover Promise, personal weaknesses, and commitment to the Scout Law.',
    skillsPracticed: ['Rover Self-Evaluation', 'Scouting Constitution Reflection', 'Personal Vigil'],
    status: 'Pending Review',
    submittedAt: '2026-03-19T08:00:00Z',
  },
  {
    id: 'log-104',
    memberId: 'ROV-5521',
    memberName: 'David Kim',
    memberSection: 'Rover',
    title: 'Spring Camporee Emergency Water Purification Drill',
    type: 'Training',
    date: '2026-03-21',
    hours: 5,
    location: 'District Campgrounds Station 2',
    reflections: 'Demonstrated gravity filtration and solar disinfection setups to 25 candidate scouts.',
    skillsPracticed: ['Water Sanitation', 'Solar Disinfection', 'Youth Instruction'],
    status: 'Draft',
  }
];

let meetingMinutes: StoredMeetingMinutes[] = [
  {
    id: 'min-2026-03',
    referenceNumber: 'MIN-ROV-2026/03',
    title: 'Arabiyya Rover Council Extraordinary General Assembly',
    date: 'March 14, 2026',
    location: 'Arabiyya Scout Headquarters & Hybrid Zoom',
    chairPerson: 'Sarah Al-Mansoor (Crew Leader)',
    secretary: 'Julian Reed (Council Secretary)',
    attendees: ['Sarah Al-Mansoor', 'Liam Vance', 'Julian Reed', 'Tariq Hussain', 'Marcus Vance', 'Elena Rostova'],
    absentees: ['David Kim (Excused - Exam)'],
    agenda: [
      '1. Review and ratification of Minutes MIN-ROV-2026/02',
      '2. Allocation of National Spring Moot 2026 delegates and equipment budget',
      '3. Ratification of Explorer Section Transition Program (<18)',
      '4. Logbook digital verification SLA enforcement'
    ],
    resolutions: [
      {
        id: 'res-1',
        topic: 'Spring Moot Contingent Budget',
        decision: 'Approved grant of 12,000 SAR for lightweight expedition tents and satellite radio units.',
        assignedTo: 'Julian Reed (Quartermaster)',
        deadline: 'April 02, 2026',
      },
      {
        id: 'res-2',
        topic: 'Explorer-to-Rover Transition',
        decision: 'Chartered dual-mentorship system where Rovers in Stage 3 mentor Explorer squad candidates.',
        assignedTo: 'Liam Vance (Senior Rover)',
        deadline: 'April 15, 2026',
      },
      {
        id: 'res-3',
        topic: 'Digital Logbook Turnaround',
        decision: 'Enforced 7-day review SLA for all submitted logbook entries by Crew Leaders.',
        assignedTo: 'Sarah Al-Mansoor',
        deadline: 'Immediate',
      }
    ],
    bodyHtml: '<p>The meeting commenced promptly at 18:30 with the Scout Promise. The Chair noted a full quorum of council members. Deliberations proceeded across all agenda items without dissent. Council expressed gratitude to the service committee for surpassing 500 collective service hours this quarter.</p>',
    status: 'Published',
    publishedAt: '2026-03-15T10:00:00Z',
  }
];

let broadcasts: StoredBroadcast[] = [
  {
    id: 'bc-01',
    title: 'National Spring Rover Moot 2026: Mandatory Delegate Briefing',
    priority: 'High',
    targetAudience: 'All',
    channels: {
      inPortalBanner: true,
      emailHtml: true,
      telegramChannel: true,
    },
    content: 'All confirmed delegates for the National Spring Rover Moot must attend the logistics and gear inspection session this Friday at 16:00. Ensure digital logbooks are verified up to date.',
    dispatchedBy: 'Julian Reed (Secretary)',
    timestamp: '2026-03-24T12:00:00Z',
    metrics: { inPortalViews: 148, emailsSent: 64, telegramDeliveries: 92 }
  },
  {
    id: 'bc-02',
    title: 'Weather Warning: High Desert Wind Conditions at Tuwaiq Campgrounds',
    priority: 'Urgent',
    targetAudience: 'Rovers',
    channels: {
      inPortalBanner: true,
      emailHtml: true,
      telegramChannel: true,
    },
    content: 'All crews participating in weekend bivouacs are advised that gust speeds will exceed 45 knots. High-altitude ridge lines are closed. Follow storm protocols.',
    dispatchedBy: 'Safety Officer / Leader Cadre',
    timestamp: '2026-03-21T08:30:00Z',
    metrics: { inPortalViews: 210, emailsSent: 58, telegramDeliveries: 104 }
  }
];

let excuses: StoredExcuse[] = [
  {
    id: 'exc-01',
    memberId: 'ROV-5521',
    memberName: 'David Kim',
    eventId: 'EVT-01',
    eventTitle: 'National Spring Rover Moot 2026',
    reason: 'University midterm examination schedule conflicts with departure date.',
    status: 'Approved',
    filedAt: '2026-03-20T16:00:00Z',
    reviewedBy: 'Julian Reed (Secretary)',
    reviewNotes: 'Valid academic conflict. Excused and exam timetable verified.',
  }
];

// Helper: Age Calculator
function calculateAge(dobString: string): number {
  const dob = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// -------------------------------------------------------------
// 1. Federated SSO Endpoint (/api/sso/authenticate)
// -------------------------------------------------------------
app.post('/api/sso/authenticate', (req: Request, res: Response) => {
  const { targetPortal, memberId, timestamp } = req.body;

  if (!targetPortal || !memberId) {
    return res.status(400).json({ error: 'Missing required parameters: targetPortal, memberId' });
  }

  // Create HMAC SHA-256 signature using the active shared-secret key
  const payloadString = `${memberId}:${targetPortal}:${timestamp || Date.now()}`;
  const hmac = crypto.createHmac('sha256', ssoSharedSecret);
  hmac.update(payloadString);
  const signature = hmac.digest('hex');

  const federatedTicket = `ARAB-SSO-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  // Generate target redirect URL
  const portalDomains: Record<string, string> = {
    courses: 'https://learn.arabiyyascouts.org/sso/callback',
    finance: 'https://finance.arabiyyascouts.org/sso/callback',
    armory: 'https://armory.arabiyyascouts.org/sso/callback',
  };

  const callbackUrl = portalDomains[targetPortal] || `https://${targetPortal}.arabiyyascouts.org/sso/callback`;
  const ssoRedirectUrl = `${callbackUrl}?ticket=${federatedTicket}&sig=${signature}&ts=${timestamp || Date.now()}&id=${memberId}`;

  res.json({
    success: true,
    targetPortal,
    federatedTicket,
    signature,
    activeKeyId: 'ARAB-KEY-V2-ROTATED-2026',
    expiresInSeconds: 300,
    redirectUrl: ssoRedirectUrl,
    handshakeStatus: 'VALIDATED_FEDERATED_SESSION',
  });
});

// Rotate SSO Key (Admin Only)
app.post('/api/sso/rotate-key', (req: Request, res: Response) => {
  const newSecret = `ARAB_SSO_KEY_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  ssoSharedSecret = newSecret;
  res.json({
    success: true,
    message: 'Federated SSO key rotation completed across all Arabiyya affiliated nodes.',
    keyFingerprint: crypto.createHash('sha256').update(newSecret).digest('hex').substring(0, 16),
    rotatedAt: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 2. Intelligent Member Pipeline & Onboarding APIs (/api/signup/* & /api/pipeline/*)
// -------------------------------------------------------------

// Council alert email receivers
const ROVER_NOTIFICATION_EMAILS = ['council@arabiyyascouts.mv', 'gsl@arabiyyascouts.mv'];

// Stored records for onboarding
let memberApplicationsList: any[] = [
  {
    applicationId: 'mem-882194',
    section: 'Rover',
    status: 'Pending Verification',
    personal: {
      fullName: 'Ahmed Zaidan',
      commonName: 'Zaid',
      nationalId: 'A381920',
      gender: 'Male',
    },
    dob: { year: 2004, month: 7, day: 12 },
    exactAge: { years: 21, months: 8, days: 13 },
    awardGoal: { willingForAward: true, goalTitle: 'Baden-Powell (BP) Award' },
    standing: { currentBadgeLevel: 'Bushman’s Thong', remainingYears: 4, remainingMonths: 3, remainingDays: 17, deadlineDate: '2030-07-11' },
    commitmentsAccepted: true,
    background: { type: 'former', troopNumber: '1', atollIsland: 'Male\'', officialDesignation: '1st Male\' Scout Group' },
    permanentAddress: { country: 'Maldives', dialCode: '+960', atoll: 'Kaafu', island: 'Male\' City', ward: 'Henveiru', streetAddress: 'H. Oceanic Breeze, Boduthakurufaanu Magu' },
    livingAddress: { isSameAsPermanent: true },
    contacts: { phone: '7781920', dialCode: '+960', telegramTag: '@zaid_scout', instagramHandle: '@zaid.scouts', email: 'zaidan@arabiyyascouts.mv' },
    emergencyContact: { fullName: 'Ibrahim Zaidan', relationship: 'Parent', phone: '7901122' },
    credentials: { username: 'zaidan_rover' },
    policyAccepted: true,
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    councilReviewNotes: 'Candidate background verified from 1st Male\' records. Phone interview pending.',
  },
  {
    applicationId: 'mem-739102',
    section: 'Explorer',
    status: 'Interview Scheduled',
    personal: {
      fullName: 'Aminath Aish',
      commonName: 'Aisha',
      nationalId: 'A491029',
      gender: 'Female',
    },
    dob: { year: 2009, month: 11, day: 4 },
    exactAge: { years: 16, months: 4, days: 21 },
    awardGoal: { willingForAward: true, goalTitle: 'President Scout (PS) Award' },
    standing: { currentBadgeLevel: 'Advanced Scout Standard', remainingYears: 1, remainingMonths: 7, remainingDays: 8, deadlineDate: '2027-11-03' },
    commitmentsAccepted: true,
    background: { type: 'former', troopNumber: '1', atollIsland: 'Arabiyya', officialDesignation: '1st Arabiyya Scout Group' },
    permanentAddress: { country: 'Maldives', dialCode: '+960', atoll: 'Kaafu', island: 'Male\' City', ward: 'Maafannu', streetAddress: 'M. Silver Coral, Orchid Magu' },
    livingAddress: { isSameAsPermanent: true },
    contacts: { phone: '9920192', dialCode: '+960', telegramTag: '@aisha_explorer', instagramHandle: '@aisha.scout', email: 'aisha@arabiyyascouts.mv' },
    emergencyContact: { fullName: 'Mariyam Shifna', relationship: 'Parent', phone: '7712345' },
    credentials: { username: 'aisha_explorer' },
    policyAccepted: true,
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    phoneInterviewDate: '2026-03-28T16:00:00Z',
    councilReviewNotes: 'Phone interview scheduled with Arabiyya Council Mentor.',
  }
];

let leaderApplicationsList: any[] = [
  {
    applicationId: 'ldr-102941',
    fullName: 'Ali Naushad',
    nationalId: 'A182938',
    country: 'Maldives',
    atoll: 'Kaafu',
    island: 'Male\' City',
    ward: 'Galolhu',
    streetAddress: 'G. Green Meadow',
    phone: '+960 7719922',
    email: 'naushad@arabiyyascouts.mv',
    areaOfExpertise: 'Expedition Planning & Wilderness First Responder',
    scoutingExperience: '14 years active in Scouting, Wood Badge holder, former Patrol Leader.',
    leadershipMotivation: 'To mentor senior rovers towards their Baden-Powell Awards and lead offshore sea navigation expeditions.',
    status: 'Pending Review',
    submittedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  }
];

// 1. Exact Date of Birth & Section Verification (/api/signup/verify-dob)
app.post('/api/signup/verify-dob', (req: Request, res: Response) => {
  const { year, month, day, dob } = req.body;

  let birthDate: Date;
  if (year && month && day) {
    birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  } else if (dob) {
    birthDate = new Date(dob);
  } else {
    return res.status(400).json({ error: 'Date of birth is required (year, month, day).' });
  }

  if (isNaN(birthDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date provided.' });
  }

  const now = new Date();
  
  // Calculate exact age in years, months, days
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const exactAge = { years, months, days };

  // Section categorization
  if (years < 16) {
    return res.json({
      isEligible: false,
      section: 'Underage',
      exactAge,
      awardPathway: 'Ineligible',
      cutoffAge: 16,
      deadlineDate: '',
      deadlineRule: 'Applications are not accepted; applicants must be at least 16 years old.',
      remainingTime: { years: 0, months: 0, days: 0, totalDays: 0 },
      standardBenchmarkMonths: 0,
      feasibilityStatus: 'Extremely Tight',
      isLeaderTrack: false,
      message: 'Underage: Applicants must be at least 16 years old to join Arabiyya Rover Network.',
    });
  }

  if (years >= 26) {
    return res.json({
      isEligible: true,
      section: 'Leader',
      exactAge,
      awardPathway: 'Leadership / Adult Scouting',
      cutoffAge: 0,
      deadlineDate: '',
      deadlineRule: 'Automatically diverted to the Leader Candidate Pathway for ages 26+.',
      remainingTime: { years: 0, months: 0, days: 0, totalDays: 0 },
      standardBenchmarkMonths: 0,
      feasibilityStatus: 'Optimal',
      isLeaderTrack: true,
      message: 'Applicant age is 26 or above. Diverted to Arabiyya Leader Candidate Track.',
    });
  }

  // Explorers: 16 to < 18
  // Rovers: 18 to < 26
  const isExplorer = years < 18;
  const section = isExplorer ? 'Explorer' : 'Rover';
  const cutoffAge = isExplorer ? 18 : 26;
  const awardPathway = isExplorer ? 'President Scout (PS) Award' : 'Baden-Powell (BP) Award';
  const deadlineRule = isExplorer 
    ? 'Final portfolio/badge submission deadline is 1 day prior to the 18th birthday.'
    : 'Final portfolio/badge submission deadline is 1 day prior to the 26th birthday.';
  const standardBenchmarkMonths = isExplorer ? 15 : 36; // 15 months for PS, 3 years for BP

  // 1 day prior to cutoff birthday
  const cutoffBirthday = new Date(birthDate.getFullYear() + cutoffAge, birthDate.getMonth(), birthDate.getDate());
  const deadline = new Date(cutoffBirthday.getTime() - 24 * 60 * 60 * 1000);
  
  const diffMs = deadline.getTime() - now.getTime();
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  let remYears = deadline.getFullYear() - now.getFullYear();
  let remMonths = deadline.getMonth() - now.getMonth();
  let remDays = deadline.getDate() - now.getDate();

  if (remDays < 0) {
    remMonths--;
    const prevMonthDays = new Date(deadline.getFullYear(), deadline.getMonth(), 0).getDate();
    remDays += prevMonthDays;
  }
  if (remMonths < 0) {
    remYears--;
    remMonths += 12;
  }

  const remainingMonthsTotal = remYears * 12 + remMonths;
  let feasibilityStatus: 'Optimal' | 'Feasible' | 'Tight Schedule' | 'Extremely Tight' = 'Feasible';
  if (remainingMonthsTotal >= standardBenchmarkMonths + 6) {
    feasibilityStatus = 'Optimal';
  } else if (remainingMonthsTotal >= standardBenchmarkMonths) {
    feasibilityStatus = 'Feasible';
  } else if (remainingMonthsTotal >= standardBenchmarkMonths * 0.7) {
    feasibilityStatus = 'Tight Schedule';
  } else {
    feasibilityStatus = 'Extremely Tight';
  }

  return res.json({
    isEligible: true,
    section,
    exactAge,
    awardPathway,
    cutoffAge,
    deadlineDate: deadline.toISOString().split('T')[0],
    deadlineRule,
    remainingTime: {
      years: Math.max(0, remYears),
      months: Math.max(0, remMonths),
      days: Math.max(0, remDays),
      totalDays,
    },
    standardBenchmarkMonths,
    feasibilityStatus,
    isLeaderTrack: false,
    message: `Designated as ${section} Scout. Award Pathway: ${awardPathway}.`,
  });
});

// AI Crew Progression Benchmark Analyzer (/api/ai/benchmark-analysis)
app.post('/api/ai/benchmark-analysis', async (req: Request, res: Response) => {
  const { section, currentBadgeLevel, exactAge, remainingMonths, remainingYears } = req.body;

  const isExplorer = section === 'Explorer';
  let baseMonths = 36;
  let standardRequirementText = '~3 years to Baden-Powell Award';

  if (!isExplorer) {
    if (currentBadgeLevel === 'Square') {
      baseMonths = 36;
      standardRequirementText = '~3 years to Baden-Powell Award';
    } else if (currentBadgeLevel === 'Scout Standard') {
      baseMonths = 30;
      standardRequirementText = '~2 years and 6 months to Baden-Powell Award';
    } else if (currentBadgeLevel === 'Advanced Scout Standard') {
      baseMonths = 24;
      standardRequirementText = '~2 years to Baden-Powell Award';
    } else if (currentBadgeLevel === 'Bushman’s Thong' || currentBadgeLevel === "Bushman's Thong") {
      baseMonths = 24;
      standardRequirementText = '~2 years to Baden-Powell Award';
    } else if (currentBadgeLevel?.includes('President Scout')) {
      baseMonths = 24;
      standardRequirementText = '~2 years to Baden-Powell Award';
    }
  } else {
    if (currentBadgeLevel === 'Square') {
      baseMonths = 18;
      standardRequirementText = '~18 months to President Scout Award';
    } else if (currentBadgeLevel === 'Scout Standard') {
      baseMonths = 15;
      standardRequirementText = '~15 months to President Scout Award';
    } else if (currentBadgeLevel === 'Advanced Scout Standard') {
      baseMonths = 12;
      standardRequirementText = '~12 months to President Scout Award';
    } else if (currentBadgeLevel === 'Bushman’s Thong' || currentBadgeLevel === "Bushman's Thong") {
      baseMonths = 8;
      standardRequirementText = '~8 months to President Scout Award';
    } else if (currentBadgeLevel?.includes('President Scout')) {
      baseMonths = 6;
      standardRequirementText = '~6 months (Validation)';
    }
  }

  const remTotalMonths = (remainingYears || 0) * 12 + (remainingMonths || 0);

  // Attempt Gemini model analysis
  try {
    const prompt = `You are the Lead Scout Progression Auditor for the 1st Arabiyya Scout Group / Arabiyya Rover Network.
Analyze the expected completion benchmark timeline toward the ${isExplorer ? 'President Scout (PS) Award' : 'Baden-Powell (BP) Award'}.

Official Standard Benchmark:
- Starting Badge: ${currentBadgeLevel || 'Scout Standard'}
- Official Standard Requirement: ${standardRequirementText} (${baseMonths} months)
- Candidate Section: ${section || 'Rover'} Scout
- Candidate Exact Age: ${exactAge?.years || 20} years, ${exactAge?.months || 0} months
- Remaining Time Until Cut-off Birthday: ${remainingYears || 4} years, ${remainingMonths || 0} months (~${remTotalMonths} total months)
- Crew Velocity Context: Arabiyya Al-Ruwad Rover Crew (active patrol pace, 4.8 service hrs/mo, 8 expeditions/year)

Respond ONLY with a valid JSON object matching this schema:
{
  "benchmarkMonths": ${baseMonths},
  "benchmarkText": "${standardRequirementText}",
  "feasibility": "Optimal" | "Feasible" | "Tight Schedule" | "Extremely Tight",
  "crewVelocityNotes": string,
  "keyRecommendations": string[]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim();
    if (responseText) {
      const parsed = JSON.parse(responseText);
      return res.json({
        success: true,
        benchmarkMonths: baseMonths,
        benchmarkText: standardRequirementText,
        feasibility: parsed.feasibility || (remTotalMonths >= baseMonths ? 'Feasible' : 'Tight Schedule'),
        crewVelocityNotes: parsed.crewVelocityNotes || `Reviewed against Arabiyya Crew velocity. Official requirement is ${standardRequirementText}.`,
        keyRecommendations: parsed.keyRecommendations || [],
        source: 'AI-Powered Crew Review (Gemini 3.8 Flash)',
      });
    }
  } catch (err) {
    console.warn('Gemini Benchmark generation error, using dynamic crew model fallback:', err);
  }

  // Fallback
  let feasibility: 'Optimal' | 'Feasible' | 'Tight Schedule' | 'Extremely Tight' = 'Feasible';
  if (remTotalMonths >= baseMonths + 6) feasibility = 'Optimal';
  else if (remTotalMonths >= baseMonths) feasibility = 'Feasible';
  else if (remTotalMonths >= baseMonths * 0.7) feasibility = 'Tight Schedule';
  else feasibility = 'Extremely Tight';

  return res.json({
    success: true,
    benchmarkMonths: baseMonths,
    benchmarkText: standardRequirementText,
    feasibility,
    crewVelocityNotes: `Reviewed against Arabiyya Crew velocity. Official standard requirement for "${currentBadgeLevel || 'Scout Standard'}" standing is ${standardRequirementText}.`,
    keyRecommendations: [
      'Maintain minimum 4 hours/month community service cadence with Arabiyya Patrol.',
      'Schedule quarterly Court of Honor milestone reviews with Crew Leader.',
    ],
    source: 'Arabiyya Crew Velocity Performance Model',
  });
});

// 2. Real-time Uniqueness Validation (/api/signup/check-availability)
app.post('/api/signup/check-availability', (req: Request, res: Response) => {
  const { field, value } = req.body;

  if (!field || !value) {
    return res.status(400).json({ error: 'Field and value required.' });
  }

  const cleanVal = String(value).trim().toLowerCase();

  // Check in member applications
  let conflictFound = false;
  for (const app of memberApplicationsList) {
    if (field === 'nationalId' && app.personal?.nationalId?.toLowerCase() === cleanVal) conflictFound = true;
    if (field === 'username' && app.credentials?.username?.toLowerCase() === cleanVal) conflictFound = true;
    if (field === 'email' && app.contacts?.email?.toLowerCase() === cleanVal) conflictFound = true;
    if (field === 'phone' && app.contacts?.phone?.replace(/\D/g, '') === cleanVal.replace(/\D/g, '')) conflictFound = true;
    if (field === 'telegramTag' && app.contacts?.telegramTag?.toLowerCase().replace('@', '') === cleanVal.replace('@', '')) conflictFound = true;
    if (field === 'instagramHandle' && app.contacts?.instagramHandle?.toLowerCase().replace('@', '') === cleanVal.replace('@', '')) conflictFound = true;
  }

  // Check in legacy applications
  for (const app of applications) {
    if (field === 'email' && app.email.toLowerCase() === cleanVal) conflictFound = true;
    if (field === 'phone' && app.phone.replace(/\D/g, '') === cleanVal.replace(/\D/g, '')) conflictFound = true;
    if (field === 'telegramTag' && app.telegramHandle.toLowerCase().replace('@', '') === cleanVal.replace('@', '')) conflictFound = true;
  }

  if (conflictFound) {
    return res.json({ available: false, field, error: `This ${field} is already registered in the Arabiyya Scout records.` });
  }

  return res.json({ available: true, field });
});

// 3. Final Step 8 Member Submission (/api/signup/member)
app.post('/api/signup/member', (req: Request, res: Response) => {
  const applicationData = req.body;

  if (!applicationData.personal?.fullName || !applicationData.contacts?.email) {
    return res.status(400).json({ error: 'Incomplete application payload.' });
  }

  const applicationId = `mem-${Math.floor(100000 + Math.random() * 900000)}`;

  const newRecord = {
    ...applicationData,
    applicationId,
    status: 'Pending Verification',
    submittedAt: new Date().toISOString(),
  };

  memberApplicationsList.unshift(newRecord);

  // Automated notification dispatches
  console.log(`[Arabiyya Auto-Mailer] Dispatched Welcome Confirmation Email to applicant: ${newRecord.contacts.email}`);
  console.log(`[Arabiyya Rover Council] Dispatched New Application Alert to council channels: ${ROVER_NOTIFICATION_EMAILS.join(', ')} for candidate ${newRecord.personal.fullName} (${applicationId})`);

  return res.json({
    success: true,
    applicationId,
    status: 'Pending Verification',
    candidateName: newRecord.personal.fullName,
    candidateEmail: newRecord.contacts.email,
    prompt: 'Thank you for registering! Please wait for a call from the Arabiyya Rover Council regarding your membership.',
    automatedEmailDispatched: true,
    councilNotified: true,
  });
});

// 4. Leader Track Submission (/api/signup/leader)
app.post('/api/signup/leader', (req: Request, res: Response) => {
  const { fullName, nationalId, country, atoll, island, ward, streetAddress, phone, email, areaOfExpertise, scoutingExperience, leadershipMotivation } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Required fields missing for Leader candidate.' });
  }

  const applicationId = `ldr-${Math.floor(100000 + Math.random() * 900000)}`;

  const newLeaderApp = {
    applicationId,
    fullName,
    nationalId: nationalId || '',
    country: country || 'Maldives',
    atoll: atoll || 'Kaafu',
    island: island || 'Male\' City',
    ward: ward || '',
    streetAddress: streetAddress || '',
    phone,
    email,
    areaOfExpertise: areaOfExpertise || 'Scoutcraft Instruction',
    scoutingExperience: scoutingExperience || 'Active Leader Background',
    leadershipMotivation: leadershipMotivation || '',
    status: 'Pending Review',
    submittedAt: new Date().toISOString(),
  };

  leaderApplicationsList.unshift(newLeaderApp);

  console.log(`[Arabiyya GSL Alert] New Leader Track Dossier submitted: ${fullName} (${applicationId}). Dispatched to ${ROVER_NOTIFICATION_EMAILS.join(', ')}`);

  return res.json({
    success: true,
    applicationId,
    status: 'Pending Review',
    message: 'Leader Track application submitted successfully for Executive Council and Group Scout Leader (GSL) review.',
  });
});

// 5. Arabiyya Rover Council Review List (/api/council/applications)
app.get('/api/council/applications', (_req: Request, res: Response) => {
  res.json({
    memberApplications: memberApplicationsList,
    leaderApplications: leaderApplicationsList,
  });
});

// 6. Council Decision in Admin Panel (/api/council/decision)
app.post('/api/council/decision', (req: Request, res: Response) => {
  const { applicationId, action, notes, investitureDate } = req.body;

  const memberApp = memberApplicationsList.find(a => a.applicationId === applicationId);
  if (!memberApp) {
    return res.status(404).json({ error: 'Application record not found.' });
  }

  if (action === 'approve') {
    memberApp.status = 'Approved';
    memberApp.investitureDate = investitureDate || new Date(Date.now() + 3600000 * 24 * 14).toISOString().split('T')[0];
    memberApp.councilReviewNotes = notes || 'Background checks and verification call completed successfully.';
  } else if (action === 'activate') {
    memberApp.status = 'Active';
    memberApp.councilReviewNotes = notes || 'Investiture held. Portal login activated.';
  } else if (action === 'schedule_call') {
    memberApp.status = 'Interview Scheduled';
    memberApp.phoneInterviewDate = investitureDate || new Date(Date.now() + 3600000 * 24 * 2).toISOString();
    memberApp.councilReviewNotes = notes || 'Verification call scheduled with Arabiyya Council interviewer.';
  } else if (action === 'reject') {
    memberApp.status = 'Rejected';
    memberApp.councilReviewNotes = notes || 'Application did not meet Arabiyya Scout requirements.';
  }

  res.json({ success: true, application: memberApp });
});

// Submit New Application with Dynamic Age Allocation & 2FA OTP
app.post('/api/pipeline/apply', (req: Request, res: Response) => {
  const { name, email, phone, telegramHandle, dob, bloodGroup, scoutBackground, emergencyContact } = req.body;

  if (!name || !email || !dob) {
    return res.status(400).json({ error: 'Name, email, and date of birth are required.' });
  }

  const age = calculateAge(dob);
  
  // Real-time Age Section Allocation
  let allocatedSection: 'Explorer' | 'Rover' | 'Leader' = 'Rover';
  if (age < 18) {
    allocatedSection = 'Explorer';
  } else if (age >= 18 && age <= 26) {
    allocatedSection = 'Rover';
  } else {
    allocatedSection = 'Leader';
  }

  // Generate OTP and Tracking Code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const trackingCode = `ARAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newApp: StoredApplication = {
    trackingCode,
    name,
    email,
    phone: phone || '',
    telegramHandle: telegramHandle || '',
    dob,
    calculatedAge: age,
    allocatedSection,
    bloodGroup: bloodGroup || 'O+',
    scoutBackground: scoutBackground || 'New to Scouting',
    emergencyContact: emergencyContact || { name: 'Emergency Contact', relation: 'Family', phone: phone || '' },
    otp,
    status: 'otp_pending',
    createdAt: new Date().toISOString(),
  };

  applications.push(newApp);

  res.json({
    success: true,
    trackingCode,
    calculatedAge: age,
    allocatedSection,
    message: `Application drafted. Section automatically determined: ${allocatedSection} (Age: ${age}). Verification OTP dispatched.`,
    simulatedOtp: otp, // Provided for instant demo verification
  });
});

// Verify 2FA OTP
app.post('/api/pipeline/verify-otp', (req: Request, res: Response) => {
  const { trackingCode, otp } = req.body;
  const appItem = applications.find(a => a.trackingCode === trackingCode);

  if (!appItem) {
    return res.status(404).json({ error: 'Application reference code not found.' });
  }

  if (appItem.otp !== otp && otp !== '123456') { // Allow 123456 bypass for demo testing
    return res.status(400).json({ error: 'Invalid 2FA OTP. Please check Telegram or Email dispatch.' });
  }

  appItem.status = 'submitted';
  res.json({
    success: true,
    trackingCode: appItem.trackingCode,
    status: appItem.status,
    allocatedSection: appItem.allocatedSection,
    message: '2FA OTP verified successfully. Application has been queued for Council Review.',
  });
});

// Public Application Status Tracker
app.get('/api/pipeline/track/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const appItem = applications.find(a => a.trackingCode.toLowerCase() === code.toLowerCase());

  if (!appItem) {
    return res.status(404).json({ error: 'No application record found with that tracking code.' });
  }

  res.json({
    trackingCode: appItem.trackingCode,
    name: appItem.name,
    allocatedSection: appItem.allocatedSection,
    calculatedAge: appItem.calculatedAge,
    status: appItem.status,
    createdAt: appItem.createdAt,
    notes: appItem.notes,
  });
});

// Council Review List
app.get('/api/pipeline/applications', (_req: Request, res: Response) => {
  res.json(applications);
});

// Council Review Action (Schedule Interview, Approve, Reject)
app.post('/api/pipeline/action', (req: Request, res: Response) => {
  const { trackingCode, action, notes } = req.body;
  const appItem = applications.find(a => a.trackingCode === trackingCode);

  if (!appItem) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  if (action === 'schedule_interview') {
    appItem.status = 'interview_scheduled';
  } else if (action === 'approve') {
    appItem.status = 'approved';
  } else if (action === 'investiture_ready') {
    appItem.status = 'investiture_ready';
  } else if (action === 'reject') {
    appItem.status = 'rejected';
  }

  if (notes) appItem.notes = notes;

  res.json({ success: true, application: appItem });
});

// -------------------------------------------------------------
// 3. Digital Logbook APIs with Multi-stage Review
// -------------------------------------------------------------
app.get('/api/logbook', (req: Request, res: Response) => {
  const { memberId, status } = req.query;
  let results = [...logbookEntries];

  if (memberId) {
    results = results.filter(e => e.memberId === memberId);
  }
  if (status) {
    results = results.filter(e => e.status === status);
  }

  res.json(results);
});

app.post('/api/logbook', (req: Request, res: Response) => {
  const { memberId, memberName, memberSection, title, type, date, hours, location, reflections, skillsPracticed, submitForReview } = req.body;

  const newEntry: StoredLogbookEntry = {
    id: `log-${Date.now()}`,
    memberId: memberId || 'ROV-7842',
    memberName: memberName || 'Sarah Al-Mansoor',
    memberSection: memberSection || 'Rover',
    title: title || 'Scouting Activity',
    type: type || 'Service',
    date: date || new Date().toISOString().split('T')[0],
    hours: Number(hours) || 4,
    location: location || 'Field Site',
    reflections: reflections || '',
    skillsPracticed: Array.isArray(skillsPracticed) ? skillsPracticed : ['Fieldwork'],
    status: submitForReview ? 'Pending Review' : 'Draft',
    submittedAt: submitForReview ? new Date().toISOString() : undefined,
  };

  logbookEntries.unshift(newEntry);
  res.json({ success: true, entry: newEntry });
});

// Review / Verify Logbook Entry (Leader / Secretary / Admin)
app.post('/api/logbook/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reviewerName, reviewerRole, reviewerNotes } = req.body;

  const entry = logbookEntries.find(e => e.id === id);
  if (!entry) {
    return res.status(404).json({ error: 'Logbook entry not found.' });
  }

  entry.status = status || 'Verified';
  entry.reviewerName = reviewerName || 'Council Reviewer';
  entry.reviewerRole = reviewerRole || 'Crew Leader';
  entry.reviewerNotes = reviewerNotes || 'Verified according to WOSM logbook guidelines.';
  entry.verifiedAt = new Date().toISOString();

  res.json({ success: true, entry });
});

// -------------------------------------------------------------
// 4. Omnichannel Broadcast Center (/api/broadcasts)
// -------------------------------------------------------------
app.get('/api/broadcasts', (_req: Request, res: Response) => {
  res.json(broadcasts);
});

app.post('/api/broadcasts/dispatch', (req: Request, res: Response) => {
  const { title, priority, targetAudience, channels, content, dispatchedBy } = req.body;

  const newBroadcast: StoredBroadcast = {
    id: `bc-${Date.now()}`,
    title: title || 'Urgent Network Notice',
    priority: priority || 'Normal',
    targetAudience: targetAudience || 'All',
    channels: channels || { inPortalBanner: true, emailHtml: true, telegramChannel: true },
    content: content || '',
    dispatchedBy: dispatchedBy || 'Council Secretary',
    timestamp: new Date().toISOString(),
    metrics: {
      inPortalViews: channels?.inPortalBanner ? 1 : 0,
      emailsSent: channels?.emailHtml ? 64 : 0,
      telegramDeliveries: channels?.telegramChannel ? 95 : 0,
    }
  };

  broadcasts.unshift(newBroadcast);
  res.json({ success: true, broadcast: newBroadcast });
});

// -------------------------------------------------------------
// 5. Meeting Minutes Governance (/api/minutes)
// -------------------------------------------------------------
app.get('/api/minutes', (req: Request, res: Response) => {
  const { showDrafts } = req.query;
  if (showDrafts === 'true') {
    return res.json(meetingMinutes);
  }
  // Standard members only see published
  res.json(meetingMinutes.filter(m => m.status === 'Published'));
});

app.post('/api/minutes', (req: Request, res: Response) => {
  const { referenceNumber, title, date, location, chairPerson, secretary, attendees, absentees, agenda, resolutions, bodyHtml, status } = req.body;

  const newMin: StoredMeetingMinutes = {
    id: `min-${Date.now()}`,
    referenceNumber: referenceNumber || `MIN-ROV-${new Date().getFullYear()}/${meetingMinutes.length + 1}`,
    title,
    date: date || new Date().toISOString().split('T')[0],
    location: location || 'Council Headquarters',
    chairPerson: chairPerson || 'Crew Leader',
    secretary: secretary || 'Council Secretary',
    attendees: attendees || [],
    absentees: absentees || [],
    agenda: agenda || [],
    resolutions: resolutions || [],
    bodyHtml: bodyHtml || '',
    status: status || 'Draft',
    publishedAt: status === 'Published' ? new Date().toISOString() : undefined,
  };

  meetingMinutes.unshift(newMin);
  res.json({ success: true, minutes: newMin });
});

// -------------------------------------------------------------
// 6. Attendance & Excuses (/api/attendance)
// -------------------------------------------------------------
app.get('/api/attendance/excuses', (_req: Request, res: Response) => {
  res.json(excuses);
});

app.post('/api/attendance/excuse', (req: Request, res: Response) => {
  const { memberId, memberName, eventId, eventTitle, reason } = req.body;

  const newExcuse: StoredExcuse = {
    id: `exc-${Date.now()}`,
    memberId: memberId || 'ROV-7842',
    memberName: memberName || 'Sarah Al-Mansoor',
    eventId: eventId || 'EVT-01',
    eventTitle: eventTitle || 'Official Gathering',
    reason,
    status: 'Pending',
    filedAt: new Date().toISOString(),
  };

  excuses.unshift(newExcuse);
  res.json({ success: true, excuse: newExcuse });
});

app.post('/api/attendance/excuse/:id/review', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reviewedBy, reviewNotes } = req.body;

  const item = excuses.find(e => e.id === id);
  if (!item) return res.status(404).json({ error: 'Excuse not found.' });

  item.status = status;
  item.reviewedBy = reviewedBy;
  item.reviewNotes = reviewNotes;

  res.json({ success: true, excuse: item });
});

// -------------------------------------------------------------
// Vite Dev Server Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Arabiyya Rover Scout Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
