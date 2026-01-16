
import React from 'react';
import { FertilizerRecommendation } from '../types';
import { Calendar, Droplets, Leaf, ShieldAlert } from 'lucide-react';

interface Props {
  rec: FertilizerRecommendation;
  onApply: (productName: string) => void;
}

const RecommendationCard: React.FC<Props> = ({ rec, onApply }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden animate-fade-in">
      <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
        <div>
          <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Top Recommendation</p>
          <h2 className="text-xl font-bold">{rec.productName}</h2>
        </div>
        <div className="bg-emerald-500 px-3 py-1 rounded-full text-sm font-bold border border-emerald-400">
          Ratio: {rec.npkRatio}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-emerald-600 mt-1" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Ideal Window</p>
                <p className="text-sm text-gray-600">{rec.timing}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Droplets className="text-emerald-600 mt-1" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Application Rate</p>
                <p className="text-sm text-gray-600">{rec.applicationRate}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Leaf size={16} className="text-emerald-600" />
              Expert Reasoning
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed italic">
              "{rec.reasoning}"
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-gray-800 mb-3">Best Practices for Sustainability</h4>
          <ul className="space-y-2">
            {rec.bestPractices.map((bp, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {bp}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 items-center">
          <ShieldAlert className="text-amber-500" size={18} />
          <p className="text-xs text-amber-800 font-medium">
            Always check local ordinances for fertilizer blackout dates in your region.
          </p>
        </div>

        <button
          onClick={() => onApply(rec.productName)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition transform active:scale-[0.98]"
        >
          Mark as Applied Today
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
