import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Send, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  ArrowRight, 
  Compass, 
  Users, 
  Filter,
  Check,
  X
} from 'lucide-react';
import { PipelineApplication, UserRole, SectionType } from '../types';

interface PipelineViewProps {
  currentRole: UserRole;
  onApplicationEnrolled?: (app: PipelineApplication) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'track' | 'adminReview'>('apply');

  // Application form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [scoutBackground, setScoutBackground] = useState('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [allocatedSection, setAllocatedSection] = useState<SectionType | null>(null);

  // OTP Verification State
  const [submittedAppCode, setSubmittedAppCode] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);

  // Tracker State
  const [trackQueryCode, setTrackQueryCode] = useState('ARAB-2026-8812');
  const [trackedRecord, setTrackedRecord] = useState<PipelineApplication | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Admin Review State
  const [pipelineList, setPipelineList] = useState<PipelineApplication[]>([]);
  const [filterSection, setFilterSection] = useState<'All' | SectionType>('All');
  const [reviewNote, setReviewNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Load pipeline applications
  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/pipeline/applications');
      if (res.ok) {
        const data = await res.json();
        setPipelineList(data);
      }
    } catch (e) {
      console.error('Failed to fetch applications from server', e);
    }
  };

  useEffect(() => {
    fetchApplications();
    // Pre-load default tracked record
    handleTrackSearch('ARAB-2026-8812');
  }, []);

  // Real-time Age Calculation
  useEffect(() => {
    if (!dob) {
      setCalculatedAge(null);
      setAllocatedSection(null);
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setCalculatedAge(age);
    if (age < 18) {
      setAllocatedSection('Explorer');
    } else if (age >= 18 && age <= 26) {
      setAllocatedSection('Rover');
    } else {
      setAllocatedSection('Leader');
    }
  }, [dob]);

  // Submit Application
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pipeline/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          telegramHandle,
          dob,
          bloodGroup,
          scoutBackground,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedAppCode(data.trackingCode);
        setSimulatedOtp(data.simulatedOtp);
        fetchApplications();
      }
    } catch (err) {
      console.error('Application submission failed', err);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedAppCode) return;

    try {
      const res = await fetch('/api/pipeline/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode: submittedAppCode,
          otp: enteredOtp,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        fetchApplications();
      } else {
        alert(data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      console.error('OTP verification failed', err);
    }
  };

  // Track Application Search
  const handleTrackSearch = async (codeToSearch?: string) => {
    const code = codeToSearch || trackQueryCode;
    if (!code) return;

    setTrackError(null);
    try {
      const res = await fetch(`/api/pipeline/track/${encodeURIComponent(code.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setTrackedRecord(data);
      } else {
        setTrackedRecord(null);
        setTrackError('No application found with that reference code. Check code format (e.g. ARAB-2026-8812).');
      }
    } catch (err) {
      setTrackError('Could not reach tracking service.');
    }
  };

  // Admin Pipeline Action
  const handlePipelineAction = async (trackingCode: string, action: string) => {
    try {
      const res = await fetch('/api/pipeline/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode,
          action,
          notes: reviewNote || 'Approved via Council Portal Review.',
        }),
      });

      if (res.ok) {
        setActionSuccess(`Application ${trackingCode} successfully updated to: ${action}`);
        setReviewNote('');
        fetchApplications();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to execute pipeline action', err);
    }
  };

  const isPrivileged = currentRole === 'Leader' || currentRole === 'Secretary' || currentRole === 'Admin';

  const filteredPipeline = pipelineList.filter(item => {
    if (filterSection === 'All') return true;
    return item.allocatedSection === filterSection;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Arabiyya Rover Network &bull; Onboarding Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Intelligent Member Pipeline
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Automated applicant intake featuring real-time age dynamic allocation, 2FA OTP identity verification, and council review workflows.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'apply' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Apply Online
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Track Status
          </button>
          {isPrivileged && (
            <button
              onClick={() => setActiveTab('adminReview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'adminReview' ? 'bg-maroon-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Council Review</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                {pipelineList.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Apply Online with Dynamic Age Allocation */}
      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            
            {!submittedAppCode ? (
              <form onSubmit={handleApplySubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Arabiyya Rover Network Application Form</h3>
                  <p className="text-xs text-slate-500">Provide your date of birth for automated section placement.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Zaid Al-Harbi"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth (Real-time Age Allocation) *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Real-time Dynamic Section Allocation Indicator */}
                {calculatedAge !== null && allocatedSection && (
                  <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    allocatedSection === 'Explorer'
                      ? 'bg-skyrover-50 border-skyrover-200 text-skyrover-950'
                      : allocatedSection === 'Rover'
                      ? 'bg-rose-50 border-rose-200 text-maroon-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Dynamic Section Allocation: {allocatedSection} Section</span>
                      </div>
                      <p className="text-xs opacity-90">
                        Applicant Age: <strong className="font-mono">{calculatedAge} Years</strong>. Assigned to {
                          allocatedSection === 'Explorer' ? 'Explorer Unit (<18 yrs)' :
                          allocatedSection === 'Rover' ? 'Rover Scout Crew (18–26 yrs)' :
                          'Leader & Advisor Cadre (>26 yrs)'
                        }.
                      </p>
                    </div>

                    <span className="font-mono font-bold text-xs uppercase px-2.5 py-1 rounded bg-white border border-slate-200 shadow-2xs">
                      {allocatedSection}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="scout.candidate@gmail.com"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telegram Username (for 2FA OTP & Bot Dispatch)
                    </label>
                    <input
                      type="text"
                      value={telegramHandle}
                      onChange={e => setTelegramHandle(e.target.value)}
                      placeholder="@username_scout"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group (Medical Profile)</label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Scouting Experience / Motivation</label>
                  <textarea
                    rows={2}
                    value={scoutBackground}
                    onChange={e => setScoutBackground(e.target.value)}
                    placeholder="e.g. Former Scout Troop leader, interested in mountain expeditions and community service..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Submit & Request 2FA OTP Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : !otpVerified ? (
              /* OTP Verification Step */
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-skyrover-50 text-skyrover-600 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Two-Factor OTP Verification</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    A 6-digit confirmation code was dispatched to your Telegram handle and email to secure your application tracking record.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
                  <div className="text-slate-500">Tracking Reference: <strong className="text-slate-800">{submittedAppCode}</strong></div>
                  <div className="text-slate-500">Simulated 2FA Code (Demo bypass): <strong className="text-maroon-800 font-bold">{simulatedOtp}</strong> (or 123456)</div>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-Digit Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={enteredOtp}
                      onChange={e => setEnteredOtp(e.target.value)}
                      placeholder="••••••"
                      className="w-full text-center tracking-widest text-lg font-mono font-bold px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors"
                  >
                    Verify 2FA OTP & Confirm Application
                  </button>
                </form>
              </div>
            ) : (
              /* Success confirmation */
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Application Submitted to Arabiyya Rover Council</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your profile has been queued for Council Review under the <strong className="text-navy-900">{allocatedSection} Section</strong>. Keep your tracking reference safe.
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-xs mx-auto">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Your Public Tracking Code</span>
                  <span className="font-mono text-base font-extrabold text-maroon-900 tracking-widest">{submittedAppCode}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setTrackQueryCode(submittedAppCode);
                      handleTrackSearch(submittedAppCode);
                      setActiveTab('track');
                    }}
                    className="px-5 py-2 text-xs font-semibold text-navy-900 bg-skyrover-100 hover:bg-skyrover-200 rounded-xl transition-colors"
                  >
                    View Status in Application Tracker &rarr;
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Pipeline Architecture Explanation */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-maroon-800" />
                <span>Intelligent Age Classification Rules</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-skyrover-50/70 border border-skyrover-200 space-y-1">
                  <div className="font-bold text-skyrover-900">Explorer Section (&lt;18 Years)</div>
                  <p className="text-[11px] leading-relaxed">
                    Designed for senior youth transitions. Focuses on outdoor exploration, trail fundamentals, and mentorship under senior Rovers.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="font-bold text-maroon-900">Rover Scout Section (18–26 Years)</div>
                  <p className="text-[11px] leading-relaxed">
                    Core collegiate and young adult branch. Self-governing crews advancing toward the Baden-Powell Award and community service projects.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Leader & Advisor Cadre (&gt;26 Years)</div>
                  <p className="text-[11px] leading-relaxed">
                    Adult mentorship, Wood Badge trainers, wilderness medicine advisors, and council executive governance.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy-950 to-slate-900 text-white p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-skyrover-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Telegram & Email 2FA Security</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All public status queries and application edits require single-use OTP validation, preventing unauthorized surveillance of scout applicant personal records.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Public Application Status Tracker */}
      {activeTab === 'track' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            
            <div>
              <h3 className="text-sm font-bold text-slate-900">Public Application Status Tracker</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enter your unique tracking code provided during onboarding.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={trackQueryCode}
                onChange={e => setTrackQueryCode(e.target.value)}
                placeholder="e.g. ARAB-2026-8812"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono uppercase"
              />
              <button
                onClick={() => handleTrackSearch()}
                className="px-5 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-xs transition-colors shrink-0"
              >
                Query Status
              </button>
            </div>

            {trackError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {/* Stepper Status Visualizer */}
            {trackedRecord && (
              <div className="pt-4 border-t border-slate-100 space-y-6 animate-in fade-in">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{trackedRecord.name}</h4>
                    <span className="text-xs text-slate-500 font-mono">Reference: {trackedRecord.trackingCode}</span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    trackedRecord.status === 'approved' || trackedRecord.status === 'investiture_ready'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : trackedRecord.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {trackedRecord.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Visual Pipeline Progression Steps */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pipeline Progression Milestones
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="space-y-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-800 block">1. Submitted</span>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                        trackedRecord.status !== 'submitted'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {trackedRecord.status !== 'submitted' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <span className="font-semibold text-slate-800 block">2. Interview</span>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                        trackedRecord.status === 'approved' || trackedRecord.status === 'investiture_ready'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {trackedRecord.status === 'approved' || trackedRecord.status === 'investiture_ready' ? <Check className="w-4 h-4" /> : '3'}
                      </div>
                      <span className="font-semibold text-slate-800 block">3. Council Approval</span>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                        trackedRecord.status === 'investiture_ready'
                          ? 'bg-maroon-900 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {trackedRecord.status === 'investiture_ready' ? <Check className="w-4 h-4" /> : '4'}
                      </div>
                      <span className="font-semibold text-slate-800 block">4. Investiture Ready</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-semibold text-slate-800">Council Notes & Next Instructions:</div>
                  <p className="text-slate-600 leading-relaxed">
                    {trackedRecord.notes || 'Your application is currently under preliminary review by the district crew leader panel.'}
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Tab 3: Council Review (Privileged Roles Only) */}
      {activeTab === 'adminReview' && isPrivileged && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Council Intake Queue ({pipelineList.length} Applicants)</h3>
              <p className="text-xs text-slate-500">Review candidate dossiers, schedule interviews, and ratify admission.</p>
            </div>

            {/* Filter by Section */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['All', 'Explorer', 'Rover', 'Leader'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterSection === sec ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {actionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              {actionSuccess}
            </div>
          )}

          <div className="space-y-4">
            {filteredPipeline.map(item => (
              <div
                key={item.trackingCode}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                    <span className="font-mono text-xs text-slate-400">({item.trackingCode})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                      item.allocatedSection === 'Explorer'
                        ? 'bg-skyrover-100 text-skyrover-800'
                        : item.allocatedSection === 'Rover'
                        ? 'bg-rose-100 text-maroon-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {item.allocatedSection} ({item.calculatedAge}y)
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Email: {item.email}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>Phone: {item.phone}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>Blood: <strong className="text-rose-700">{item.bloodGroup}</strong></span>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    Background: {item.scoutBackground}
                  </p>

                  {item.notes && (
                    <div className="text-[11px] text-navy-800 bg-white p-2 rounded border border-slate-200">
                      Council Note: {item.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePipelineAction(item.trackingCode, 'schedule_interview')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    Schedule Interview
                  </button>

                  <button
                    onClick={() => handlePipelineAction(item.trackingCode, 'approve')}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handlePipelineAction(item.trackingCode, 'investiture_ready')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg transition-colors shadow-2xs"
                  >
                    Investiture Ready
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
