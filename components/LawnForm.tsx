
import React, { useState } from 'react';
import { GrassType, SoilType, LawnCondition, UserProfile } from '../types';
import { MapPin, Info } from 'lucide-react';

interface Props {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isLoading: boolean;
}

const LawnForm: React.FC<Props> = ({ initialProfile, onSave, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [locating, setLocating] = useState(false);

  const handleGetLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile({
          ...profile,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("Couldn't retrieve location. Recommendations will be less specific.");
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-emerald-900">Lawn Profile</h3>
        <button
          type="button"
          onClick={handleGetLocation}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition ${profile.location ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
        >
          <MapPin size={16} />
          {locating ? 'Locating...' : profile.location ? 'Location Set' : 'Get My Location'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grass Type</label>
          <select
            value={profile.grassType}
            onChange={(e) => setProfile({ ...profile, grassType: e.target.value as GrassType })}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {Object.values(GrassType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
          <select
            value={profile.soilType}
            onChange={(e) => setProfile({ ...profile, soilType: e.target.value as SoilType })}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {Object.values(SoilType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Condition</label>
          <select
            value={profile.condition}
            onChange={(e) => setProfile({ ...profile, condition: e.target.value as LawnCondition })}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {Object.values(LawnCondition).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-emerald-50 p-4 rounded-xl flex gap-3 items-start">
        <Info className="text-emerald-600 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-emerald-800 leading-relaxed">
          Accurate data helps our AI provide the best N-P-K ratios and timing for your specific climate zone.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-200 disabled:opacity-50"
      >
        {isLoading ? 'Analyzing...' : 'Generate AI Recommendation'}
      </button>
    </form>
  );
};

export default LawnForm;
