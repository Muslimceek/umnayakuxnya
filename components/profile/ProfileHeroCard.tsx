import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Crown, Edit2, Check, Flame, Scale, TrendingUp, Heart, Star, Award, Sun, Moon, Volume2, Share2, Download, MoreHorizontal } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileHeroCardProps {
  user: UserProfile;
  isEditing: boolean;
  tempName: string;
  onEditClick: () => void;
  onSaveClick: () => void;
  onNameChange: (name: string) => void;
  onAvatarChange: (file: File) => void;
}

// Calculate progress percentage for radial chart
const calculateProgressPercentage = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100);
};

// Radial progress component for stats
const RadialProgress = ({ percentage, size = 60, strokeWidth = 4, color = 'rose' }: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number; 
  color?: string; 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    rose: 'stroke-rose-500',
    indigo: 'stroke-indigo-500',
    emerald: 'stroke-emerald-500',
    amber: 'stroke-amber-500'
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={colorClasses[color as keyof typeof colorClasses]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-stone-700">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  user,
  isEditing,
  tempName,
  onEditClick,
  onSaveClick,
  onNameChange,
  onAvatarChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timeBasedTheme, setTimeBasedTheme] = useState<'light' | 'dark'>('light');
  const [isListening, setIsListening] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  
  // Set theme based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    setTimeBasedTheme(hour >= 6 && hour < 18 ? 'light' : 'dark');
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  // Voice command handler
  const handleVoiceCommand = () => {
    setIsListening(true);
    // Simulate voice command recognition
    setTimeout(() => {
      setIsListening(false);
      // In a real app, this would trigger actual voice recognition
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="relative mb-4 overflow-hidden"
    >
      {/* Enhanced Glassmorphic Card with Adaptive Background */}
      <div className={`relative bg-gradient-to-br ${timeBasedTheme === 'light' ? 'from-white/80 via-white/60 to-rose-50/40' : 'from-stone-800/60 via-stone-700/50 to-stone-900/50'} backdrop-blur-2xl rounded-[2rem] p-5 shadow-2xl ${timeBasedTheme === 'light' ? 'shadow-rose-200/20' : 'shadow-stone-900/30'} border ${timeBasedTheme === 'light' ? 'border-white/60' : 'border-stone-600/50'}`}>
        {/* Dynamic Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-40">
          <motion.div 
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: timeBasedTheme === 'light' 
                ? 'linear-gradient(45deg, #fbbf24, #fb923c, #f472b6)' 
                : 'linear-gradient(45deg, #7e22ce, #3b82f6, #06b6d4)'
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -15, 0],
              y: [0, 15, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{
              background: timeBasedTheme === 'light' 
                ? 'linear-gradient(45deg, #818cf8, #a78bfa, #ec4899)' 
                : 'linear-gradient(45deg, #10b981, #06b6d4, #3b82f6)'
            }}
          />
        </div>
        
        {/* Adaptive Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          {timeBasedTheme === 'light' ? (
            <Sun size={16} className="text-amber-500" />
          ) : (
            <Moon size={16} className="text-indigo-300" />
          )}
        </div>
        
        {/* Voice Command Button */}
        <div className="absolute top-4 left-4 z-20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceCommand}
            className={`p-2 rounded-full ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/60 text-stone-600'} backdrop-blur-sm shadow-sm`}
          >
            <Volume2 size={14} />
          </motion.button>
        </div>

        <div className="relative z-10">
          {/* Avatar Section with Enhanced Interactions */}
          <div className="flex items-start justify-between mb-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              {/* Enhanced Glowing Ring with Animation */}
              <motion.div 
                className="absolute inset-0 rounded-full blur-lg"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: user.subscription.plan === 'premium' 
                    ? 'linear-gradient(45deg, #f59e0b, #fbbf24, #f59e0b)' 
                    : 'linear-gradient(45deg, #f472b6, #fb923c, #f472b6)'
                }}
              />
              <div className="relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-br from-rose-400 to-orange-400">
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                  <img 
                    src={user.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <motion.div 
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.05 }}
              >
                <Camera className="text-white" size={18} />
              </motion.div>
              {user.subscription.plan === 'premium' && (
                <motion.div 
                  className="absolute -top-1 -right-1 z-30 bg-gradient-to-br from-amber-400 to-amber-500 p-1.5 rounded-full shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Crown size={12} fill="white" className="text-white" />
                </motion.div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onEditClick} 
                className="p-2.5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
              >
                <Edit2 size={16} className="text-stone-600" />
              </motion.button>
              
              {/* Quick Actions Menu */}
              <div className="relative">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                  className="p-2.5 bg-gradient-to-br from-rose-100 to-orange-100 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
                >
                  <MoreHorizontal size={16} className="text-rose-500" />
                </motion.button>
                
                <AnimatePresence>
                  {isQuickMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute right-0 top-14 bg-white rounded-2xl shadow-lg border border-stone-100 p-2 w-40 z-20"
                    >
                      <button className="flex items-center gap-2 w-full p-2 text-left text-sm hover:bg-stone-50 rounded-lg transition-colors">
                        <Heart size={14} className="text-rose-500" />
                        Favorite
                      </button>
                      <button className="flex items-center gap-2 w-full p-2 text-left text-sm hover:bg-stone-50 rounded-lg transition-colors">
                        <Share2 size={14} className="text-stone-500" />
                        Share Profile
                      </button>
                      <button className="flex items-center gap-2 w-full p-2 text-left text-sm hover:bg-stone-50 rounded-lg transition-colors">
                        <Download size={14} className="text-stone-500" />
                        Export Data
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Name & Email with Enhanced Editing */}
          <div className="mb-4">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input 
                  value={tempName}
                  onChange={(e) => onNameChange(e.target.value)}
                  className="text-2xl font-bold bg-white/60 backdrop-blur-sm border border-stone-200 focus:border-rose-400 outline-none px-3 py-1.5 rounded-xl text-stone-900 flex-1"
                  autoFocus
                />
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={onSaveClick} 
                  className="p-2.5 bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-xl hover:scale-105 active:scale-95 transition shadow-lg"
                >
                  <Check size={16}/>
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-stone-900 mb-0.5">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-rose-400 border border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-amber-400 border border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-emerald-400 border border-white"></div>
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium">Active now</span>
                </div>
              </motion.div>
            )}
            <p className="text-stone-400 text-xs font-medium mt-1">{user.email}</p>
          </div>

          {/* Enhanced Stats Grid with Radial Progress */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-rose-50/70 to-orange-50/50 backdrop-blur-sm rounded-2xl p-3 border border-rose-100/50 flex flex-col items-center"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center mb-1.5 shadow-sm">
                <Flame size={16} className="text-white" />
              </div>
              <p className="text-[9px] text-stone-500 font-medium uppercase tracking-wide mb-1.5 text-center">Streak</p>
              <div className="flex justify-center">
                <RadialProgress percentage={85} size={44} color="rose" />
              </div>
              <p className="text-sm font-bold text-stone-900 mt-1">12</p>
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-indigo-50/70 to-violet-50/50 backdrop-blur-sm rounded-2xl p-3 border border-indigo-100/50 flex flex-col items-center"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center mb-1.5 shadow-sm">
                <Scale size={16} className="text-white" />
              </div>
              <p className="text-[9px] text-stone-500 font-medium uppercase tracking-wide mb-1.5 text-center">Weight</p>
              <div className="flex justify-center">
                <RadialProgress percentage={calculateProgressPercentage(user.dailyStats.weight || 64.5, 68)} size={44} color="indigo" />
              </div>
              <p className="text-sm font-bold text-stone-900 mt-1">{user.dailyStats.weight || '64.5'}kg</p>
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 backdrop-blur-sm rounded-2xl p-3 border border-emerald-100/50 flex flex-col items-center"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mb-1.5 shadow-sm">
                <TrendingUp size={16} className="text-white" />
              </div>
              <p className="text-[9px] text-stone-500 font-medium uppercase tracking-wide mb-1.5 text-center">Progress</p>
              <div className="flex justify-center">
                <RadialProgress percentage={85} size={44} color="emerald" />
              </div>
              <p className="text-sm font-bold text-stone-900 mt-1">85%</p>
            </motion.div>
          </div>
          
          {/* Achievement Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-2 mt-3"
          >
            <div className="flex items-center gap-1 bg-amber-100/60 px-2 py-1 rounded-full border border-amber-200">
              <Award size={10} className="text-amber-600" />
              <span className="text-[9px] font-bold text-amber-700">Early Bird</span>
            </div>
            <div className="flex items-center gap-1 bg-violet-100/60 px-2 py-1 rounded-full border border-violet-200">
              <Star size={10} className="text-violet-600" />
              <span className="text-[9px] font-bold text-violet-700">Consistent</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeroCard;
