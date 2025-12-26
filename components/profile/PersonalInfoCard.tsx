import React from 'react';
import { motion } from 'framer-motion';
import { User, HeartPulse, Ruler, Activity } from 'lucide-react';

const PersonalInfoCard: React.FC = () => {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 shadow-lg shadow-stone-200/30 border border-white/60"
    >
      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center">
          <User size={12} className="text-white" />
        </div>
        Personal Info
      </h3>
      
      <div className="grid grid-cols-3 gap-2">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-2xl p-3 text-center border border-stone-100 transition-transform"
        >
          <div className="flex justify-center mb-1">
            <HeartPulse size={16} className="text-rose-500" />
          </div>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide mb-1">Age</p>
          <p className="text-xl font-bold text-stone-900">28</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-2xl p-3 text-center border border-stone-100 transition-transform"
        >
          <div className="flex justify-center mb-1">
            <Ruler size={16} className="text-indigo-500" />
          </div>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide mb-1">Height</p>
          <p className="text-xl font-bold text-stone-900">168</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-2xl p-3 text-center border border-stone-100 transition-transform"
        >
          <div className="flex justify-center mb-1">
            <Activity size={16} className="text-emerald-500" />
          </div>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide mb-1">Activity</p>
          <p className="text-xl font-bold text-stone-900">⚡️</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoCard;
