import React, { useState, useEffect } from 'react';
import { User, Snowflake, Activity, Package } from 'lucide-react';
import Profile from './components/Profile';
import SmartFridge from './components/SmartFridge';
import Tracker from './components/Tracker';
import PantryScreen from './components/PantryScreen';
import AIChefChat from './components/AIChefChat';
import Onboarding from './components/Onboarding';
import { ViewState } from './types';
import { useLanguage } from './contexts/LanguageContext';
import { UserProvider, useUser } from './contexts/UserContext';

const AppContent = () => {
  const { t } = useLanguage();
  const { user, updateUser, isLoading } = useUser();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.SMART_FRIDGE);
  
  // State for transferring ingredients from Pantry to Fridge
  const [transferIngredients, setTransferIngredients] = useState<string[]>([]);
  
  // Ensure we are mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || isLoading) {
    return (
        <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin"></div>
                <p className="text-rose-400 font-brutal font-bold text-sm uppercase tracking-widest animate-pulse">Loading Experience...</p>
            </div>
        </div>
    );
  }

  // Show Onboarding if user hasn't completed it
  if (!user.hasCompletedOnboarding) {
    return <Onboarding onComplete={() => updateUser({ hasCompletedOnboarding: true })} />;
  }

  const handleCookWithPantry = (ingredients: string[]) => {
    setTransferIngredients(ingredients);
    setCurrentView(ViewState.SMART_FRIDGE);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.PROFILE:
        return <Profile />;
      case ViewState.TRACKER:
        return <Tracker />;
      case ViewState.PANTRY:
        return <PantryScreen onCookWithPantry={handleCookWithPantry} />;
      case ViewState.SMART_FRIDGE:
      default:
        return (
          <SmartFridge 
            initialIngredients={transferIngredients.length > 0 ? transferIngredients : undefined}
            clearInitialIngredients={() => setTransferIngredients([])} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans pb-32 overflow-x-hidden relative">
      {/* Main Content Area */}
      <main className="w-full">
        {renderView()}
      </main>

      {/* Floating Chat Widget */}
      <AIChefChat />

      {/* Floating Island Navigation (Trend 2025) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-2">
        <nav className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] py-4 px-6 flex justify-between items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-white/60">
          
          <NavButton 
            active={currentView === ViewState.SMART_FRIDGE}
            onClick={() => setCurrentView(ViewState.SMART_FRIDGE)}
            icon={<Snowflake size={24} strokeWidth={2} />}
            label={t('nav_fridge')}
          />

          <NavButton 
            active={currentView === ViewState.PANTRY}
            onClick={() => setCurrentView(ViewState.PANTRY)}
            icon={<Package size={24} strokeWidth={2} />}
            label={t('nav_pantry')}
          />

          <NavButton 
            active={currentView === ViewState.TRACKER}
            onClick={() => setCurrentView(ViewState.TRACKER)}
            icon={<Activity size={24} strokeWidth={2} />}
            label={t('nav_tracker')}
          />

          <NavButton 
            active={currentView === ViewState.PROFILE}
            onClick={() => setCurrentView(ViewState.PROFILE)}
            icon={<User size={24} strokeWidth={2} />}
            label={t('nav_profile')}
          />

        </nav>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={() => { onClick(); if(navigator.vibrate) navigator.vibrate(5); }}
    className={`relative flex flex-col items-center justify-center transition-all duration-500 group ${active ? '-translate-y-3' : ''}`}
  >
    <div className={`
      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
      ${active 
        ? 'bg-stone-900 text-white shadow-xl shadow-stone-300 scale-110 rotate-6' 
        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100/50'}
    `}>
      {icon}
    </div>
    <span className={`absolute -bottom-6 text-[9px] font-brutal font-bold uppercase tracking-widest text-stone-900 transition-all duration-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      {label}
    </span>
    {/* Active Dot */}
    {active && <span className="absolute -bottom-2 w-1 h-1 bg-stone-900 rounded-full"></span>}
  </button>
);

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}