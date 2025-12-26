import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { updateUser } = useUser();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Data Collection State
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);

  // 0-2: Story, 3: Name, 4: Goals, 5: Diet
  const TOTAL_STEPS = 6;

  // Modern gradient themes per step
  const getStepTheme = (s: number) => {
    const themes = [
      { bg: 'from-rose-500 via-pink-500 to-rose-600', accent: 'rose' },
      { bg: 'from-orange-500 via-amber-500 to-orange-600', accent: 'orange' },
      { bg: 'from-emerald-500 via-teal-500 to-emerald-600', accent: 'emerald' },
      { bg: 'from-violet-500 via-purple-500 to-violet-600', accent: 'violet' },
      { bg: 'from-amber-500 via-yellow-500 to-amber-600', accent: 'amber' },
      { bg: 'from-cyan-500 via-blue-500 to-cyan-600', accent: 'cyan' },
    ];
    return themes[s] || themes[0];
  };

  const handleVibrate = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const toggleGoal = (goal: string) => {
    handleVibrate();
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleDiet = (diet: string) => {
    handleVibrate();
    setSelectedDiet(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  const handleNext = () => {
    handleVibrate();
    if (step === 3 && !name.trim()) return;

    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      handleVibrate();
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const finishOnboarding = () => {
    updateUser({
      name: name || 'Guest',
      goals: selectedGoals,
      dietaryPreferences: selectedDiet,
      hasCompletedOnboarding: true
    });
    onComplete();
  };

  // --- RENDERERS ---

  const renderStoryStep = (emoji: string, title: string, sub: string) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center px-6"
    >
       <motion.div
         initial={{ scale: 0, rotate: -180 }}
         animate={{ scale: 1, rotate: 0 }}
         transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
         className="text-8xl mb-8"
       >
         {emoji}
       </motion.div>
       <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          {title}
       </h1>
       <p className="text-lg text-white/70 max-w-sm leading-relaxed">
          {sub}
       </p>
    </motion.div>
  );

  const renderNameStep = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col justify-center h-full px-6"
    >
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-4xl">
            👋
          </div>
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">
             Step {step + 1} of {TOTAL_STEPS}
          </h2>
          <h1 className="text-3xl font-bold text-white mb-2">
             {t('onb_q_name_desc')}
          </h1>
          <p className="text-white/60 text-sm">{t('onb_q_name_title')}</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-1 border border-white/20">
          <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('onb_q_name_placeholder')}
              className="w-full bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-lg text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all"
              autoFocus
          />
        </div>
    </motion.div>
  );

  const renderSelectionStep = (
    emoji: string,
    title: string, 
    desc: string, 
    options: {key: string, label: string}[], 
    selected: string[], 
    toggle: (k: string) => void
  ) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full px-6 py-8"
    >
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl">
            {emoji}
          </div>
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
              Step {step + 1} of {TOTAL_STEPS}
          </h2>
          <h1 className="text-2xl font-bold text-white mb-2">
              {title}
          </h1>
          <p className="text-white/60 text-sm">{desc}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
              {options.map((opt, idx) => {
                  const isActive = selected.includes(opt.key);
                  return (
                      <motion.button
                          key={opt.key}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => toggle(opt.key)}
                          className={`relative p-4 rounded-3xl transition-all duration-300 ${
                              isActive 
                              ? 'bg-white text-black shadow-2xl scale-105' 
                              : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
                          }`}
                      >
                          {isActive && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center"
                            >
                              <Check size={14} className="text-white" />
                            </motion.div>
                          )}
                          <span className="text-sm font-bold">{opt.label}</span>
                      </motion.button>
                  )
              })}
          </div>
        </div>
    </motion.div>
  );

  const getStepContent = () => {
      switch(step) {
          case 0: return renderStoryStep('🌟', 'Sensory Nutrition', t('onb_welcome_desc'));
          case 1: return renderStoryStep('🍳', 'Smart Kitchen', t('onb_fridge_desc'));
          case 2: return renderStoryStep('💪', 'Body & Mind', t('onb_tracker_desc'));
          case 3: return renderNameStep();
          case 4: return renderSelectionStep(
              '🎯',
              t('onb_q_goals_title'),
              t('onb_q_goals_desc'),
              [
                { key: 'Weight Loss', label: t('goal_weight') },
                { key: 'Energy', label: t('goal_energy') },
                { key: 'Save Time', label: t('goal_time') },
                { key: 'Cooking Skills', label: t('goal_skills') },
              ],
              selectedGoals,
              toggleGoal
          );
          case 5: return renderSelectionStep(
              '🥗',
              t('onb_q_diet_title'),
              t('onb_q_diet_desc'),
              [
                { key: 'None', label: t('diet_none') },
                { key: 'Vegetarian', label: t('diet_veg') },
                { key: 'Vegan', label: t('diet_vegan') },
                { key: 'Keto', label: t('diet_keto') },
                { key: 'Gluten Free', label: t('diet_gluten') },
              ],
              selectedDiet,
              toggleDiet
          );
          default: return null;
      }
  };

  const theme = getStepTheme(step);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-0 left-0 w-96 h-96 bg-gradient-to-br ${theme.bg} rounded-full blur-3xl opacity-30`}
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-violet-500 to-indigo-500 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col max-w-md mx-auto">
        
        {/* Compact Header */}
        <header className="flex justify-between items-center p-5 pb-3">
            {/* Dots Progress */}
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === step 
                      ? 'w-8 bg-white' 
                      : i < step 
                      ? 'w-1.5 bg-white/50' 
                      : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {step < 3 && (
                <button 
                    onClick={() => setStep(3)} 
                    className="text-xs font-bold text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10"
                >
                    Skip
                </button>
            )}
        </header>

        {/* Main Content with AnimatePresence */}
        <main className="flex-1 relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -100 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {getStepContent()}
              </motion.div>
            </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <footer className="p-5 pt-3 space-y-3">
            {/* Primary Action */}
            <motion.button 
                onClick={handleNext}
                disabled={step === 3 && !name.trim()}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-3xl font-bold text-base transition-all shadow-2xl ${
                    step === 3 && !name.trim() 
                      ? 'bg-white/20 text-white/40 cursor-not-allowed' 
                      : `bg-gradient-to-r ${theme.bg} text-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95`
                }`}
            >
                <span className="flex items-center justify-center gap-2">
                  {step === TOTAL_STEPS - 1 ? (
                    <>
                      <Sparkles size={18} />
                      <span>Start Journey</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </span>
            </motion.button>

            {/* Back Button */}
            {step > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handlePrev}
                className="w-full py-3 rounded-2xl font-medium text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                Back
              </motion.button>
            )}
        </footer>

      </div>
    </div>
  );
};

export default Onboarding;