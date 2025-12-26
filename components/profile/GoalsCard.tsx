import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, Plus, Check, Edit3 } from 'lucide-react';
import { UserProfile } from '../../types';

interface GoalsCardProps {
  user: UserProfile;
  t: (key: string) => string;
  onToggleGoal: (goal: string) => void;
}

const GoalsCard: React.FC<GoalsCardProps> = ({ user, t, onToggleGoal }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  
  const handleAddGoal = () => {
    if (newGoal.trim() && !user.goals.includes(newGoal.trim())) {
      // In a real app, this would call a function to add the goal
      setNewGoal('');
      setShowAddForm(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 backdrop-blur-xl rounded-3xl p-4 shadow-lg shadow-amber-200/20 border border-amber-100/50"
    >
      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
          <Target size={12} className="text-white" />
        </div>
        {t('profile_goals')}
      </h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {user.goals.map((goal, idx) => (
          <motion.button 
            key={goal}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleGoal(goal)}
            className="px-3 py-1.5 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-200 hover:shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            {goal} <X size={10} />
          </motion.button>
        ))}
        
        <AnimatePresence>
          {showAddForm ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-1"
            >
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="New goal..."
                className="px-2 py-1.5 text-xs font-bold border border-stone-200 rounded-full focus:outline-none focus:ring-1 focus:ring-rose-400 w-24"
                autoFocus
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddGoal}
                className="p-1.5 bg-rose-500 text-white rounded-full"
              >
                <Check size={12} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1.5 bg-white/80 backdrop-blur-sm text-stone-400 rounded-full text-xs font-bold border border-stone-200 hover:border-stone-300 transition active:scale-95 flex items-center gap-1"
            >
              <Plus size={12} /> {t('add_goal')}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="pt-3 border-t border-stone-100">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Diet Preferences</p>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-stone-100"
          >
            <Edit3 size={12} className="text-stone-400" />
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {user.dietaryPreferences.map(pref => (
            <motion.span 
              key={pref} 
              whileHover={{ scale: 1.05 }}
              className="px-2.5 py-1 bg-emerald-100/60 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200"
            >
              {pref}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GoalsCard;
