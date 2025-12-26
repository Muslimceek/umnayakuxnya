import React, { useState, useRef } from 'react';
import { Plus, X, ShoppingBasket, ChevronRight, Loader2, Sparkles, Wand2, Search, Volume2, Mic, MicOff, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedRecipe } from '../../types';
import RecipeCard from './RecipeCard';

interface GeneratorTabProps {
  ingredients: string[];
  addIngredient: (val: string) => void;
  removeIngredient: (val: string) => void;
  onGenerate: (filters: { cuisine: string; mealType: string; mood: string }) => void;
  loading: boolean;
  recipe: GeneratedRecipe | null;
  imageLoading: boolean;
  t: (key: string) => string;
  onToggleFavorite: (recipe: GeneratedRecipe) => void;
  savedRecipeIds: string[];
}

const GeneratorTab: React.FC<GeneratorTabProps> = ({
  ingredients,
  addIngredient,
  removeIngredient,
  onGenerate,
  loading,
  recipe,
  imageLoading,
  t,
  onToggleFavorite,
  savedRecipeIds
}) => {
  const [inputValue, setInputValue] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [mealType, setMealType] = useState('Any');
  const [mood, setMood] = useState('Any');
  const [isListening, setIsListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const recognitionRef = useRef<any>(null);

  const quickIngredients = [
    { label: t('ing_eggs'), icon: '🥚' },
    { label: t('ing_milk'), icon: '🥛' },
    { label: t('ing_chicken'), icon: '🍗' },
    { label: t('ing_rice'), icon: '🍚' },
    { label: t('ing_potatoes'), icon: '🥔' },
    { label: t('ing_tomatoes'), icon: '🍅' },
    { label: t('ing_onion'), icon: '🧅' },
    { label: t('ing_cheese'), icon: '🧀' },
  ];

  const cuisines = [
    { value: 'Any', label: t('cuisine_any') },
    { value: 'Uzbek', label: t('cuisine_uzbek') },
    { value: 'Russian', label: t('cuisine_russian') },
    { value: 'European', label: t('cuisine_euro') },
    { value: 'Kazakh', label: t('cuisine_kazakh') },
    { value: 'Tajik', label: t('cuisine_tajik') },
    { value: 'Kyrgyz', label: t('cuisine_kyrgyz') },
    { value: 'Asian', label: t('cuisine_asian') },
  ];

  const mealTypes = [
    { value: 'Breakfast', label: t('meal_breakfast') },
    { value: 'Lunch', label: t('meal_lunch') },
    { value: 'Dinner', label: t('meal_dinner') },
    { value: 'Snack', label: t('meal_snack') },
  ];

  const moods = [
    { value: 'Any', label: t('mood_any') },
    { value: 'Cozy', label: t('mood_cozy') },
    { value: 'Energetic', label: t('mood_energetic') },
    { value: 'Romantic', label: t('mood_romantic') },
    { value: 'Quick', label: t('mood_quick') },
    { value: 'Celebration', label: t('mood_celebration') },
  ];

  const handleAdd = () => {
    if (inputValue.trim()) {
      addIngredient(inputValue);
      setInputValue('');
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // In a real app, this would connect to speech recognition API
    setTimeout(() => {
      // Simulate voice recognition
      const mockIngredients = ['chicken', 'tomatoes', 'onions', 'garlic'];
      const randomIngredient = mockIngredients[Math.floor(Math.random() * mockIngredients.length)];
      setInputValue(randomIngredient);
      setIsListening(false);
    }, 2000);
  };

  const stopVoiceInput = () => {
    setIsListening(false);
    // In a real app, this would stop the speech recognition
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
      {/* --- SECTION: MAIN CANVAS --- */}
      <div className="relative group">
        
        <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-6 md:p-8">
          
          {/* Header with Help and Voice Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-rose-400 to-orange-400 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center rotate-3">
                <Wand2 className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-editorial italic font-bold text-stone-900">AI Chef</h2>
                <p className="text-stone-400 text-xs font-brutal font-bold uppercase tracking-widest">Create a masterpiece</p>
              </div>
            </div>
            
            {/* Help and Voice Controls */}
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-stone-200 shadow-sm"
              >
                <Info size={16} className="text-stone-600" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-2 rounded-xl backdrop-blur-sm border shadow-sm ${isListening ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/60 text-stone-600 border-stone-200'}`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </motion.button>
            </div>
          </div>
          
          {/* Contextual Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-xs text-amber-800"
              >
                <p className="font-bold mb-1">How to use AI Chef:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Add ingredients you have</li>
                  <li>Select your preferences</li>
                  <li>Tap "Create Recipe" to generate</li>
                  <li>Try voice input for faster adding</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INPUT BENTO BOX */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Input Column */}
            <div className="space-y-4">
              <label className="text-[10px] font-brutal font-bold text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Search size={12} /> {t('fridge_placeholder')}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  className="w-full pl-6 pr-24 py-6 bg-stone-100/50 border-none rounded-[2rem] focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all text-xl font-editorial italic text-stone-700 placeholder:text-stone-300 outline-none shadow-inner"
                  placeholder="e.g. Chicken, Garlic, Cream..."
                />
                <div className="absolute right-2 flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                    className="p-4 bg-stone-900 text-white rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                  
                  {isListening && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="p-4 bg-rose-500 text-white rounded-[1.5rem] shadow-lg flex items-center justify-center"
                    >
                      <Volume2 size={20} className="animate-pulse" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Selected Ingredients (Chips) with Framer Motion */}
              <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
                <AnimatePresence mode="popLayout">
                    {ingredients.length > 0 ? (
                        ingredients.map((ing, index) => (
                        <motion.div 
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.02 }}
                            key={ing} 
                            className="group flex items-center gap-2 px-4 py-2 bg-white border border-stone-100 rounded-full shadow-sm hover:border-rose-200 hover:shadow-md cursor-default transition-colors relative"
                        >
                            <span className="text-sm font-brutal font-bold text-stone-700">{ing}</span>
                            <motion.button 
                              onClick={() => removeIngredient(ing)} 
                              whileTap={{ scale: 0.8 }}
                              className="text-stone-300 group-hover:text-rose-500 transition-colors bg-stone-50 rounded-full p-0.5 hover:bg-rose-50"
                            >
                                <X size={12} />
                            </motion.button>
                            
                            {/* Swipe hint for mobile */}
                            <div className="absolute -bottom-6 left-0 right-0 text-center">
                              <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">swipe to remove</span>
                            </div>
                        </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-stone-300 text-sm px-2 italic font-editorial"
                        >
                            <ShoppingBasket size={16} />
                            {t('fridge_empty_hint')}
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>

            {/* QUICK ADD BENTO */}
            <div className="bg-stone-50/50 backdrop-blur-sm rounded-[2rem] p-5 border border-stone-100/50">
              <p className="text-[10px] font-brutal font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-1">
                 {t('fridge_quick_add')}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickIngredients.slice(0, 6).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { addIngredient(item.label); if (navigator.vibrate) navigator.vibrate(10); }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-xl text-xs font-bold text-stone-600 border border-stone-100 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm active:scale-95"
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FILTERS: Visual Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <FilterCard 
              label={t('filter_cuisine')} 
              value={cuisine} 
              options={cuisines} 
              onChange={setCuisine} 
            />
            <FilterCard 
              label={t('filter_meal')} 
              value={mealType} 
              options={mealTypes} 
              onChange={setMealType} 
            />
             <FilterCard 
              label={t('filter_mood')} 
              value={mood} 
              options={moods} 
              onChange={setMood} 
            />
          </div>

          {/* GENERATE BUTTON: The "Hero" Action */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onGenerate({ cuisine, mealType, mood })}
            disabled={ingredients.length === 0 || loading}
            className={`relative w-full py-6 rounded-[2rem] font-brutal font-bold text-lg uppercase tracking-widest overflow-hidden transition-all transform shadow-xl ${
              ingredients.length === 0 ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none' : 'bg-stone-900 text-white hover:shadow-2xl hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="text-rose-400" size={24} />
                </motion.div>
                <span className="animate-pulse">{t('thinking')}...</span>
              </div>
            ) : (
              <div className="relative z-10 flex items-center justify-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles size={20} className="text-amber-400 fill-amber-400" />
                </motion.div>
                <span>{t('create_recipe')}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight size={20} />
                </motion.div>
              </div>
            )}
            
            {/* Animated Gradient on Hover */}
            {!loading && ingredients.length > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
            )}
          </motion.button>
        </div>
      </div>

      {/* RECIPE VIEW */}
      {recipe && (
        <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-10">
           <RecipeCard 
                recipe={recipe} 
                t={t} 
                onToggleFavorite={() => onToggleFavorite(recipe)} 
                isSaved={savedRecipeIds.includes(recipe.id)}
                imageLoading={imageLoading}
           />
        </div>
      )}
    </div>
  );
};

// Helper Component for Visual Filters
const FilterCard = ({ label, value, options, onChange }: { label: string, value: string, options: {value: string, label: string}[], onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-brutal font-black text-stone-400 uppercase tracking-widest ml-2">{label}</span>
    <div className="relative group">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-800 py-4 px-5 rounded-2xl font-brutal font-bold text-sm focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all cursor-pointer hover:bg-white hover:shadow-md"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-x-1 transition-transform">
        <ChevronRight size={16} className="rotate-90 text-stone-400" />
      </div>
    </div>
  </div>
);

export default GeneratorTab;