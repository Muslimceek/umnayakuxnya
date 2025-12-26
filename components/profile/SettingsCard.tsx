import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Globe, Bell, Shield, MessageCircle, LogOut, ChevronRight, Sun, Moon, Heart, Palette, Key, CreditCard, HelpCircle, Share2, User, Lock, Eye, Volume2, Battery, Wifi, Navigation, BarChart3, Smartphone, MoonStar, SunDim } from 'lucide-react';
import { Language } from '../../types';

interface SettingsCardProps {
  t: (key: string) => string;
  language: Language;
  onLanguageToggle: () => void;
  onLogout: () => void;
}

interface SettingsCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  value?: string;
  type?: 'toggle' | 'value' | 'action';
  onClick?: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ t, language, onLanguageToggle, onLogout }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Define settings categories
  const settingsCategories: SettingsCategory[] = [
    {
      id: 'account',
      title: 'Account',
      icon: <User size={16} className="text-white" />,
      items: [
        {
          id: 'language',
          label: t('profile_language'),
          icon: <Globe size={16} />, 
          value: language.toUpperCase(),
          onClick: onLanguageToggle
        },
        {
          id: 'privacy',
          label: 'Privacy',
          icon: <Shield size={16} />
        },
        {
          id: 'security',
          label: 'Security',
          icon: <Lock size={16} />
        },
        {
          id: 'appearance',
          label: 'Appearance',
          icon: <Palette size={16} />,
          value: darkMode ? 'Dark' : 'Light'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell size={16} className="text-white" />,
      items: [
        {
          id: 'push-notifications',
          label: 'Push Notifications',
          icon: <Bell size={16} />, 
          type: 'toggle',
          value: notificationsEnabled ? 'On' : 'Off',
          onClick: () => setNotificationsEnabled(!notificationsEnabled)
        },
        {
          id: 'email-notifications',
          label: 'Email Notifications',
          icon: <MessageCircle size={16} />
        },
        {
          id: 'reminders',
          label: 'Reminders',
          icon: <Volume2 size={16} />
        }
      ]
    },
    {
      id: 'app',
      title: 'App Settings',
      icon: <Smartphone size={16} className="text-white" />,
      items: [
        {
          id: 'theme',
          label: 'Theme',
          icon: darkMode ? <MoonStar size={16} /> : <SunDim size={16} />,
          value: darkMode ? 'Dark' : 'Light',
          onClick: () => setDarkMode(!darkMode)
        },
        {
          id: 'data-usage',
          label: 'Data Usage',
          icon: <Wifi size={16} />
        },
        {
          id: 'storage',
          label: 'Storage',
          icon: <Battery size={16} />
        },
        {
          id: 'location',
          label: 'Location',
          icon: <Navigation size={16} />
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      icon: <HelpCircle size={16} className="text-white" />,
      items: [
        {
          id: 'help-center',
          label: 'Help Center',
          icon: <HelpCircle size={16} />
        },
        {
          id: 'feedback',
          label: 'Send Feedback',
          icon: <MessageCircle size={16} />
        },
        {
          id: 'share-app',
          label: 'Share App',
          icon: <Share2 size={16} />
        },
        {
          id: 'about',
          label: 'About',
          icon: <BarChart3 size={16} />
        }
      ]
    }
  ];
  
  const generalSettings = [
    {
      id: 'logout',
      label: t('logout'),
      icon: <LogOut size={16} />
    }
  ];
  
  const handleLogout = () => {
    onLogout();
  };
  
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35 }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 shadow-lg shadow-stone-200/30 border border-white/60 overflow-hidden"
    >
      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center">
          <Settings size={12} className="text-white" />
        </div>
        {t('profile_settings')}
      </h3>
      
      <div className="space-y-3">
        {settingsCategories.map((category) => (
          <div key={category.id} className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-1"
            >
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center">
                {category.icon}
              </div>
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">{category.title}</span>
            </motion.div>
            
            {category.items.map((item) => (
              <SettingsRow 
                key={item.id}
                item={item}
                onClick={item.onClick || (item.type === 'toggle' ? () => {
                  if (item.id === 'push-notifications') {
                    setNotificationsEnabled(!notificationsEnabled);
                  } else if (item.id === 'theme') {
                    setDarkMode(!darkMode);
                  }
                } : undefined)}
              />
            ))}
          </div>
        ))}
        
        {/* General settings */}
        <div className="pt-3 border-t border-stone-200/50 space-y-2">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-2.5 text-rose-500 font-bold text-sm bg-rose-50/50 hover:bg-rose-50 rounded-2xl transition flex items-center justify-center gap-2 active:scale-95 border border-rose-100"
          >
            <LogOut size={16} /> {t('logout')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsRow: React.FC<{ item: SettingsItem; onClick?: () => void }> = ({ item, onClick }) => {
  const { icon, label, value, type } = item;
  
  if (type === 'toggle') {
    return (
      <motion.div 
        className="w-full flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl transition-all group border border-stone-100/50"
      >
        <div className="flex items-center gap-2.5 text-stone-600 group-hover:text-stone-900 transition">
          <div className="w-7 h-7 rounded-xl bg-stone-50 flex items-center justify-center group-hover:bg-stone-100 transition">
            {icon}
          </div>
          <span className="font-medium text-xs">{label}</span>
        </div>
        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-stone-300 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
          <motion.span 
            layout
            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform"
            animate={{ x: value === 'On' ? 18 : 2 }}
          />
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.button 
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="w-full flex items-center justify-between p-3 bg-white/60 hover:bg-white backdrop-blur-sm rounded-2xl transition-all group border border-stone-100/50 active:scale-95"
    >
      <div className="flex items-center gap-2.5 text-stone-600 group-hover:text-stone-900 transition">
        <div className="w-7 h-7 rounded-xl bg-stone-50 flex items-center justify-center group-hover:bg-stone-100 transition">
          {icon}
        </div>
        <span className="font-medium text-xs">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 text-stone-400">
        {value && <span className="text-[10px] font-bold uppercase bg-stone-100 px-2 py-0.5 rounded-full">{value}</span>}
        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>
  );
};

export default SettingsCard;
