import React from 'react';
import { X, ShieldCheck, BookOpen, CheckCircle } from 'lucide-react';

interface OperatingPolicyModalProps {
  onClose: () => void;
  onAccept?: () => void;
}

export const OperatingPolicyModal: React.FC<OperatingPolicyModalProps> = ({ onClose, onAccept }) => {
  const policyArticles = [
    { num: '01', title: 'Adherence to the Scout Promise and Law', desc: 'Every Rover Scout must observe and actively live by the Scout Promise and the Scout Law in all public and personal conduct.' },
    { num: '02', title: 'Arabiyya Scout Movement Values', desc: 'Uphold the moral integrity, Islamic values, and civic traditions of the 1st Arabiyya Scout Group at all times.' },
    { num: '03', title: 'Crew Attendance and Expedition Quorums', desc: 'Active participation in weekly troop/crew vigils, outdoor camps, expeditions, and civic rallies is mandatory.' },
    { num: '04', title: 'Service to the Community (Motto: Service)', desc: 'Members must contribute a minimum allocation of verified community service hours per progression cycle.' },
    { num: '05', title: 'Chain of Command & Council Directives', desc: 'Respect the decisions and directives of the Arabiyya Rover Council, Crew Leaders, and Group Scout Leader (GSL).' },
    { num: '06', title: 'Uniform & Insignia Standards', desc: 'Scout uniform, neckerchief, epaulettes, and earned badges must be worn strictly in accordance with national regulations.' },
    { num: '07', title: 'Patrol System and Peer Collaboration', desc: 'Rovers operate under the democratic Patrol system, fostering shared leadership and mutual accountability.' },
    { num: '08', title: 'Safety, Triage & Wilderness Risk Management', desc: 'No expedition, hike, or camp may be undertaken without prior council risk assessment and medical clearance.' },
    { num: '09', title: 'Leave No Trace Environmental Ethics', desc: 'Absolute compliance with environmental preservation, zero littering, and fire safety during field camps.' },
    { num: '10', title: 'Digital Communications and Bot Integration', desc: 'Use official Arabiyya Telegram channels and portal logbooks respectfully without spam or harassment.' },
    { num: '11', title: 'Logbook Truthfulness and Verification', desc: 'Falsification of service hours, hike distances, or badge requirements results in immediate review and dismissal.' },
    { num: '12', title: 'President Scout and Baden-Powell Award Timelines', desc: 'Candidates pursuing PS (before 18) or BP (before 26) must maintain self-paced adherence to national syllabus deadlines.' },
    { num: '13', title: 'Confidentiality and Scout Fellowship', desc: 'Respect peer privacy, maintain trust within patrols, and foster inclusive camaraderie across all districts.' },
    { num: '14', title: 'Financial Probity and Crew Dues', desc: 'All council fees, gear levies, and expedition budgets must be accounted for with transparent receipts.' },
    { num: '15', title: 'Gear and Equipment Care', desc: 'Scout equipment, tents, pioneering spars, and communication radios must be maintained in pristine readiness.' },
    { num: '16', title: 'Alcohol, Substance and Smoking Prohibition', desc: 'Strict prohibition of tobacco, vapes, alcohol, or illicit substances at any scout function or facility.' },
    { num: '17', title: 'Disciplinary Process and Due Process', desc: 'Infractions are investigated by the Court of Honor with right of response and corrective mentorship.' },
    { num: '18', title: 'Leave of Absence and Academic Excuses', desc: 'Formal academic, medical, or family excuses must be submitted through the portal prior to roll call.' },
    { num: '19', title: 'Emergency Contact Integrity (ICE)', desc: 'Keep Next-of-Kin and emergency contact details continuously updated in the portal profile.' },
    { num: '20', title: 'Investiture and Warrant Ceremonies', desc: 'Investiture is earned through probation, vigils, and unanimous crew council vote.' },
    { num: '21', title: 'Leadership Mentorship and Succession', desc: 'Senior Rovers are obligated to mentor younger Explorer squads and patrol apprentices.' },
    { num: '22', title: 'Constitutional Ratification and Amendments', desc: 'This operating policy is ratified annually by the Arabiyya Rover Council and executive elders.' },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-maroon-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-maroon-800 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4 text-skyrover-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white uppercase">
                Official Arabiyya Rover Operating Policy
              </h3>
              <p className="text-[11px] text-slate-300">
                22 Articles of Governance &amp; Code of Scouting Honor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="p-3.5 bg-rose-50 border border-maroon-100 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-maroon-900 block text-xs">Preamble of the Arabiyya Rover Network</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                By submitting your membership enrollment in the Arabiyya Rover Scout Portal, every candidate solemnly agrees to honor and uphold each of the 22 constitutional articles outlined below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {policyArticles.map(article => (
              <div
                key={article.num}
                className="p-3 rounded-xl border border-slate-200 hover:border-maroon-300 bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-maroon-900 text-white">
                    Article {article.num}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{article.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal pl-1">
                  {article.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Arabiyya Scout Group &bull; Republic of Maldives
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
            {onAccept && (
              <button
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Agree &amp; Ratify Policy</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
