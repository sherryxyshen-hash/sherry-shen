
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BADGES } from '../constants';
import { Award, Camera } from 'lucide-react';

interface Props {
  score: number;
  historyLength: number;
  imageUrl: string | null;
  onRefreshImage: () => void;
  isGeneratingImage: boolean;
}

const LawnStats: React.FC<Props> = ({ score, historyLength, imageUrl, onRefreshImage, isGeneratingImage }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const COLORS = ['#059669', '#e2e8f0'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Health Score Gauge */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 flex flex-col items-center justify-center">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Lawn Health Score</h3>
        <div className="h-40 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
            <span className="text-4xl font-black text-emerald-900">{score}</span>
            <span className="text-xs text-emerald-600 font-medium">Optimal Status</span>
          </div>
        </div>
      </div>

      {/* Visual State / AI Image */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden lg:col-span-2 relative">
        {imageUrl ? (
          <div className="relative h-full min-h-[200px]">
            <img src={imageUrl} alt="Lawn Visualization" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div className="flex-1">
                <p className="text-white font-bold text-lg">AI Vision Goal</p>
                <p className="text-emerald-100 text-xs">A visual representation of your lawn's potential</p>
              </div>
              <button 
                onClick={onRefreshImage}
                disabled={isGeneratingImage}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition"
              >
                <Camera size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <Camera className="text-emerald-600" size={32} />
            </div>
            <div>
              <p className="text-gray-900 font-bold">Generate Visual Rewards</p>
              <p className="text-sm text-gray-500">Update your profile to see an AI vision of your healthy lawn</p>
            </div>
            <button
              onClick={onRefreshImage}
              disabled={isGeneratingImage}
              className="px-6 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition"
            >
              {isGeneratingImage ? 'Generating...' : 'Generate Goal Image'}
            </button>
          </div>
        )}
      </div>

      {/* Badges/Rewards */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 lg:col-span-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award size={18} className="text-amber-500" />
          Unlocked Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = (badge.id === 'first_step' && historyLength > 0) || 
                              (badge.id === 'green_thumb' && score >= 90) ||
                              (badge.id === 'consistency_king' && historyLength >= 3);
            
            return (
              <div 
                key={badge.id} 
                className={`p-4 rounded-xl border flex flex-col items-center text-center transition ${isUnlocked ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 grayscale'}`}
              >
                <span className="text-3xl mb-2">{badge.icon}</span>
                <p className="text-sm font-bold text-gray-900">{badge.name}</p>
                <p className="text-[10px] text-gray-500 leading-tight mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LawnStats;
