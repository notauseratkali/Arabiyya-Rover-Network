import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Calendar, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Check, 
  Sparkles, 
  BookOpen, 
  ShieldAlert,
  PhoneCall,
  Loader2,
  Briefcase,
  Users
} from 'lucide-react';
import { RoverMember, RoverCrew, ActiveTab, DobVerificationResponse, ExactAge } from '../types';
import { PresidentScoutCelebrationModal } from '../components/PresidentScoutCelebrationModal';
import { OperatingPolicyModal } from '../components/OperatingPolicyModal';

interface SignUpPageProps {
  crews: RoverCrew[];
  onSignUpSuccess: (newMember: RoverMember) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

const MALDIVES_ATOLLS_LIST = [
  { code: "Male'", label: "Male' / Capital City" },
  { code: "Hulhumale'", label: "Hulhumale'" },
  { code: "Vilimale'", label: "Vilimale'" },
  { code: 'HA.', label: 'HA. (Haa Alif)' },
  { code: 'HDh.', label: 'HDh. (Haa Dhaalu)' },
  { code: 'Sh.', label: 'Sh. (Shaviyani)' },
  { code: 'N.', label: 'N. (Noonu)' },
  { code: 'R.', label: 'R. (Raa)' },
  { code: 'B.', label: 'B. (Baa)' },
  { code: 'Lh.', label: 'Lh. (Lhaviyani)' },
  { code: 'K.', label: 'K. (Kaafu)' },
  { code: 'AA.', label: 'AA. (Alif Alif)' },
  { code: 'ADh.', label: 'ADh. (Alif Dhaalu)' },
  { code: 'V.', label: 'V. (Vaavu)' },
  { code: 'M.', label: 'M. (Meemu)' },
  { code: 'F.', label: 'F. (Faafu)' },
  { code: 'Dh.', label: 'Dh. (Dhaalu)' },
  { code: 'Th.', label: 'Th. (Thaa)' },
  { code: 'L.', label: 'L. (Laamu)' },
  { code: 'GA.', label: 'GA. (Gaafu Alif)' },
  { code: 'GDh.', label: 'GDh. (Gaafu Dhaalu)' },
  { code: 'Gn.', label: 'Gn. (Gnaviyani / Fuvahmulah)' },
  { code: 'S.', label: 'S. (Seenu / Addu)' },
  { code: 'Arabiyya', label: 'Al-Madhrasathul Arabiyyathul Islamiyya' },
  { code: 'Other', label: 'Other / International / School Unit' },
];

// Helper: Instant Local DOB Calculation
function computeDobFramework(y: number, m: number, d: number): DobVerificationResponse {
  const birthDate = new Date(y, m - 1, d);
  const now = new Date();
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

  const exactAge: ExactAge = { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
  const isExplorer = years >= 16 && years < 18;
  const isRover = years >= 18 && years < 26;
  const isLeader = years >= 26;
  const isUnderage = years < 16;

  const section = isUnderage ? 'Underage' : isExplorer ? 'Explorer' : isRover ? 'Rover' : 'Leader';
  const cutoffAge = isExplorer ? 18 : 26;
  const awardPathway = isExplorer 
    ? 'President Scout (PS) Award' 
    : isRover 
    ? 'Baden-Powell (BP) Award' 
    : isLeader 
    ? 'Leadership / Adult Scouting' 
    : 'Ineligible';

  const cutoffBirthday = new Date(birthDate.getFullYear() + cutoffAge, birthDate.getMonth(), birthDate.getDate());
  const deadline = new Date(cutoffBirthday.getTime() - 24 * 60 * 60 * 1000);

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
  const standardBenchmarkMonths = isExplorer ? 15 : 36;
  let feasibilityStatus: 'Optimal' | 'Feasible' | 'Tight Schedule' | 'Extremely Tight' = 'Feasible';
  if (remainingMonthsTotal >= standardBenchmarkMonths + 6) feasibilityStatus = 'Optimal';
  else if (remainingMonthsTotal >= standardBenchmarkMonths) feasibilityStatus = 'Feasible';
  else if (remainingMonthsTotal >= standardBenchmarkMonths * 0.7) feasibilityStatus = 'Tight Schedule';
  else feasibilityStatus = 'Extremely Tight';

  return {
    isEligible: !isUnderage,
    section,
    exactAge,
    awardPathway,
    cutoffAge,
    deadlineDate: deadline.toISOString().split('T')[0],
    deadlineRule: isExplorer 
      ? 'Final portfolio/badge submission deadline is 1 day prior to the 18th birthday.'
      : isRover
      ? 'Final portfolio/badge submission deadline is 1 day prior to the 26th birthday.'
      : 'Adult leadership candidate pathway; no youth age cut-off.',
    remainingTime: {
      years: Math.max(0, remYears),
      months: Math.max(0, remMonths),
      days: Math.max(0, remDays),
      totalDays: Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))),
    },
    standardBenchmarkMonths,
    feasibilityStatus,
    isLeaderTrack: isLeader,
    message: isUnderage 
      ? 'Underage: Applicants must be at least 16 years old.' 
      : isLeader 
      ? 'Candidate age is 26+; automatically designated as Leader Track.'
      : `Designated as ${section} Scout.`,
  };
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  crews,
  onSignUpSuccess,
  setActiveTab,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: Date of Birth & Verification (Unified age determination)
  const [birthYear, setBirthYear] = useState<number>(2004);
  const [birthMonth, setBirthMonth] = useState<number>(6);
  const [birthDay, setBirthDay] = useState<number>(15);
  const [isVerifyingDob, setIsVerifyingDob] = useState<boolean>(false);
  const [dobResult, setDobResult] = useState<DobVerificationResponse>(() => computeDobFramework(2004, 6, 15));

  // STEP 2: Goal & Intent
  const [willingForAward, setWillingForAward] = useState<boolean>(true);
  const [leaderIntent, setLeaderIntent] = useState<'mentorship' | 'operations'>('mentorship');

  // STEP 3: Current Scouting Standing
  const [currentBadgeLevel, setCurrentBadgeLevel] = useState<string>('Scout Standard');
  const [leaderStanding, setLeaderStanding] = useState<string>('Wood Badge Holder');
  const [showPsModal, setShowPsModal] = useState<boolean>(false);

  // AI-Determined Crew Progression Benchmark State
  const [aiBenchmark, setAiBenchmark] = useState<{
    benchmarkText: string;
    benchmarkMonths: number;
    feasibility: 'Optimal' | 'Feasible' | 'Tight Schedule' | 'Extremely Tight';
    crewVelocityNotes: string;
    source?: string;
  } | null>(null);
  const [isLoadingAiBenchmark, setIsLoadingAiBenchmark] = useState<boolean>(false);

  // STEP 4: Review and Confirmation Commitment
  const [commitAcknowledged, setCommitAcknowledged] = useState<boolean>(false);
  const [commitAttendance, setCommitAttendance] = useState<boolean>(true);
  const [commitPromiseLaw, setCommitPromiseLaw] = useState<boolean>(true);
  const [commitCollaboration, setCommitCollaboration] = useState<boolean>(true);

  // STEP 5: Scouting Background & Specialization
  const [backgroundType, setBackgroundType] = useState<'new' | 'former'>('former');
  const [troopNumberInput, setTroopNumberInput] = useState<string>('1');
  const [atollSelectStep5, setAtollSelectStep5] = useState<string>("Male'");
  const [islandSchoolNameStep5, setIslandSchoolNameStep5] = useState<string>('Arabiyya');
  const [atollIslandInput, setAtollIslandInput] = useState<string>('Arabiyya');
  const [autoFormattedGroup, setAutoFormattedGroup] = useState<string>('1st Arabiyya Scout Group');
  const [leaderExpertise, setLeaderExpertise] = useState<string>('Expedition Leadership & Sea Scoutcraft');
  const [leaderExperienceText, setLeaderExperienceText] = useState<string>('Active Scouting background, former Patrol Leader & Rover.');

  // STEP 6: Personal Identity & Address
  const [fullName, setFullName] = useState<string>('');
  const [commonName, setCommonName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [idCardError, setIdCardError] = useState<string | null>(null);
  const [isCheckingId, setIsCheckingId] = useState<boolean>(false);

  // Permanent Address
  const [country, setCountry] = useState<string>('Maldives');
  const [dialCode, setDialCode] = useState<string>('+960');
  const [atoll, setAtoll] = useState<string>('Kaafu');
  const [island, setIsland] = useState<string>('Male\' City');
  const [ward, setWard] = useState<string>('Henveiru');
  const [streetAddress, setStreetAddress] = useState<string>('');

  // Living Address
  const [sameAsPermanent, setSameAsPermanent] = useState<boolean>(true);
  const [livingCountry, setLivingCountry] = useState<string>('Maldives');
  const [livingAtoll, setLivingAtoll] = useState<string>('Kaafu');
  const [livingIsland, setLivingIsland] = useState<string>('Male\' City');
  const [livingWard, setLivingWard] = useState<string>('Henveiru');
  const [livingStreetAddress, setLivingStreetAddress] = useState<string>('');

  // STEP 7: Contacts & Emergency Info
  const [phone, setPhone] = useState<string>('');
  const [secondaryPhone, setSecondaryPhone] = useState<string>('');
  const [telegramTag, setTelegramTag] = useState<string>('');
  const [instagramHandle, setInstagramHandle] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  // Emergency Contact
  const [iceName, setIceName] = useState<string>('');
  const [iceRelation, setIceRelation] = useState<string>('Parent');
  const [icePhone, setIcePhone] = useState<string>('');

  // STEP 8: Credentials & Policy
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [policyAccepted, setPolicyAccepted] = useState<boolean>(false);
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);

  // Submission & Post-Lifecycle State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const [registeredAppId, setRegisteredAppId] = useState<string>('');

  // Instant Synchronous DOB Update Handlers
  const handleYearChange = (y: number) => {
    setBirthYear(y);
    const updated = computeDobFramework(y, birthMonth, birthDay);
    setDobResult(updated);
    verifyDobWithServer(y, birthMonth, birthDay);
  };

  const handleMonthChange = (m: number) => {
    setBirthMonth(m);
    const updated = computeDobFramework(birthYear, m, birthDay);
    setDobResult(updated);
    verifyDobWithServer(birthYear, m, birthDay);
  };

  const handleDayChange = (d: number) => {
    setBirthDay(d);
    const updated = computeDobFramework(birthYear, birthMonth, d);
    setDobResult(updated);
    verifyDobWithServer(birthYear, birthMonth, d);
  };

  // Format Scout Group name dynamically
  useEffect(() => {
    if (backgroundType === 'former') {
      const num = troopNumberInput.trim() || '1';
      let ord = 'th';
      if (num.endsWith('1') && !num.endsWith('11')) ord = 'st';
      else if (num.endsWith('2') && !num.endsWith('12')) ord = 'nd';
      else if (num.endsWith('3') && !num.endsWith('13')) ord = 'rd';
      
      const cleanNum = num.replace(/\D/g, '') || '1';
      const cleanLoc = atollIslandInput.trim() || 'Male\'';
      setAutoFormattedGroup(`${cleanNum}${ord} ${cleanLoc} Scout Group`);
    }
  }, [troopNumberInput, atollIslandInput, backgroundType]);

  // Country Dial Code sync
  const handleCountryChange = (c: string) => {
    setCountry(c);
    if (c === 'Maldives') setDialCode('+960');
    else if (c === 'Sri Lanka') setDialCode('+94');
    else if (c === 'Malaysia') setDialCode('+60');
    else if (c === 'United Kingdom') setDialCode('+44');
    else if (c === 'Australia') setDialCode('+61');
    else setDialCode('+1');
  };

  const verifyDobWithServer = async (y: number, m: number, d: number) => {
    setIsVerifyingDob(true);
    try {
      const res = await fetch('/api/signup/verify-dob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: y, month: m, day: d }),
      });
      if (res.ok) {
        const data: DobVerificationResponse = await res.json();
        setDobResult(data);
      }
    } catch (e) {
      calculateLocalDob(y, m, d);
    } finally {
      setIsVerifyingDob(false);
    }
  };

  const calculateLocalDob = (y: number, m: number, d: number) => {
    const birthDate = new Date(y, m - 1, d);
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += 30;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const exactAge: ExactAge = { years, months, days };
    const isExplorer = years >= 16 && years < 18;
    const isRover = years >= 18 && years < 26;
    const isLeader = years >= 26;
    const isUnderage = years < 16;

    const section = isUnderage ? 'Underage' : isExplorer ? 'Explorer' : isRover ? 'Rover' : 'Leader';
    const cutoffAge = isExplorer ? 18 : 26;
    const awardPathway = isExplorer 
      ? 'President Scout (PS) Award' 
      : isRover 
      ? 'Baden-Powell (BP) Award' 
      : isLeader 
      ? 'Leadership / Adult Scouting' 
      : 'Ineligible';

    const cutoffBirthday = new Date(birthDate.getFullYear() + cutoffAge, birthDate.getMonth(), birthDate.getDate());
    const deadline = new Date(cutoffBirthday.getTime() - 24 * 60 * 60 * 1000);

    setDobResult({
      isEligible: !isUnderage,
      section,
      exactAge,
      awardPathway,
      cutoffAge,
      deadlineDate: deadline.toISOString().split('T')[0],
      deadlineRule: isExplorer 
        ? 'Final portfolio/badge submission deadline is 1 day prior to the 18th birthday.'
        : isRover
        ? 'Final portfolio/badge submission deadline is 1 day prior to the 26th birthday.'
        : 'Adult leadership candidate pathway; no youth age cut-off.',
      remainingTime: {
        years: Math.max(0, cutoffAge - years - 1),
        months: Math.max(0, 11 - months),
        days: Math.max(0, 30 - days),
        totalDays: Math.max(0, (cutoffAge - years) * 365),
      },
      standardBenchmarkMonths: isExplorer ? 15 : 36,
      feasibilityStatus: 'Feasible',
      isLeaderTrack: isLeader,
      message: isUnderage 
        ? 'Underage: Applicants must be at least 16 years old.' 
        : isLeader 
        ? 'Candidate age is 26+; automatically designated as Leader Track.'
        : `Designated as ${section} Scout.`,
    });
  };

  // National ID uniqueness check
  const handleCheckNationalId = async (val: string) => {
    setNationalId(val);
    if (!val.trim()) {
      setIdCardError(null);
      return;
    }
    setIsCheckingId(true);
    try {
      const res = await fetch('/api/signup/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: 'nationalId', value: val.trim() }),
      });
      const data = await res.json();
      if (!data.available) {
        setIdCardError(data.error || 'This ID Card / Passport is already registered.');
      } else {
        setIdCardError(null);
      }
    } catch (e) {
      setIdCardError(null);
    } finally {
      setIsCheckingId(false);
    }
  };

  // AI-Powered Crew Progression Benchmark Analyzer
  const fetchAiBenchmark = async (badgeLevel: string, dobRes: DobVerificationResponse) => {
    if (!dobRes || dobRes.isLeaderTrack || !dobRes.isEligible) return;
    setIsLoadingAiBenchmark(true);
    try {
      const res = await fetch('/api/ai/benchmark-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: dobRes.section,
          currentBadgeLevel: badgeLevel,
          exactAge: dobRes.exactAge,
          remainingYears: dobRes.remainingTime.years,
          remainingMonths: dobRes.remainingTime.months,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiBenchmark(data);
      }
    } catch (err) {
      console.warn('AI Benchmark fetch error:', err);
    } finally {
      setIsLoadingAiBenchmark(false);
    }
  };

  // Fetch AI benchmark on initial load & when badge level or DOB changes
  useEffect(() => {
    if (dobResult && !dobResult.isLeaderTrack && dobResult.isEligible) {
      fetchAiBenchmark(currentBadgeLevel, dobResult);
    }
  }, [currentBadgeLevel, dobResult?.section, dobResult?.remainingTime.years]);

  // Step 3 Badge change handler
  const handleBadgeLevelChange = (level: string) => {
    setCurrentBadgeLevel(level);
    if (level.includes('President Scout')) {
      setShowPsModal(true);
    }
    if (dobResult) {
      fetchAiBenchmark(level, dobResult);
    }
  };

  // Step Navigation Validation
  const canAdvanceStep = (step: number): boolean => {
    if (step === 1) {
      return Boolean(dobResult && dobResult.isEligible);
    }
    if (step === 4) {
      return commitAcknowledged;
    }
    if (step === 6) {
      return Boolean(fullName.trim() && nationalId.trim() && !idCardError && streetAddress.trim());
    }
    if (step === 7) {
      return Boolean(phone.trim() && email.trim() && telegramTag.trim() && iceName.trim() && icePhone.trim());
    }
    if (step === 8) {
      return Boolean(username.trim() && password.length >= 6 && password === confirmPassword && policyAccepted);
    }
    return true;
  };

  // Unified Final Submission (Routes to /api/signup/member or /api/signup/leader based on DOB)
  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    const isLeader = dobResult?.isLeaderTrack || false;

    const payload = {
      section: dobResult?.section || 'Rover',
      dob: { year: birthYear, month: birthMonth, day: birthDay },
      exactAge: dobResult?.exactAge || { years: 20, months: 0, days: 0 },
      awardGoal: {
        willingForAward: isLeader ? true : willingForAward,
        goalTitle: isLeader ? 'Leadership / Adult Scouting Candidate' : (dobResult?.awardPathway || 'Baden-Powell (BP) Award'),
        leaderIntent: isLeader ? leaderIntent : undefined,
      },
      standing: {
        currentBadgeLevel: isLeader ? leaderStanding : currentBadgeLevel,
        remainingYears: dobResult?.remainingTime.years || 0,
        remainingMonths: dobResult?.remainingTime.months || 0,
        remainingDays: dobResult?.remainingTime.days || 0,
        deadlineDate: dobResult?.deadlineDate || '',
      },
      commitmentsAccepted: true,
      background: {
        type: backgroundType,
        troopNumber: backgroundType === 'former' ? troopNumberInput : undefined,
        atollIsland: backgroundType === 'former' ? atollIslandInput : undefined,
        officialDesignation: backgroundType === 'former' ? autoFormattedGroup : 'New to Scouting',
        areaOfExpertise: isLeader ? leaderExpertise : undefined,
        experienceNotes: isLeader ? leaderExperienceText : undefined,
      },
      personal: {
        fullName: fullName.trim(),
        commonName: commonName.trim() || fullName.trim().split(' ')[0],
        nationalId: nationalId.trim(),
        gender,
      },
      permanentAddress: {
        country,
        dialCode,
        atoll,
        island,
        ward,
        streetAddress: streetAddress.trim(),
      },
      livingAddress: {
        isSameAsPermanent: sameAsPermanent,
        country: sameAsPermanent ? country : livingCountry,
        atoll: sameAsPermanent ? atoll : livingAtoll,
        island: sameAsPermanent ? island : livingIsland,
        ward: sameAsPermanent ? ward : livingWard,
        streetAddress: sameAsPermanent ? streetAddress.trim() : livingStreetAddress.trim(),
      },
      contacts: {
        phone: phone.trim(),
        dialCode,
        secondaryPhone: secondaryPhone.trim(),
        telegramTag: telegramTag.startsWith('@') ? telegramTag.trim() : `@${telegramTag.trim()}`,
        instagramHandle: instagramHandle.startsWith('@') ? instagramHandle.trim() : `@${instagramHandle.trim()}`,
        email: email.trim().toLowerCase(),
      },
      emergencyContact: {
        fullName: iceName.trim(),
        relationship: iceRelation,
        phone: icePhone.trim(),
      },
      credentials: {
        username: username.trim(),
      },
      policyAccepted: true,
    };

    try {
      const endpoint = isLeader ? '/api/signup/leader' : '/api/signup/member';
      const bodyData = isLeader ? {
        fullName: fullName.trim(),
        nationalId: nationalId.trim(),
        country,
        atoll,
        island,
        ward,
        streetAddress: streetAddress.trim(),
        phone: `${dialCode} ${phone.trim()}`,
        email: email.trim().toLowerCase(),
        areaOfExpertise: leaderExpertise,
        scoutingExperience: leaderExperienceText,
        leadershipMotivation: `Registered via Arabiyya Onboarding Pipeline as ${leaderStanding}.`,
      } : payload;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      const generatedId = data.applicationId || (isLeader ? `ldr-${Math.floor(100000 + Math.random() * 900000)}` : `mem-${Math.floor(100000 + Math.random() * 900000)}`);
      setRegisteredAppId(generatedId);
      setSubmissionComplete(true);

      // Create local user profile for seamless immediate session experience
      const newMemberRole = isLeader 
        ? 'Leader Candidate' 
        : dobResult?.section === 'Explorer' 
        ? 'Explorer Scout' 
        : 'Rover Scout';

      const newRoverMember: RoverMember = {
        id: generatedId,
        applicationId: generatedId,
        name: fullName.trim(),
        commonName: commonName.trim() || fullName.trim().split(' ')[0],
        nationalId: nationalId.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password,
        role: newMemberRole,
        section: dobResult?.section || 'Rover',
        crewId: crews[0]?.id || 'ARAB-CREW-01',
        crewName: 'Arabiyya Al-Ruwad Rover Crew',
        unitDistrict: '1st Arabiyya Scout Group / Central Council',
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=300&auto=format&fit=crop&q=80`,
        bio: `${dobResult?.section} Candidate. Background: ${backgroundType === 'former' ? autoFormattedGroup : 'New to Scouting'}.`,
        phone: `${dialCode} ${phone.trim()}`,
        telegramTag: telegramTag.startsWith('@') ? telegramTag.trim() : `@${telegramTag.trim()}`,
        instagramHandle: instagramHandle.startsWith('@') ? instagramHandle.trim() : `@${instagramHandle.trim()}`,
        bloodGroup: 'O+',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        rankStage: isLeader ? 'Leader Track Candidate' : dobResult?.section === 'Explorer' ? 'Explorer Candidate' : 'Rover Squire',
        totalServiceHours: 0,
        badgesCount: currentBadgeLevel.includes('President Scout') ? 4 : 1,
        emergencyContact: {
          name: iceName.trim(),
          relation: iceRelation,
          phone: icePhone.trim(),
        },
        skills: isLeader ? ['Adult Training', 'Expedition Command', 'Scout Governance'] : ['Pioneering', 'Scoutcraft', 'Wilderness First Aid'],
        badges: [
          {
            id: `b-init-${Date.now()}`,
            name: isLeader ? 'Leader Track Dossier Registered' : dobResult?.section === 'Explorer' ? 'Explorer Enrollment' : 'Rover Squire Candidate',
            category: 'Leadership',
            description: 'Enrolled in Arabiyya Rover Network onboarding pipeline.',
            status: 'completed',
            dateEarned: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          }
        ],
        recentActivities: [],
        awardGoal: dobResult?.awardPathway,
        status: 'Pending Verification',
        dateOfBirth: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
      };

      onSignUpSuccess(newRoverMember);
    } catch (e) {
      console.error('Failed submitting application', e);
      setRegisteredAppId(isLeader ? `ldr-${Math.floor(100000 + Math.random() * 900000)}` : `mem-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmissionComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Birth Year options (1950 to 2012)
  const yearsList = Array.from({ length: 63 }, (_, i) => 2012 - i);
  const monthsList = [
    { num: 1, name: 'January (01)' },
    { num: 2, name: 'February (02)' },
    { num: 3, name: 'March (03)' },
    { num: 4, name: 'April (04)' },
    { num: 5, name: 'May (05)' },
    { num: 6, name: 'June (06)' },
    { num: 7, name: 'July (07)' },
    { num: 8, name: 'August (08)' },
    { num: 9, name: 'September (09)' },
    { num: 10, name: 'October (10)' },
    { num: 11, name: 'November (11)' },
    { num: 12, name: 'December (12)' },
  ];
  const daysList = Array.from({ length: 31 }, (_, i) => i + 1);

  const isLeaderSection = dobResult?.isLeaderTrack || false;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Title Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-maroon-50 border border-maroon-100 text-maroon-900 text-xs font-semibold">
          <Compass className="w-4 h-4 text-skyrover-600 animate-spin-slow" />
          <span>Arabiyya Rover Network &bull; Automated Onboarding Pipeline</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Arabiyya Rover Scout Portal Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          An automated onboarding pipeline that determines your scouting section (Explorer, Rover, or Leader Track) dynamically from your date of birth.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* UNIFIED 8-STEP ONBOARDING CONTAINER                           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {submissionComplete ? (
          /* Post-Submission Lifecycle Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-in zoom-in-75">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-slate-800">
                <span>Application Reference:</span>
                <span className="text-maroon-900">{registeredAppId}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Registration Received: Status &ldquo;Pending Verification&rdquo;
              </h2>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl max-w-xl mx-auto text-xs text-amber-900 font-semibold leading-relaxed">
                &ldquo;Thank you for registering! Please wait for a call from the Arabiyya Rover Council regarding your membership.&rdquo;
              </div>
            </div>

            {/* Workflow Pipeline */}
            <div className="max-w-xl mx-auto p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-4 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px] block border-b border-slate-200 pb-2">
                Post-Submission Lifecycle &amp; Verification Workflow
              </span>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Automated Welcome Confirmation Email Dispatched</span>
                    <span className="text-slate-500 text-[11px]">Sent to {email} with orientation instructions and next steps.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Notification Dispatched to Arabiyya Rover Council</span>
                    <span className="text-slate-500 text-[11px]">Executive Council alert sent to <code>council@arabiyyascouts.mv</code>.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-maroon-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Council Phone Interview &amp; Verification</span>
                    <span className="text-slate-500 text-[11px]">Council mentors will verify your background details and schedule a phone interview.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Council Decision &amp; Investiture Setting</span>
                    <span className="text-slate-500 text-[11px]">Upon approval, investiture date is officially logged and full portal access (log book, progression, minutes) is unlocked.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                View Member Dashboard
              </button>
              <button
                onClick={() => setActiveTab('home')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Progress Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900 uppercase tracking-wide">
                  Step {currentStep} of 8: {
                    currentStep === 1 ? 'Date of Birth & Age Verification' :
                    currentStep === 2 ? (isLeaderSection ? 'Leadership Goal & Mentorship Intent' : 'Award Goal & Milestone Intent') :
                    currentStep === 3 ? (isLeaderSection ? 'Leadership Standing & Experience' : 'Current Scouting Standing & Timeline') :
                    currentStep === 4 ? (isLeaderSection ? 'Code of Leadership & Safety Governance' : 'Crew Commitment & Dedication') :
                    currentStep === 5 ? (isLeaderSection ? 'Scouting Background & Area of Expertise' : 'Scouting Background') :
                    currentStep === 6 ? 'Personal Identity & Residential Address' :
                    currentStep === 7 ? 'Contact Channels & Emergency Info' :
                    'Account Credentials & Policy Ratification'
                  }
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-maroon-900 transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700">

              {/* --------------------------------------------------- */}
              {/* STEP 1: Date of Birth & Automated Section Routing   */}
              {/* --------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 1: Date of Birth &amp; Age Verification
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Enter your exact date of birth. The system will automatically calculate your age down to the exact day and allocate your scouting section (Explorer, Rover, or Leader Track).
                    </p>
                  </div>

                  {/* Inputs: Year, Month, Day */}
                  <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Year (YYYY)</label>
                      <select
                        value={birthYear}
                        onChange={e => handleYearChange(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      >
                        {yearsList.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Month (MM)</label>
                      <select
                        value={birthMonth}
                        onChange={e => handleMonthChange(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      >
                        {monthsList.map(m => (
                          <option key={m.num} value={m.num}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Day (DD)</label>
                      <select
                        value={birthDay}
                        onChange={e => handleDayChange(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      >
                        {daysList.map(d => (
                          <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Calculation Result Feedback */}
                  {dobResult && !dobResult.isEligible && (
                    <div className="space-y-4">
                      {/* Underage Notice (<16) */}
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900">
                        <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs">Section: Junior / Underage (Ineligible)</h4>
                          <p className="text-[11px] text-rose-700 leading-relaxed">
                            Exact age: <strong>{dobResult.exactAge.years} years, {dobResult.exactAge.months} months, {dobResult.exactAge.days} days</strong>. Applications are not accepted; applicants must be at least 16 years old to join the Arabiyya Rover Network.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* STEP 2: Award Goal & Milestone Intent              */}
              {/* --------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 2: {isLeaderSection ? 'Leadership Goal & Mentorship Intent' : 'Award Goal & Milestone Intent'}
                    </h3>
                    {isLeaderSection && (
                      <p className="text-slate-500 text-xs">
                        Specify your primary leadership commitment and capacity within the Arabiyya Rover Network.
                      </p>
                    )}
                  </div>

                  {isLeaderSection ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setLeaderIntent('mentorship')}
                        className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 ${
                          leaderIntent === 'mentorship'
                            ? 'border-maroon-800 bg-maroon-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-maroon-900 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-maroon-800" />
                            Patrol Mentorship &amp; Scoutcraft Training
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${leaderIntent === 'mentorship' ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-slate-300'}`}>
                            {leaderIntent === 'mentorship' && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Serve as a mentor for Rover Squire vigil preparation, hike expeditions, and pioneering badge syllabi.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLeaderIntent('operations')}
                        className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 ${
                          leaderIntent === 'operations'
                            ? 'border-navy-900 bg-slate-50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-navy-950 flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-skyrover-600" />
                            Council Advisory &amp; Operations
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${leaderIntent === 'operations' ? 'border-navy-900 bg-navy-900 text-white' : 'border-slate-300'}`}>
                            {leaderIntent === 'operations' && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Contribute to quartermaster logistics, medical safety triage, financial probity, and constitutional governance.
                        </p>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                        <h4 className="text-sm font-bold text-slate-900">
                          {dobResult?.section === 'Explorer'
                            ? 'Are you willing to work toward the President Scout Award?'
                            : 'Are you willing to work toward the Baden-Powell Award?'}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setWillingForAward(true)}
                          className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 ${
                            willingForAward
                              ? 'border-maroon-800 bg-maroon-50/50 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-maroon-900 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              Yes, I am willing!
                            </span>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${willingForAward ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-slate-300'}`}>
                              {willingForAward && <Check className="w-2.5 h-2.5" />}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Activates progression timeline tracking, syllabus milestone calculation, and quarterly progress benchmarking with Arabiyya mentors.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWillingForAward(false)}
                          className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 ${
                            !willingForAward
                              ? 'border-slate-800 bg-slate-50 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <Compass className="w-4 h-4 text-skyrover-600" />
                              No, just exploring
                            </span>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${!willingForAward ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300'}`}>
                              {!willingForAward && <Check className="w-2.5 h-2.5" />}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Registers you for general scouting activities, patrol expeditions, and community service without mandatory award completion pressure.
                          </p>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* STEP 3: Current Standing & Feasibility / Timeline  */}
              {/* --------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 3: {isLeaderSection ? 'Leadership Standing & Experience Classification' : 'Current Scouting Standing & Timeline Estimation'}
                    </h3>
                    <p className="text-slate-500 text-xs">
                      {isLeaderSection 
                        ? 'Select your current scouting credential or professional qualification.' 
                        : 'Select your current badge level to calculate milestone feasibility against the cut-off deadline.'}
                    </p>
                  </div>

                  {isLeaderSection ? (
                    <div className="space-y-3">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Select Current Leadership Level:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          'Wood Badge Holder (Advanced Leader)',
                          'Former Rover Scout / Patrol Leader',
                          'Youth Leader / Warrant Candidate',
                          'Professional Specialist (Medic / Navigator / Quartermaster)'
                        ].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setLeaderStanding(level)}
                            className={`px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                              leaderStanding === level 
                                ? 'bg-navy-900 text-white font-bold shadow-2xs'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span>{level}</span>
                            {leaderStanding === level && <Check className="w-4 h-4 text-skyrover-300 shrink-0" />}
                          </button>
                        ))}
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
                        <span className="font-bold text-slate-900 block">Adult Leader Onboarding SLA:</span>
                        <p>
                          Adult leadership dossiers are submitted directly to the Executive Council and Group Scout Leader (GSL) for warrant endorsement.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
                          Select Current Badge Level:
                        </label>
                        <div className="grid grid-cols-1 gap-2.5">
                          {(dobResult?.section === 'Explorer' ? [
                            { name: 'Square', standardReq: 'Standard Requirement: ~18 months to President Scout Award' },
                            { name: 'Scout Standard', standardReq: 'Standard Requirement: ~15 months to President Scout Award' },
                            { name: 'Advanced Scout Standard', standardReq: 'Standard Requirement: ~12 months to President Scout Award' },
                            { name: "Bushman's Thong", standardReq: 'Standard Requirement: ~8 months to President Scout Award' },
                            { name: 'President Scout Candidate', standardReq: 'Standard Requirement: ~6 months to President Scout Award' },
                          ] : [
                            { name: 'Square', standardReq: 'Standard Requirement: ~3 years to Baden-Powell Award' },
                            { name: 'Scout Standard', standardReq: 'Standard Requirement: ~2 years and 6 months to Baden-Powell Award' },
                            { name: 'Advanced Scout Standard', standardReq: 'Standard Requirement: ~2 years to Baden-Powell Award' },
                            { name: "Bushman's Thong", standardReq: 'Standard Requirement: ~2 years to Baden-Powell Award' },
                            { name: 'President Scout Award Holder', standardReq: 'Standard Requirement: ~2 years to Baden-Powell Award' },
                          ]).map((badge) => (
                            <button
                              key={badge.name}
                              type="button"
                              onClick={() => handleBadgeLevelChange(badge.name)}
                              className={`px-4 py-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                currentBadgeLevel === badge.name 
                                ? 'bg-maroon-50 border-maroon-800 text-maroon-900 font-bold shadow-xs'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs block text-slate-900">{badge.name}</span>
                                <span className={`text-[11px] block font-medium ${
                                  currentBadgeLevel === badge.name ? 'text-maroon-800' : 'text-slate-500'
                                }`}>
                                  {badge.standardReq}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {currentBadgeLevel === badge.name && (
                                  <span className="w-6 h-6 rounded-full bg-maroon-900 text-white flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Countdown & Feasibility Analysis */}
                      {dobResult && (
                        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                              Dynamic Countdown &amp; Feasibility Analysis
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-skyrover-300">
                              Cut-off: 1 day before {dobResult.cutoffAge}th birthday ({dobResult.deadlineDate})
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2.5 bg-white/5 rounded-xl">
                              <span className="text-2xl font-black font-mono text-amber-400 block">
                                {dobResult.remainingTime.years}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase">Years Remaining</span>
                            </div>
                            <div className="p-2.5 bg-white/5 rounded-xl">
                              <span className="text-2xl font-black font-mono text-amber-400 block">
                                {dobResult.remainingTime.months}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase">Months Remaining</span>
                            </div>
                            <div className="p-2.5 bg-white/5 rounded-xl">
                              <span className="text-2xl font-black font-mono text-amber-400 block">
                                {dobResult.remainingTime.days}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase">Days Remaining</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* STEP 4: Review and Confirmation                    */}
              {/* --------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 4: Review and Confirmation
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Read and verify your generated commitment statement.
                    </p>
                  </div>

                  {dobResult?.isLeaderTrack ? (
                    <div className="space-y-4">
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative shadow-2xs">
                        <p className="text-slate-800 text-xs sm:text-sm font-serif italic leading-relaxed">
                          {`"I am registering as an Adult Leader candidate with the 1st Arabiyya Scout Group / Arabiyya Rover Network. I commit to upholding the Scout Promise and Law, ensuring youth protection, and actively mentoring youth members toward leadership and award excellence."`}
                        </p>
                      </div>

                      <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-maroon-800/40 bg-maroon-50/40 hover:bg-maroon-50/70 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={commitAcknowledged}
                          onChange={e => setCommitAcknowledged(e.target.checked)}
                          className="rounded text-maroon-800 focus:ring-maroon-700 w-5 h-5 cursor-pointer"
                        />
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          I acknowledge and agree to this commitment
                        </span>
                      </label>
                    </div>
                  ) : (
                    (() => {
                      const isExplorer = dobResult?.section === 'Explorer';
                      const awardName = isExplorer ? 'President Scout Award' : 'Baden-Powell Award';
                      
                      let standardReq = '~3 years to Baden-Powell Award';
                      if (!isExplorer) {
                        if (currentBadgeLevel === 'Square') standardReq = '~3 years to Baden-Powell Award';
                        else if (currentBadgeLevel === 'Scout Standard') standardReq = '~2 years and 6 months to Baden-Powell Award';
                        else if (currentBadgeLevel === 'Advanced Scout Standard') standardReq = '~2 years to Baden-Powell Award';
                        else if (currentBadgeLevel === "Bushman's Thong" || currentBadgeLevel === "Bushman’s Thong") standardReq = '~2 years to Baden-Powell Award';
                        else if (currentBadgeLevel.includes('President Scout')) standardReq = '~2 years to Baden-Powell Award';
                      } else {
                        if (currentBadgeLevel === 'Square') standardReq = '~18 months to President Scout Award';
                        else if (currentBadgeLevel === 'Scout Standard') standardReq = '~15 months to President Scout Award';
                        else if (currentBadgeLevel === 'Advanced Scout Standard') standardReq = '~12 months to President Scout Award';
                        else if (currentBadgeLevel === "Bushman's Thong" || currentBadgeLevel === "Bushman’s Thong") standardReq = '~8 months to President Scout Award';
                        else standardReq = '~6 months to President Scout Award';
                      }

                      const ageYears = dobResult?.exactAge.years ?? 21;
                      const ageMonths = dobResult?.exactAge.months ?? 10;
                      const ageDays = dobResult?.exactAge.days ?? 7;

                      const remYears = dobResult?.remainingTime.years ?? 4;
                      const remMonths = dobResult?.remainingTime.months ?? 1;
                      const remDays = dobResult?.remainingTime.days ?? 23;
                      const cutoffAge = dobResult?.cutoffAge ?? 26;

                      const statement = `\"I am currently ${ageYears} years, ${ageMonths} months, and ${ageDays} days old, and I would like to work toward the ${awardName}. This award estimatedly requires ${standardReq} to complete from my current standing, and I actually have ${remYears} years, ${remMonths} months, and ${remDays} days remaining until my birthday submission deadline. I understand that earning this award requires dedicated commitment and that the last day I can submit for ${awardName} is one day before my ${cutoffAge}th birthday, and I am fully willing to make that commitment.\"`;

                      return (
                        <div className="space-y-4">
                          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative shadow-2xs">
                            <p className="text-slate-800 text-xs sm:text-sm font-serif italic leading-relaxed">
                              {statement}
                            </p>
                          </div>

                          <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-maroon-800/40 bg-maroon-50/40 hover:bg-maroon-50/70 cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              checked={commitAcknowledged}
                              onChange={e => setCommitAcknowledged(e.target.checked)}
                              className="rounded text-maroon-800 focus:ring-maroon-700 w-5 h-5 cursor-pointer"
                            />
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              I acknowledge and agree to this commitment
                            </span>
                          </label>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* STEP 5: Scouting Background & Specialization        */}
              {/* --------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 5: {isLeaderSection ? 'Scouting Background & Area of Expertise' : 'Scouting Background'}
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Indicate your scouting roots. Previous troop designations will be auto-formatted.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBackgroundType('former')}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        backgroundType === 'former'
                          ? 'border-maroon-800 bg-maroon-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-slate-900 block text-xs">Existing / Former Scout</span>
                      <span className="text-[11px] text-slate-500">Collects previous troop/group registration</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBackgroundType('new')}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        backgroundType === 'new'
                          ? 'border-maroon-800 bg-maroon-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-slate-900 block text-xs">New to Scouting</span>
                      <span className="text-[11px] text-slate-500">Joining the Scout movement for the first time</span>
                    </button>
                  </div>

                  {backgroundType === 'former' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <div>
                        <span className="font-bold text-slate-800 text-xs block mb-2">
                          Quick Select Previous Unit / Group:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTroopNumberInput('1');
                              setAtollSelectStep5('Arabiyya');
                              setIslandSchoolNameStep5('Arabiyya');
                              setAtollIslandInput('Arabiyya');
                              setAutoFormattedGroup('1st Arabiyya Scout Group');
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              autoFormattedGroup === '1st Arabiyya Scout Group'
                                ? 'bg-maroon-50 border-maroon-800 text-maroon-900 font-bold shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="text-xs block font-bold">1st Arabiyya Scout Group</span>
                            <span className="text-[10px] text-slate-500 font-normal">Arabiyya School (Al-Madhrasathul Arabiyyathul Islaamiyya)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTroopNumberInput('11');
                              setAtollSelectStep5("Male'");
                              setIslandSchoolNameStep5("Male'");
                              setAtollIslandInput("Male'");
                              setAutoFormattedGroup("11th Male' Scout Group");
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              autoFormattedGroup === "11th Male' Scout Group"
                                ? 'bg-maroon-50 border-maroon-800 text-maroon-900 font-bold shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="text-xs block font-bold">11th Male' Scout Group</span>
                            <span className="text-[10px] text-slate-500 font-normal">Male' City Unit Designation</span>
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3 space-y-3">
                        <span className="font-bold text-slate-800 text-xs block">
                          Or Specify Custom Unit Details:
                        </span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Troop / Group Number</label>
                          <input
                            type="text"
                            value={troopNumberInput}
                            onChange={e => setTroopNumberInput(e.target.value)}
                            placeholder="e.g. 1 or 11"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Atoll / Island / School</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-semibold mb-1">Select Atoll (Dropdown):</label>
                              <select
                                value={atollSelectStep5}
                                onChange={e => {
                                  const selected = e.target.value;
                                  setAtollSelectStep5(selected);
                                  if (selected === 'Arabiyya') {
                                    setAtollIslandInput('Arabiyya');
                                  } else if (selected === "Male'" || selected === "Hulhumale'" || selected === "Vilimale'") {
                                    setAtollIslandInput(selected);
                                  } else if (selected === 'Other') {
                                    setAtollIslandInput(islandSchoolNameStep5 || 'Scout Group');
                                  } else {
                                    setAtollIslandInput(islandSchoolNameStep5 ? `${selected} ${islandSchoolNameStep5}` : selected);
                                  }
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800"
                              >
                                {MALDIVES_ATOLLS_LIST.map(atollItem => (
                                  <option key={atollItem.code} value={atollItem.code}>
                                    {atollItem.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-500 font-semibold mb-1">Island / School / Unit Name:</label>
                              <input
                                type="text"
                                value={islandSchoolNameStep5}
                                onChange={e => {
                                  const nameVal = e.target.value;
                                  setIslandSchoolNameStep5(nameVal);
                                  if (atollSelectStep5 === 'Arabiyya') {
                                    setAtollIslandInput(nameVal || 'Arabiyya');
                                  } else if (atollSelectStep5 === "Male'" || atollSelectStep5 === "Hulhumale'" || atollSelectStep5 === "Vilimale'") {
                                    setAtollIslandInput(nameVal ? `${atollSelectStep5} (${nameVal})` : atollSelectStep5);
                                  } else if (atollSelectStep5 === 'Other') {
                                    setAtollIslandInput(nameVal || 'Scout Group');
                                  } else {
                                    setAtollIslandInput(nameVal ? `${atollSelectStep5} ${nameVal}` : atollSelectStep5);
                                  }
                                }}
                                placeholder="e.g. Arabiyya, Majeediyya, or Island name"
                                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">
                          Official Scout Association Designation (Live Format):
                        </span>
                        <span className="text-xs font-bold text-maroon-900 font-mono">
                          {autoFormattedGroup}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Leader Track specific area of expertise */}
                  {isLeaderSection && (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Primary Area of Leadership Expertise</label>
                        <select
                          value={leaderExpertise}
                          onChange={e => setLeaderExpertise(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                        >
                          <option value="Expedition Leadership & Sea Scoutcraft">Expedition Leadership & Sea Scoutcraft</option>
                          <option value="Wilderness First Aid & Search and Rescue">Wilderness First Aid & Search and Rescue</option>
                          <option value="Wood Badge & Training Cadre">Wood Badge & Training Cadre</option>
                          <option value="Quartermaster & Armory Logistics">Quartermaster & Armory Logistics</option>
                          <option value="Scout Administration & Governance">Scout Administration & Governance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Scouting / Leadership Background Notes</label>
                        <textarea
                          rows={2}
                          value={leaderExperienceText}
                          onChange={e => setLeaderExperienceText(e.target.value)}
                          placeholder="Briefly describe your scouting or leadership experience..."
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-maroon-800 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* STEP 6: Personal Identity & Residential Address    */}
              {/* --------------------------------------------------- */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 6: Personal Identity &amp; Residential Address
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Enter your official government identity information and residential locations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Ahmed Zaidan"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Common Name / Call Sign</label>
                      <input
                        type="text"
                        value={commonName}
                        onChange={e => setCommonName(e.target.value)}
                        placeholder="e.g. Zaid"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase">National ID Card / Passport *</label>
                        {isCheckingId && <span className="text-[10px] text-slate-400">Verifying uniqueness...</span>}
                      </div>
                      <input
                        type="text"
                        required
                        value={nationalId}
                        onChange={e => handleCheckNationalId(e.target.value)}
                        placeholder="e.g. A381920"
                        className={`w-full px-3 py-2 text-xs border rounded-xl font-mono focus:outline-none ${
                          idCardError ? 'border-rose-500 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-maroon-800'
                        }`}
                      />
                      {idCardError && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{idCardError}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wide block">
                      Permanent Address
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
                        <select
                          value={country}
                          onChange={e => handleCountryChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        >
                          <option value="Maldives">Maldives (+960)</option>
                          <option value="Sri Lanka">Sri Lanka (+94)</option>
                          <option value="Malaysia">Malaysia (+60)</option>
                          <option value="United Kingdom">United Kingdom (+44)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Atoll / State</label>
                        <input
                          type="text"
                          value={atoll}
                          onChange={e => setAtoll(e.target.value)}
                          placeholder="e.g. Kaafu"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Island / City</label>
                        <input
                          type="text"
                          value={island}
                          onChange={e => setIsland(e.target.value)}
                          placeholder="e.g. Male' City"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ward / District</label>
                        <input
                          type="text"
                          value={ward}
                          onChange={e => setWard(e.target.value)}
                          placeholder="e.g. Henveiru"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address / House Name *</label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={e => setStreetAddress(e.target.value)}
                          placeholder="e.g. H. Oceanic Breeze, Boduthakurufaanu Magu"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Living Address Toggle */}
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                        Current Living Address
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-maroon-900">
                        <input
                          type="checkbox"
                          checked={sameAsPermanent}
                          onChange={e => setSameAsPermanent(e.target.checked)}
                          className="rounded text-maroon-800"
                        />
                        <span>Same as Permanent Address</span>
                      </label>
                    </div>

                    {!sameAsPermanent && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Living Island / City</label>
                          <input
                            type="text"
                            value={livingIsland}
                            onChange={e => setLivingIsland(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Living Street Line</label>
                          <input
                            type="text"
                            value={livingStreetAddress}
                            onChange={e => setLivingStreetAddress(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* STEP 7: Contact Channels & Emergency Info          */}
              {/* --------------------------------------------------- */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 7: Contact Channels &amp; Emergency Info
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Channels are integrated directly with Arabiyya bot notifications and emergency council records.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mobile Phone Number *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-xs font-mono font-bold bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-700">
                          {dialCode}
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="7712345"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-r-xl focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Secondary / Landline</label>
                      <input
                        type="tel"
                        value={secondaryPhone}
                        onChange={e => setSecondaryPhone(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Telegram Tag (@username) *
                      </label>
                      <input
                        type="text"
                        required
                        value={telegramTag}
                        onChange={e => setTelegramTag(e.target.value)}
                        placeholder="@zaid_scout"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Required for Arabiyya Rover Telegram bot &amp; crew patrol announcements
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Instagram Handle</label>
                      <input
                        type="text"
                        value={instagramHandle}
                        onChange={e => setInstagramHandle(e.target.value)}
                        placeholder="@zaid.scouts"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="zaidan@arabiyyascouts.mv"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Used for official council correspondence and login security notices
                    </span>
                  </div>

                  {/* Emergency Contact */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wide block">
                      Emergency Contact Details (Next of Kin)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={iceName}
                          onChange={e => setIceName(e.target.value)}
                          placeholder="e.g. Ibrahim Zaidan"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relationship *</label>
                        <select
                          value={iceRelation}
                          onChange={e => setIceRelation(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        >
                          <option value="Parent">Parent</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Emergency Phone *</label>
                        <input
                          type="tel"
                          required
                          value={icePhone}
                          onChange={e => setIcePhone(e.target.value)}
                          placeholder="7901122"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* STEP 8: Account Credentials & Policy Ratification   */}
              {/* --------------------------------------------------- */}
              {currentStep === 8 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 8: Account Credentials &amp; Policy Ratification
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Configure your portal login credentials and ratify the 22-section Arabiyya Operating Policy.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Desired Username *</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        placeholder="e.g. zaidan_rover"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned Unit</label>
                      <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                        1st Arabiyya Scout Group / {isLeaderSection ? 'Leader Cadre' : 'Rover Network'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-maroon-800 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-maroon-800 focus:outline-none font-mono"
                      />
                      {password && confirmPassword && password !== confirmPassword && (
                        <span className="text-[10px] text-rose-600 block mt-1 font-semibold">Passwords do not match</span>
                      )}
                    </div>
                  </div>

                  {/* Policy Agreement Checkbox */}
                  <div className="p-4 bg-rose-50/60 border border-maroon-200 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={policyAccepted}
                          onChange={e => setPolicyAccepted(e.target.checked)}
                          className="mt-0.5 rounded text-maroon-800 focus:ring-maroon-700 w-4 h-4"
                        />
                        <div className="space-y-0.5 text-xs">
                          <span className="font-bold text-maroon-950 block">
                            I Agree to the 22-Section Arabiyya Rover Operating Policy *
                          </span>
                          <span className="text-slate-600 text-[11px] block leading-normal">
                            I confirm adherence to the 22 constitutional articles regarding attendance, logbook truthfulness, uniform codes, and Scout Law.
                          </span>
                        </div>
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowPolicyModal(true)}
                        className="px-3 py-1.5 bg-white border border-maroon-200 hover:bg-maroon-100 text-maroon-900 rounded-xl text-[11px] font-semibold shrink-0 transition-colors flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Read 22 Articles</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Step Navigation Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 8 ? (
                <button
                  type="button"
                  disabled={!canAdvanceStep(currentStep)}
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Proceed to Step {currentStep + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canAdvanceStep(8) || isSubmitting}
                  onClick={handleSubmitApplication}
                  className="px-7 py-2.5 bg-maroon-900 hover:bg-maroon-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Final Submission &amp; Council Review</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}

      </div>

      {/* President Scout Celebration Modal */}
      {showPsModal && (
        <PresidentScoutCelebrationModal
          onClose={() => setShowPsModal(false)}
          section={dobResult?.section === 'Explorer' ? 'Explorer' : 'Rover'}
        />
      )}

      {/* 22-Article Operating Policy Modal */}
      {showPolicyModal && (
        <OperatingPolicyModal
          onClose={() => setShowPolicyModal(false)}
          onAccept={() => setPolicyAccepted(true)}
        />
      )}

    </div>
  );
};
