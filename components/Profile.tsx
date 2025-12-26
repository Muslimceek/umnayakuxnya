import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import ProfileHeader from './profile/ProfileHeader';
import ProfileHeroCard from './profile/ProfileHeroCard';
import PersonalInfoCard from './profile/PersonalInfoCard';
import GoalsCard from './profile/GoalsCard';
import SubscriptionCard from './profile/SubscriptionCard';
import SettingsCard from './profile/SettingsCard';
import ActivityHistory from './profile/ActivityHistory';

const Profile: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, updateUser } = useUser();
  
  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  
  // Modals / Overlays (Simple state for demo)
  const [showSettings, setShowSettings] = useState(false);

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    updateUser({ name: tempName });
    setIsEditing(false);
  };

  const toggleGoal = (goal: string) => {
    if (user.goals.includes(goal)) {
      updateUser({ goals: user.goals.filter(g => g !== goal) });
    } else {
      updateUser({ goals: [...user.goals, goal] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] via-[#F5F3F0] to-[#FFF7ED] pb-32 pt-6 px-4 max-w-md mx-auto overflow-x-hidden">
      
      <ProfileHeader onSettingsClick={() => setShowSettings(!showSettings)} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <ProfileHeroCard
          user={user}
          isEditing={isEditing}
          tempName={tempName}
          onEditClick={() => setIsEditing(true)}
          onSaveClick={saveProfile}
          onNameChange={setTempName}
          onAvatarChange={handleAvatarChange}
        />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <PersonalInfoCard />
        
        <GoalsCard
          user={user}
          t={t}
          onToggleGoal={toggleGoal}
        />

        <SubscriptionCard user={user} />

        <SettingsCard
          t={t}
          language={language}
          onLanguageToggle={() => setLanguage(language === 'en' ? 'ru' : 'en')}
          onLogout={() => {
            // In a real app, this would handle actual logout
            console.log('User logged out');
            // Reset user data or redirect to login
          }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ActivityHistory history={user.history} />
      </motion.div>
    </div>
  );
};


export default Profile;
