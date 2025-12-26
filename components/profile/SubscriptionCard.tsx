import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { UserProfile } from '../../types';

interface SubscriptionCardProps {
  user: UserProfile;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ user }) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-3xl group"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 animate-gradient" />
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-rose-500/20" />
      
      <div className="relative z-10 p-5 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
              <Crown size={16} fill="white" className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {user.subscription.plan === 'premium' ? 'Premium' : 'Free Plan'}
              </h3>
              <p className="text-white/60 text-[10px] font-medium">Until {user.subscription.nextBillingDate}</p>
            </div>
          </div>
          <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/30">
            {user.subscription.status.toUpperCase()}
          </span>
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-white text-stone-900 rounded-2xl font-bold text-sm hover:bg-stone-100 transition shadow-xl active:shadow-lg"
        >
          Manage Plan
        </motion.button>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors duration-500" />
      <Crown size={100} className="absolute -bottom-4 -right-4 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
    </motion.div>
  );
};

export default SubscriptionCard;
