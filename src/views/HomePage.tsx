import React from 'react';
import { Compass, Users, Heart, Award, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { RoverCrew, RoverMember, ActiveTab } from '../types';
import { ASSETS } from '../data/mockData';

interface HomePageProps {
  crews: RoverCrew[];
  members: RoverMember[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectMember: (member: RoverMember) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  crews,
  members,
  setActiveTab,
  onSelectMember,
}) => {
  // Aggregate real stats
  const totalServiceHours = members.reduce((sum, m) => sum + (m.totalServiceHours || 0), 0);
  const totalBadges = members.reduce((sum, m) => sum + (m.badges?.length || 0), 0);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-maroon-100 text-maroon-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-maroon-700 animate-pulse" />
                <span>Open Rover Scout Network &bull; Ages 18–26</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Service, Leadership, and Fellowship for Rover Crews
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                The centralized membership portal and crew management platform for the Rover Scout Network. Track your service hours, manage crew credentials, and advance toward the Baden-Powell Award.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('signup')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-md transition-all flex items-center gap-2 group"
                >
                  <span>Join a Rover Crew</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setActiveTab('login')}
                  className="px-5 py-3 text-sm font-semibold text-navy-900 hover:text-navy-950 bg-skyrover-50 hover:bg-skyrover-100 border border-skyrover-200 rounded-xl transition-all"
                >
                  Access Member Portal
                </button>
              </div>

              {/* Subtle Value Props */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Chartered Rover Crews</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-skyrover-600" />
                  <span>Verified Service Logbooks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-maroon-800" />
                  <span>Digital Member ID Pass</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-slate-100">
                <img
                  src={ASSETS.crewService}
                  alt="Rover Scouts engaged in community service"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Clean gradient scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-skyrover-300">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Community Civic Action</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Apex Pioneer, High Sierra & Coastal Horizon Units in service to society
                  </p>
                </div>
              </div>

              {/* Float Card Indicator */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:-left-6 bg-white p-3.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-maroon-900 text-white flex items-center justify-center font-bold text-sm">
                  BP
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">Motto in Action</div>
                  <div className="text-xs font-bold text-slate-900">&quot;Service to Others&quot;</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Quantitative Rigor Stats Row */}
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-200/80">
              <div className="px-2">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-navy-900 tabular-nums">
                  {crews.length}
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                  Chartered Rover Crews
                </div>
              </div>

              <div className="px-2">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-maroon-900 tabular-nums">
                  {members.length}+
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                  Enrolled Rover Scouts
                </div>
              </div>

              <div className="px-2">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-skyrover-600 tabular-nums">
                  {totalServiceHours}
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                  Verified Service Hours
                </div>
              </div>

              <div className="px-2">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums">
                  {totalBadges}
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                  Badges & Certifications
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Featured Rover Crews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Chartered Units
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Featuring the Rover Crews
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Rover Crews are self-governing units led by Crew Leaders and guided by Rover Scout Leaders. Each crew focuses on specialized community service initiatives and fellowship.
          </p>
        </div>

        {/* Rover Crews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {crews.map(crew => (
            <div
              key={crew.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Crew Photo Banner */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={crew.bannerImage}
                  alt={crew.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] text-skyrover-300 font-medium">{crew.district}</div>
                  <h3 className="text-base font-bold text-white leading-snug">{crew.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs italic text-maroon-900 font-medium">
                    &ldquo;{crew.motto}&rdquo;
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {crew.description}
                  </p>

                  {/* Active Projects */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Key Initiatives
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {crew.activeProjects.slice(0, 2).map((proj, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-skyrover-500 shrink-0" />
                          <span className="truncate">{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer with Leader Info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={crew.leaderAvatar}
                      alt={crew.leaderName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-[11px] leading-tight">
                      <div className="font-semibold text-slate-800">{crew.leaderName}</div>
                      <div className="text-slate-400">Crew Leader</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {crew.memberCount} Rovers
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>
      </section>

      {/* The Rover Pillars */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
              Scouting Ethos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Core Pillars of the Rover Section
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed by Robert Baden-Powell for young adults seeking purposeful civic contribution and lifelong fellowship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-maroon-100 flex items-center justify-center text-maroon-800">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Civic Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Rover motto is <em className="font-medium">Service</em>. Rovers lead environmental restoration, disaster preparedness, youth mentorship, and volunteer emergency medical assistance in their communities.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-skyrover-50 border border-skyrover-100 flex items-center justify-center text-skyrover-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Crew Fellowship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rovers form self-governing crews where every member contributes to group projects, self-development, and mutual brotherhood across backgrounds.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-navy-100 flex items-center justify-center text-navy-900">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Leadership Progression</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidates progress through Squire Vigil, Rover Scout investiture, and project execution culminating in the prestigious Baden-Powell Award.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Member Profiles Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            Network Members
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Featured Member Profiles
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Meet active Rovers from our network. Click any member to view their scouting profile, badges, and verified service record.
          </p>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {members.slice(0, 4).map(member => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-maroon-700/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{member.name}</h3>
                    <p className="text-[11px] font-semibold text-maroon-800">{member.role}</p>
                    <p className="text-[10px] text-slate-500 truncate">{member.crewName}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Rank</span>
                    <span className="font-semibold text-slate-700 text-[11px] truncate block">
                      {member.rankStage.replace('Stage ', 'St. ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Service</span>
                    <span className="font-semibold text-navy-800 text-[11px] font-mono tabular-nums">
                      {member.totalServiceHours} hrs
                    </span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {member.skills.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[120px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-maroon-900 font-semibold">
                <span>View Full Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-maroon-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-skyrover-300">
              Get Involved in Rovering
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to embark on lifelong community service & youth leadership?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you are an invested scout transitioning from Senior Scouts or new to the Scout Movement, our Rover Crews welcome young adults ready to make a tangible difference.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('signup')}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-navy-950 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-sm"
              >
                Create Rover Account
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-700 border border-maroon-700 rounded-xl transition-colors"
              >
                Portal Member Login
              </button>
            </div>
          </div>

          {/* Decorative Insignia backdrop */}
          <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden md:block">
            <img 
              src={ASSETS.roverCrest} 
              alt="Rover Insignia" 
              className="w-80 h-80 object-contain"
            />
          </div>

        </div>
      </section>

    </div>
  );
};
