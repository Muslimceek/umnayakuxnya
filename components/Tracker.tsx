import React, { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Droplets, Flame, Activity, Plus, Info, X, Scale, Smile, Frown, Meh, Zap, Coffee, Utensils, Moon, Sun, ChevronRight, Edit2 } from 'lucide-react';
import { TrackerData, DailyStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

// Hardcoded history for demo visualization
const historicalData: TrackerData[] = [
  { day: 'Mon', water: 1.5, calories: 1800, weight: 64.5 },
  { day: 'Tue', water: 2.0, calories: 1950, weight: 64.4 },
  { day: 'Wed', water: 1.8, calories: 1700, weight: 64.3 },
  { day: 'Thu', water: 2.2, calories: 2100, weight: 64.5 },
  { day: 'Fri', water: 1.6, calories: 1600, weight: 64.2 },
  { day: 'Sat', water: 2.5, calories: 2300, weight: 64.1 },
  { day: 'Sun', water: 2.0, calories: 1900, weight: 64.0 },
];

const Tracker: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useUser();
  const [activeInfo, setActiveInfo] = useState<'hydration' | 'calories' | null>(null);
  const [showMealModal, setShowMealModal] = useState(false);
  
  // Meal Form
  const [mealType, setMealType] = useState('Lunch');
  const [mealCals, setMealCals] = useState('');

  const stats = user.dailyStats;
  const waterPercentage = Math.min((stats.waterMl / stats.waterGoalMl) * 100, 100);
  const caloriePercentage = Math.min((stats.calories / stats.caloriesGoal) * 100, 100);

  const handleAddWater = (amount: number) => {
    updateUser({
      dailyStats: {
        ...stats,
        waterMl: stats.waterMl + amount
      }
    });
  };

  const handleLogMeal = () => {
    if(!mealCals) return;
    const cals = parseInt(mealCals);
    updateUser({
      dailyStats: {
        ...stats,
        calories: stats.calories + cals
      }
    });
    setMealCals('');
    setShowMealModal(false);
  };
  
  const updateMood = (mood: DailyStats['mood']) => {
    updateUser({
      dailyStats: { ...stats, mood }
    });
  };

  const getMoodIcon = (mood: string) => {
    switch(mood) {
        case 'great': return <Zap className="text-amber-400" fill="currentColor" />;
        case 'good': return <Smile className="text-emerald-400" fill="currentColor" />;
        case 'okay': return <Meh className="text-blue-400" fill="currentColor" />;
        case 'tired': return <Moon className="text-indigo-400" fill="currentColor" />;
        case 'stressed': return <Frown className="text-rose-400" fill="currentColor" />;
        default: return <Smile />;
    }
  };

  const moodOptions: { key: DailyStats['mood'], label: string }[] = [
     { key: 'great', label: t('mood_great') },
     { key: 'good', label: t('mood_good') },
     { key: 'okay', label: t('mood_okay') },
     { key: 'tired', label: t('mood_tired') },
     { key: 'stressed', label: t('mood_stressed') },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">{t('tracker_title')}</h2>
          <p className="text-stone-400 text-xs mt-0.5">{t('tracker_subtitle')}</p>
        </div>
        {user.subscription.plan === 'premium' && (
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
            PRO
          </div>
        )}
      </div>

      {/* Main Stats - Vertical Stack */}
      <div className="space-y-3 mb-6">
        
        {/* Hydration Card - Compact */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-400 to-cyan-400 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Droplets size={16} />
              </div>
              <p className="font-bold text-sm">{t('tracker_hydration')}</p>
            </div>
            <button 
              onClick={() => setActiveInfo('hydration')}
              className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm flex items-center justify-center active:scale-95"
            >
              <Info size={14} />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-1 mb-1">
                 <h3 className="text-4xl font-bold">{(stats.waterMl / 1000).toFixed(1)}</h3>
                 <span className="text-lg font-medium opacity-80">L</span>
            </div>
            <p className="text-xs text-white/80 font-medium flex items-center gap-2">
                 Goal: {(stats.waterGoalMl / 1000).toFixed(1)} L
                 {stats.waterMl >= stats.waterGoalMl && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">🎉</span>}
            </p>
          </div>

          {/* Progress Ring */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden mb-4">
            <div 
              className="absolute inset-0 bg-white rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${waterPercentage}%` }}
            />
          </div>

          {/* Quick Add */}
          <div className="flex gap-2">
             <button onClick={() => handleAddWater(250)} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl py-2 text-xs font-bold transition active:scale-95">
                +250ml
             </button>
             <button onClick={() => handleAddWater(500)} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl py-2 text-xs font-bold transition active:scale-95">
                +500ml
             </button>
          </div>
        </div>

        {/* Calories Card - Compact */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-400 to-orange-400 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Flame size={16} />
              </div>
              <p className="font-bold text-sm">{t('tracker_calories')}</p>
            </div>
            <button 
              onClick={() => setActiveInfo('calories')}
              className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm flex items-center justify-center active:scale-95"
            >
              <Info size={14} />
            </button>
          </div>

          <div className="mb-4">
             <div className="flex items-baseline gap-1 mb-1">
                 <h3 className="text-4xl font-bold">{stats.calories}</h3>
                 <span className="text-lg font-medium opacity-80">kcal</span>
            </div>
             <p className="text-xs text-white/80 font-medium">
                Goal: {stats.caloriesGoal} kcal
             </p>
          </div>

          {/* Progress Ring */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden mb-4">
             <div 
               className="absolute inset-0 bg-white rounded-full transition-all duration-1000 ease-out" 
               style={{ width: `${caloriePercentage}%` }}
             />
          </div>

          <button 
               onClick={() => setShowMealModal(true)}
               className="w-full bg-white/25 hover:bg-white/35 backdrop-blur-sm text-white py-2.5 rounded-2xl font-bold text-xs transition active:scale-95 flex items-center justify-center gap-2"
             >
               <Plus size={16} /> {t('tracker_add_meal')}
          </button>
        </div>
      </div>

      {/* Secondary Cards - Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-3 mb-6 scrollbar-hide -mx-4 px-4">
          
          {/* Weight Card - Compact */}
          <div className="min-w-[280px] bg-white rounded-3xl p-4 shadow-lg border border-stone-100">
             <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center">
                     <Scale size={16} className="text-white" />
                 </div>
                 <h4 className="font-bold text-stone-900 text-sm">{t('tracker_weight_title')}</h4>
             </div>
             
             <div className="flex items-center gap-4">
                 <div>
                     <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Current</p>
                     <p className="text-2xl font-bold text-stone-900">64.5 <span className="text-xs font-medium text-stone-400">kg</span></p>
                 </div>
                 <div className="h-10 w-px bg-stone-100"></div>
                 <div>
                     <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Goal</p>
                     <p className="text-2xl font-bold text-emerald-500">60.0 <span className="text-xs font-medium text-emerald-300">kg</span></p>
                 </div>
             </div>
          </div>

          {/* Mood Card - Compact */}
          <div className="min-w-[280px] bg-white rounded-3xl p-4 shadow-lg border border-stone-100">
             <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                     <Smile size={16} className="text-white" />
                 </div>
                 <h4 className="font-bold text-stone-900 text-sm">{t('tracker_mood_title')}</h4>
             </div>
             
             <div className="flex justify-between gap-1">
                 {moodOptions.map((m) => (
                     <button 
                        key={m.key}
                        onClick={() => updateMood(m.key)}
                        className={`flex flex-col items-center gap-1.5 transition-all p-2 rounded-2xl ${
                          stats.mood === m.key ? 'scale-105 bg-stone-50' : 'opacity-40 hover:opacity-70 hover:scale-105'
                        }`}
                     >
                         <div className="w-8 h-8 flex items-center justify-center text-lg">
                            {getMoodIcon(m.key)}
                         </div>
                         <span className="text-[9px] font-bold text-stone-500">{m.label}</span>
                     </button>
                 ))}
             </div>
          </div>
      </div>

      {/* Compact Chart */}
      <div className="bg-white p-5 rounded-3xl shadow-lg border border-stone-100 mb-6">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
            <Activity size={12} className="text-white" />
          </div>
          {t('tracker_weekly')}
        </h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fda4af" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#fda4af" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5eead4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#5eead4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              />
              <Area 
                type="monotone" 
                dataKey="calories" 
                stroke="#f43f5e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCals)" 
                name={t('tracker_cals')}
              />
              {/* Normalize water to appear on same scale for viz roughly, usually charts need dual axis but for aesthetic simplicity we keep area */}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Connected Apps Footer */}
       <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-emerald-500">
                <img src="https://api.iconify.design/logos:google-fit.svg" alt="Fit" className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{t('tracker_fit_connected')}</h4>
                <p className="text-xs text-emerald-700/70 font-medium">{t('tracker_fit_desc')}</p>
              </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></div>
       </div>

      {/* --- MODALS --- */}

      {/* Meal Entry Modal */}
      {showMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-800">{t('modal_meal_title')}</h3>
                 <button onClick={() => setShowMealModal(false)}><X size={20} className="text-slate-400" /></button>
               </div>
               
               <div className="space-y-6">
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t('modal_meal_type')}</label>
                       <div className="grid grid-cols-2 gap-2">
                           {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
                               <button 
                                 key={type}
                                 onClick={() => setMealType(type)}
                                 className={`p-3 rounded-xl text-sm font-bold border transition flex items-center justify-center gap-2 ${
                                   mealType === type 
                                   ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                   : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                                 }`}
                               >
                                  {type === 'Breakfast' && <Sun size={16}/>}
                                  {type === 'Lunch' && <Utensils size={16}/>}
                                  {type === 'Dinner' && <Moon size={16}/>}
                                  {type === 'Snack' && <Coffee size={16}/>}
                                  {t(`meal_${type.toLowerCase()}` as any)}
                               </button>
                           ))}
                       </div>
                   </div>
                   
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t('modal_meal_cals')}</label>
                       <div className="relative">
                         <input 
                           type="number"
                           value={mealCals}
                           onChange={(e) => setMealCals(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                           placeholder="0"
                           autoFocus
                         />
                         <span className="absolute right-4 top-5 text-sm font-bold text-slate-400">kcal</span>
                       </div>
                   </div>

                   <button 
                     onClick={handleLogMeal}
                     disabled={!mealCals}
                     className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none"
                   >
                     {t('modal_meal_add')}
                   </button>
               </div>
           </div>
        </div>
      )}

      {/* Info Modals */}
      {activeInfo && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl shadow-sm ${activeInfo === 'hydration' ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
                   {activeInfo === 'hydration' ? <Droplets size={32} /> : <Flame size={32} />}
                </div>
                <button onClick={() => setActiveInfo(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {activeInfo === 'hydration' ? t('info_hydration_title') : t('info_calories_title')}
              </h3>
              
              <p className="text-slate-600 leading-relaxed text-lg mb-8 font-light">
                {activeInfo === 'hydration' ? t('info_hydration_desc') : t('info_calories_desc')}
              </p>
              
              <div className="space-y-3">
                  <button className="w-full py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition">
                      {t('tracker_update_goal')}
                  </button>
                  <button 
                    onClick={() => setActiveInfo(null)}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition"
                  >
                    {t('modal_close')}
                  </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Tracker;