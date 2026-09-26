import React, { useState } from 'react';
import { X, User, Phone, Droplets, Shield, Sparkles } from 'lucide-react';
import { RoverMember } from '../types';

interface EditProfileModalProps {
  member: RoverMember;
  onClose: () => void;
  onSave: (updated: RoverMember) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ member, onClose, onSave }) => {
  const [bio, setBio] = useState(member.bio);
  const [phone, setPhone] = useState(member.phone);
  const [bloodGroup, setBloodGroup] = useState(member.bloodGroup);
  const [skillsText, setSkillsText] = useState(member.skills.join(', '));
  const [iceName, setIceName] = useState(member.emergencyContact.name);
  const [iceRelation, setIceRelation] = useState(member.emergencyContact.relation);
  const [icePhone, setIcePhone] = useState(member.emergencyContact.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updated: RoverMember = {
      ...member,
      bio: bio.trim(),
      phone: phone.trim(),
      bloodGroup: bloodGroup.trim(),
      skills: skills.length > 0 ? skills : member.skills,
      emergencyContact: {
        name: iceName.trim(),
        relation: iceRelation.trim(),
        phone: icePhone.trim(),
      },
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-maroon-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-skyrover-300" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Update Member Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Rover Biography & Scouting Purpose
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell other Rovers about your experience, interests, and community goals..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono text-xs"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Blood Group (Field Safety)
              </label>
              <div className="relative">
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
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
                <Droplets className="w-3.5 h-3.5 text-rose-500 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Skills & Scouting Specializations (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
              placeholder="e.g. Wilderness First Aid, Knotcraft, Topo Mapping, HAM Radio"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Shown to crew leaders when coordinating community projects and service taskforces.
            </span>
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-700" />
              <span>Emergency In-Case-of-Emergency (ICE) Contact</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={iceName}
                  onChange={e => setIceName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  value={iceRelation}
                  onChange={e => setIceRelation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Emergency Phone</label>
                <input
                  type="text"
                  required
                  value={icePhone}
                  onChange={e => setIcePhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-maroon-900 hover:bg-maroon-800 rounded-lg shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
