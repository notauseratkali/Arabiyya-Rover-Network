import React, { useState } from 'react';
import { Book, Search, Shield, Award, Compass, FileCheck, ExternalLink } from 'lucide-react';
import { ConstitutionArticle } from '../types';

export const HandbookView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const articles: ConstitutionArticle[] = [
    {
      id: 'art-1',
      number: 'Article I',
      title: 'Name, Emblem, and Constitutional Creed',
      titleAr: 'المادة الأولى: الاسم والشعار والعقيدة الكشفية',
      category: 'Governance',
      content: 'The official entity shall be known as the Arabiyya Rover Scout Network (شبكة كشافة العربية للجوالة). The emblem incorporates the universal Scout Fleur-de-lis intertwined with the traditional reef knot and compass star, set upon rich maroon and deep navy. The constitutional motto is "Service" (الخدمة - بارد), rooted in brotherhood and selfless civic commitment.',
      subsections: [
        '1.1 Adherence to the World Scout Movement (WOSM) Constitution and Arab Scout Region charter.',
        '1.2 Sovereignty of individual Rover Crews under district guidelines.',
        '1.3 The Rover Scout Promise and Scout Law remain non-negotiable spiritual standards.',
      ]
    },
    {
      id: 'art-2',
      number: 'Article II',
      title: 'Section Demarcations & Membership Pipeline',
      titleAr: 'المادة الثانية: المراحل العمرية والتصنيف العضوي',
      category: 'Governance',
      content: 'Membership is dynamically allocated based upon the verified chronological age of the candidate at the point of digital portal intake.',
      subsections: [
        '2.1 Explorer Section (<18 years): Senior youth candidates engaging in preparatory hikes and basic pioneering.',
        '2.2 Rover Scout Section (18–26 years): Collegiate young adults forming active, self-governing crews advancing toward the Baden-Powell Award.',
        '2.3 Leader & Advisor Cadre (>26 years): Adult volunteers, Wood Badge holders, and professional advisors serving in guidance capacities.',
      ]
    },
    {
      id: 'art-3',
      number: 'Article III',
      title: 'Digital Logbook Standards & Syllabus Ratification',
      titleAr: 'المادة الثالثة: معايير سجل الأنشطة والاعتماد',
      category: 'Progression',
      content: 'Every Rover must maintain an active digital logbook verified across the three-stage SLA workflow (Draft -> Pending Review -> Verified). Entries must incorporate reflective write-ups detailing personal growth, leadership lessons, and community impact.',
      subsections: [
        '3.1 Minimum Service Hours: 100 hours of verified community service required for Baden-Powell Award consideration.',
        '3.2 The Rambler Trek: A continuous 100km self-sustained expedition executed over 4 days with zero motorized assistance.',
        '3.3 Review SLA: Crew Leaders and Council Secretaries must audit submitted logs within 7 business days.',
      ]
    },
    {
      id: 'art-4',
      number: 'Article IV',
      title: 'Outdoor Safety, Backcountry Ethics & Safe from Harm',
      titleAr: 'المادة الرابعة: السلامة الميدانية وحماية الشباب',
      category: 'Safety',
      content: 'All expeditions, desert bivouacs, and alpine scrambles must adhere to strict safety ratios (minimum 4 Rovers per backcountry team) and Leave No Trace ethics.',
      subsections: [
        '4.1 Emergency Communications: Every patrol must carry at least one verified satellite beacon or VHF HAM radio transceiver.',
        '4.2 Hydration & Thermal Protocols: Desert expeditions require minimum 4.5 liters of potable water per operative per diem.',
        '4.3 Safe from Harm Compliance: Universal background validation for all leaders with mandatory WOSM youth protection certifications.',
      ]
    },
    {
      id: 'art-5',
      number: 'Article V',
      title: 'Council Quorum, Voting Privileges & Financial Stewardship',
      titleAr: 'المادة الخامسة: نصاب المجلس وحوكمة الموارد المالية',
      category: 'Finance',
      content: 'The Arabiyya Rover Council shall convene quarterly under the chairmanship of elected Crew Leaders. Quorum requires presence of at least two-thirds of chartered crews.',
      subsections: [
        '5.1 Budget Transparency: All dues and expedition grants are audited via the federated Arabiyya Finance Portal.',
        '5.2 One Crew One Vote: Each chartered crew carries exactly one democratic vote in council general assemblies.',
        '5.3 Amendments: Constitutional amendments require a seventy-five percent supermajority vote.',
      ]
    },
  ];

  const filtered = articles.filter(art => {
    if (selectedCategory !== 'All' && art.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      (art.titleAr && art.titleAr.includes(q)) ||
      (art.content && art.content.toLowerCase().includes(q)) ||
      (art.subsections && art.subsections.some((s: string) => s.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
          Arabiyya Rover Network &bull; Constitutional Handbook
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Rover Policy & Constitution Handbook
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Searchable legal constitution and operational guidelines governing member classification, outdoor safety codes, logbook verification SLAs, and council governance.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search constitution by keyword (e.g. 'Baden-Powell', 'Service', 'Safety', 'Quorum')..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
            >
              <option value="All">All Constitutional Categories</option>
              <option value="Governance">Governance & Creed</option>
              <option value="Progression">Progression & Logbook</option>
              <option value="Safety">Safety & Backcountry</option>
              <option value="Finance">Finance & Quorum</option>
            </select>
          </div>

        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
          <span>Displaying <strong>{filtered.length}</strong> ratified constitutional articles</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-maroon-800 hover:underline font-semibold">
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {filtered.map(art => (
          <div
            key={art.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-maroon-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {art.number}
                </span>
                <h3 className="text-base font-bold text-slate-900">{art.title}</h3>
              </div>

              <div className="text-xs text-maroon-900 font-semibold font-arabic">
                {art.titleAr}
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {art.content}
            </p>

            {art.subsections && art.subsections.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Clauses & Operational Mandates
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {art.subsections.map((sub: string, sIdx: number) => (
                    <li key={sIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-skyrover-500 shrink-0 mt-1.5" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
