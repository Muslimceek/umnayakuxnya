import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Check, MoreHorizontal, Share2, Trash2 } from 'lucide-react';
import { PlanHistoryItem } from '../../types';

interface ActivityHistoryProps {
  history: PlanHistoryItem[];
}

interface ActivityCardProps {
  plan: PlanHistoryItem;
  idx: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ plan, idx }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.45 + idx * 0.05 }}
      whileTap={{ scale: 0.95 }}
      className="min-w-[280px] bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-lg border border-white/60 hover:shadow-xl transition-all relative"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
            <Check size={18} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-stone-900 text-sm leading-tight">{plan.title}</h4>
            <p className="text-[10px] text-stone-400 font-medium">{plan.dateRange}</p>
          </div>
        </div>
        
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          >
            <MoreHorizontal size={14} className="text-stone-500" />
          </motion.button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute right-0 top-8 bg-white rounded-2xl shadow-lg border border-stone-100 p-2 w-40 z-10"
              >
                <button className="flex items-center gap-2 w-full p-2 text-left text-sm hover:bg-stone-50 rounded-lg transition-colors">
                  <Share2 size={14} className="text-stone-500" />
                  Share
                </button>
                <button className="flex items-center gap-2 w-full p-2 text-left text-sm hover:bg-stone-50 rounded-lg transition-colors">
                  <Trash2 size={14} className="text-rose-500" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <span className="text-xs font-medium text-stone-500">Avg. Calories</span>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          {plan.caloriesAvg} kcal
        </span>
      </div>
    </motion.div>
  );
};

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ history }) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
            <Activity size={12} className="text-white" />
          </div>
          Recent Activity
        </h3>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="text-[10px] font-bold text-stone-400 uppercase tracking-wider hover:text-stone-600 transition"
        >
          View All
        </motion.button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {history.map((plan, idx) => (
          <ActivityCard key={plan.id} plan={plan} idx={idx} />
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityHistory;
