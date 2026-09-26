import React from 'react';
import { Award, CheckCircle2, Circle, Shield, Compass, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { RankStage, UserRole } from '../types';

interface ProgressionViewProps {
  currentRole: UserRole;
  userRank: RankStage;
  serviceHours: number;
  expeditionsCount: number;
}

export const ProgressionView: React.FC<ProgressionViewProps> = ({
  currentRole,
  userRank,
  serviceHours,
  expeditionsCount,
}) => {
  const tracks = [
    {
      id: 'square',
      name: 'Square Badge (Rover Squire & Investiture)',
      nameAr: 'شارة المربع (مرحلة الإعداد والقبول)',
      description: 'The preparatory stage where candidate Rovers study the Rover Constitution, execute the Squire Vigil, and take the Rover Scout Promise.',
      badgeColor: 'bg-amber-600',
      requirements: [
        { title: 'Rover Scout History & Constitutional Creed', completed: true },
        { title: 'Squire Solitary Vigil & Self-Assessment', completed: true },
        { title: '30 Verified Trail and Service Hours', completed: serviceHours >= 30 },
        { title: 'Formal Crew Council Investiture Ceremony', completed: userRank !== 'Rover Squire' && userRank !== 'Explorer Scout' },
      ],
    },
    {
      id: 'bp',
      name: 'Baden-Powell Award (B.P. Award)',
      nameAr: 'وسام بادن باول (المرحلة التتويجية)',
      description: 'The pinnacle award of the Rover Section representing self-reliance, high-altitude exploration, and continuous humanitarian community leadership.',
      badgeColor: 'bg-rose-900',
      requirements: [
        { title: '100+ Verified Community Service Hours', completed: serviceHours >= 100 },
        { title: 'Rambler 100km Self-Sustained Mountain Expedition', completed: expeditionsCount >= 5 },
        { title: 'Wilderness First Aid & Life Support Certification', completed: true },
        { title: 'Quarterly Project Leadership Capstone', completed: serviceHours >= 80 },
        { title: 'District Court of Honor Ratification', completed: userRank === 'Baden-Powell Awardee' || userRank === 'President Scout Awardee' },
      ],
    },
    {
      id: 'president',
      name: 'President Scout Award (وسام كشاف الرئيس)',
      nameAr: 'وسام كشاف الرئيس (الدرجة الوطنية العليا)',
      description: 'The highest supreme distinction in the Arabiyya Scout Network awarded by national decree for extraordinary national service and civic excellence.',
      badgeColor: 'bg-emerald-800',
      requirements: [
        { title: 'Baden-Powell Awardee in Active Standing', completed: userRank === 'Baden-Powell Awardee' || userRank === 'President Scout Awardee' },
        { title: 'National Disaster Preparedness or Ecological Stewardship Deployment', completed: true },
        { title: 'Mentorship of an Explorer Patrol or Junior Rover Crew for 1 Year', completed: true },
        { title: 'International Moot or Diplomatic Scout Delegation Representation', completed: userRank === 'President Scout Awardee' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
          Arabiyya Rover Network &bull; Syllabus Governance
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Scouting Progression & Milestone Framework
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Standardized progression tracking aligning the Arabiyya Rover Section with WOSM youth program milestones from initial Squire Investiture to the President Scout Award.
        </p>
      </div>

      {/* Progression Tracks Grid */}
      <div className="space-y-6">
        {tracks.map((track, idx) => (
          <div
            key={track.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${track.badgeColor} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                  <Award className="w-5 h-5 text-skyrover-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{track.name}</h3>
                  <div className="text-xs text-maroon-800 font-medium font-arabic">{track.nameAr}</div>
                </div>
              </div>

              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                Track 0{idx + 1}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {track.description}
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {track.requirements.map((req, rIdx) => (
                <div
                  key={rIdx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    req.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-medium">{req.title}</span>
                  {req.completed ? (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                      <Circle className="w-3 h-3 text-slate-300" />
                      <span>In Progress</span>
                    </span>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
