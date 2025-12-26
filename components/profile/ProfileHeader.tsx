import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Bell, Moon, Sun, MoreHorizontal } from 'lucide-react';

interface ProfileHeaderProps {
  onSettingsClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onSettingsClick }) => {
  const [timeBasedTheme, setTimeBasedTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Set theme based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    setTimeBasedTheme(hour >= 6 && hour < 18 ? 'light' : 'dark');
  }, []);
  
  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex justify-between items-center mb-6 bg-white/60 backdrop-blur-xl rounded-3xl p-3 shadow-lg shadow-stone-200/30 border border-white/50 relative"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <span className="text-sm font-bold text-stone-800">Profile</span>
      </div>
      
      {/* Enhanced Settings Button with 2025 Trends */}
      <div className="relative">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="w-11 h-11 bg-gradient-to-br from-rose-100/80 to-orange-100/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/60 text-stone-600 transition-all duration-300 relative overflow-hidden group"
        >
          {/* Animated background effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-rose-200/40 to-orange-200/40"
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div 
            className="relative z-10 flex items-center justify-center"
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <MoreHorizontal size={20} className="text-stone-700" />
          </motion.div>
          
          {/* Notification indicator */}
          <motion.div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-[8px] text-white font-bold">2</span>
          </motion.div>
        </motion.button>
        
        {/* Contextual Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-0 top-14 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden z-20"
            >
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  onSettingsClick();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-rose-50/80 transition-colors"
              >
                <Settings size={16} />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-rose-50/80 transition-colors">
                <Bell size={16} />
                <span className="text-sm font-medium">Notifications</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-rose-50/80 transition-colors">
                {timeBasedTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span className="text-sm font-medium">{timeBasedTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
