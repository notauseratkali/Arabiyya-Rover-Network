import React, { useState } from 'react';
import { Compass, User, Mail, Lock, Phone, Droplets, MapPin, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RoverMember, RoverCrew, RoverRole, RankStage, ActiveTab } from '../types';

interface SignUpPageProps {
  crews: RoverCrew[];
  onSignUpSuccess: (newMember: RoverMember) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  crews,
  onSignUpSuccess,
  setActiveTab,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [crewId, setCrewId] = useState(crews[0]?.id || 'CREW-01');
  const [role, setRole] = useState<RoverRole>('Rover Scout');
  const [rankStage, setRankStage] = useState<RankStage>('Rover Squire');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('Wilderness Navigation, Campcraft, First Aid');
  
  // Emergency contact
  const [iceName, setIceName] = useState('');
  const [iceRelation, setIceRelation] = useState('Parent');
  const [icePhone, setIcePhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedCrew = crews.find(c => c.id === crewId) || crews[0];
    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Random avatar selection for clean mockup
    const randomAvatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=300&auto=format&fit=crop&q=80`;

    const newMemberId = `ROV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMember: RoverMember = {
      id: newMemberId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || 'password123',
      role,
      crewId: selectedCrew.id,
      crewName: selectedCrew.name,
      unitDistrict: selectedCrew.district,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      bio: bio.trim() || 'New Rover Scout enrolled in the network. Eager to take on community service and scout leadership.',
      phone: phone.trim() || '+1 (555) 000-0000',
      bloodGroup,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rankStage,
      totalServiceHours: 0,
      badgesCount: 1,
      emergencyContact: {
        name: iceName.trim() || 'Primary Guardian',
        relation: iceRelation.trim() || 'Guardian',
        phone: icePhone.trim() || '+1 (555) 000-0000',
      },
      skills: skills.length > 0 ? skills : ['Campcraft', 'First Aid'],
      badges: [
        {
          id: `b-init-${Date.now()}`,
          name: 'Rover Squire Enrollment',
          category: 'Leadership',
          description: 'Official registration in the Rover Scout Network.',
          status: 'completed',
          dateEarned: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        },
      ],
      recentActivities: [
        {
          id: `act-init-${Date.now()}`,
          title: 'Rover Network Orientation & Account Setup',
          type: 'Training',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          hours: 2,
          location: selectedCrew.name,
          verified: true,
          notes: 'Completed digital registration and credential generation.',
        },
      ],
    };

    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess(newMember);
    }, 400);
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-maroon-900 items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6 text-skyrover-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Enroll in a Rover Crew
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Create your Rover Scout profile to access the member portal, track service hours, and receive your verified Digital ID credential.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Account Credentials */}
            <div>
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-maroon-800" />
                <span>1. Personal & Account Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jordan Martinez"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jordan.scout@network.org"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Crew & Rank Affiliation */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-skyrover-600" />
                <span>2. Crew Affiliation & Scouting Rank</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Crew *</label>
                  <select
                    value={crewId}
                    onChange={e => setCrewId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
                  >
                    {crews.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as RoverRole)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
                  >
                    <option value="Rover Scout">Rover Scout</option>
                    <option value="Rover Squire">Rover Squire (Candidate)</option>
                    <option value="Senior Rover">Senior Rover</option>
                    <option value="Crew Leader">Crew Leader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rank Stage</label>
                  <select
                    value={rankStage}
                    onChange={e => setRankStage(e.target.value as RankStage)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
                  >
                    <option value="Rover Squire">Rover Squire</option>
                    <option value="Stage 1 - Membership">Stage 1 - Membership</option>
                    <option value="Stage 2 - Training">Stage 2 - Training</option>
                    <option value="Stage 3 - Service">Stage 3 - Service</option>
                    <option value="B.P. Award Candidate">B.P. Award Candidate</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Scouting Statement / Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share your background, service goals, or community projects you want to lead..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>
            </div>

            {/* Field Safety & ICE */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-700" />
                <span>3. Field Safety & Emergency Contact (ICE)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={iceName}
                    onChange={e => setIceName(e.target.value)}
                    placeholder="e.g. Maria Martinez"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship *</label>
                  <input
                    type="text"
                    required
                    value={iceRelation}
                    onChange={e => setIceRelation(e.target.value)}
                    placeholder="e.g. Mother / Spouse"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone *</label>
                  <input
                    type="tel"
                    required
                    value={icePhone}
                    onChange={e => setIcePhone(e.target.value)}
                    placeholder="+1 (555) 999-8888"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Already registered? <span className="font-bold text-maroon-900 underline">Log in instead</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Rover Profile...' : 'Complete Registration & Open Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
