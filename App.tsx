
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, LawnState, ApplicationLog, FertilizerRecommendation } from './types';
import { DEFAULT_PROFILE } from './constants';
import { getFertilizerRecommendation, generateLawnVisualization } from './services/geminiService';
import LawnForm from './components/LawnForm';
import RecommendationCard from './components/RecommendationCard';
import LawnStats from './components/LawnStats';
import { Leaf, History, Settings, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<LawnState>(() => {
    const saved = localStorage.getItem('lawnguardian_state');
    if (saved) return JSON.parse(saved);
    return {
      profile: DEFAULT_PROFILE,
      history: [],
      recommendation: null,
      healthScore: 75,
      lawnImage: null
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'history'>('dashboard');

  useEffect(() => {
    localStorage.setItem('lawnguardian_state', JSON.stringify(state));
  }, [state]);

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    setIsLoading(true);
    try {
      const rec = await getFertilizerRecommendation(newProfile);
      setState(prev => ({
        ...prev,
        profile: newProfile,
        recommendation: rec,
      }));
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Failed to fetch recommendation", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshImage = async () => {
    setIsGeneratingImage(true);
    try {
      const img = await generateLawnVisualization(state.profile);
      if (img) {
        setState(prev => ({ ...prev, lawnImage: img }));
      }
    } catch (error) {
      console.error("Image gen failed", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleApplyFertilizer = (product: string) => {
    const newLog: ApplicationLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      productUsed: product,
      notes: "Applied according to AI schedule."
    };
    
    setState(prev => ({
      ...prev,
      history: [newLog, ...prev.history],
      healthScore: Math.min(100, prev.healthScore + 5),
      profile: { ...prev.profile, lastFertilized: newLog.date }
    }));
    
    alert("Application logged! Your lawn health score has improved. 🌱");
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <header className="py-6 flex justify-between items-center border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Leaf className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-emerald-900 leading-tight">LawnGuardian</h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Smart Care System</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-emerald-600 transition relative">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 space-y-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <LawnStats 
              score={state.healthScore} 
              historyLength={state.history.length}
              imageUrl={state.lawnImage}
              onRefreshImage={handleRefreshImage}
              isGeneratingImage={isGeneratingImage}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Current Task</h2>
                {state.recommendation ? (
                  <RecommendationCard 
                    rec={state.recommendation} 
                    onApply={handleApplyFertilizer}
                  />
                ) : (
                  <div className="bg-emerald-50 p-8 rounded-2xl border-2 border-dashed border-emerald-200 text-center space-y-4">
                    <p className="text-emerald-800 font-medium">No recommendation yet.</p>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition"
                    >
                      Configure Profile
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Next Reminder</h2>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Upcoming</p>
                      <p className="text-sm font-bold text-gray-900">
                        {state.recommendation?.nextStepDate 
                          ? new Date(state.recommendation.nextStepDate).toLocaleDateString() 
                          : 'Set schedule above'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Consistent application windows are vital. We'll remind you 24 hours before your ideal application window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">My Lawn Configuration</h2>
            <LawnForm 
              initialProfile={state.profile} 
              onSave={handleUpdateProfile}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Application History</h2>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                {state.history.length} Logs Found
              </span>
            </div>
            {state.history.length > 0 ? (
              <div className="space-y-4">
                {state.history.map((log) => (
                  <div key={log.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl text-gray-400">
                        <History size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{log.productUsed}</p>
                        <p className="text-xs text-gray-500">{new Date(log.date).toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mt-2">{log.notes}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+5 Score</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic">No history recorded yet. Complete an application to see it here.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Navigation - Bottom Bar for Mobile / Persistent */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center max-w-5xl mx-auto shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:static md:shadow-none md:border-none md:mt-auto">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 flex-1 transition ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-400'}`}
        >
          <Leaf size={20} className={activeTab === 'dashboard' ? 'fill-emerald-600/20' : ''} />
          <span className="text-[10px] font-bold uppercase">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 flex-1 transition ${activeTab === 'profile' ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-400'}`}
        >
          <Settings size={20} className={activeTab === 'profile' ? 'fill-emerald-600/20' : ''} />
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 flex-1 transition ${activeTab === 'history' ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-400'}`}
        >
          <History size={20} className={activeTab === 'history' ? 'fill-emerald-600/20' : ''} />
          <span className="text-[10px] font-bold uppercase">History</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
