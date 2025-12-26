import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Heart } from 'lucide-react';
import { generateRecipeFromIngredients, generateDishImage } from '../services/geminiService';
import { GeneratedRecipe } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import GeneratorTab from './smart-fridge/GeneratorTab';
import ExploreTab from './smart-fridge/ExploreTab';
import SavedTab from './smart-fridge/SavedTab';

interface SmartFridgeProps {
  initialIngredients?: string[];
  clearInitialIngredients?: () => void;
}

const SmartFridge: React.FC<SmartFridgeProps> = ({ initialIngredients, clearInitialIngredients }) => {
  const { t, language } = useLanguage();
  const { user, updateUser } = useUser();
  
  // State
  const [activeTab, setActiveTab] = useState<'generate' | 'saved' | 'explore'>('generate');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState('');
  
  // Handle Initial Ingredients from Pantry
  useEffect(() => {
    if (initialIngredients && initialIngredients.length > 0) {
      setIngredients(prev => Array.from(new Set([...prev, ...initialIngredients])));
      setActiveTab('generate');
      if(clearInitialIngredients) clearInitialIngredients();
    }
  }, [initialIngredients, clearInitialIngredients]);

  // Initialize Greetings
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeGreeting(t('fridge_greeting_morning'));
    } else if (hour < 17) {
      setTimeGreeting(t('fridge_greeting_afternoon'));
    } else {
      setTimeGreeting(t('fridge_greeting_evening'));
    }
  }, [t]);

  const addIngredient = (value: string) => {
    const cleanVal = value.trim();
    if (cleanVal && !ingredients.includes(cleanVal)) {
      setIngredients([...ingredients, cleanVal]);
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleGenerate = async (filters: { cuisine: string; mealType: string; mood: string }) => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setRecipe(null);
    setImageLoading(false);

    // 1. Generate Text Recipe
    const result = await generateRecipeFromIngredients(
      ingredients, 
      language, 
      { 
          cuisine: filters.cuisine === 'Any' ? undefined : filters.cuisine, 
          mealType: filters.mealType === 'Any' ? undefined : filters.mealType,
          mood: filters.mood === 'Any' ? undefined : filters.mood
      }
    );
    
    setLoading(false);
    
    if (result) {
      setRecipe(result);
      
      // 2. Trigger Image Generation in background
      setImageLoading(true);
      generateDishImage(result.title, ingredients).then((imgUrl) => {
        if (imgUrl) {
          setRecipe(prev => prev ? ({ ...prev, imageUrl: imgUrl }) : null);
        }
        setImageLoading(false);
      });
    }
  };

  const toggleFavorite = (targetRecipe: GeneratedRecipe) => {
    const exists = user.savedRecipes.some(r => r.id === targetRecipe.id);
    let newSaved;
    if (exists) {
      newSaved = user.savedRecipes.filter(r => r.id !== targetRecipe.id);
    } else {
      newSaved = [targetRecipe, ...user.savedRecipes];
    }
    updateUser({ savedRecipes: newSaved });
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      
      {/* Compact Header */}
      <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-400 to-orange-400 animate-pulse" />
              <p className="text-rose-500 font-bold uppercase tracking-wider text-[10px]">{t('fridge_title')}</p>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">{timeGreeting}</h2>
            <p className="text-stone-400 text-xs mt-0.5">{user.name.split(' ')[0]}, {t('fridge_subtitle')}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 p-0.5">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white p-0.5">
                <img src={user.avatarUrl} alt="User" className="w-full h-full rounded-xl object-cover" />
              </div>
          </div>
      </div>

      {/* Floating Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button 
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
            activeTab === 'generate' 
              ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105' 
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
          >
          <Sparkles size={14} /> {t('fridge_tab_gen')}
          </button>
          <button 
          onClick={() => setActiveTab('explore')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
            activeTab === 'explore' 
              ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105' 
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
          >
          <Compass size={14} /> {t('fridge_tab_explore')}
          </button>
          <button 
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
            activeTab === 'saved' 
              ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105' 
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
          >
          <Heart size={14} /> {t('fridge_tab_saved')}
          </button>
      </div>

      {/* CONTENT SWITCHER */}
      {activeTab === 'explore' ? (
         <ExploreTab 
            t={t} 
            onToggleFavorite={toggleFavorite} 
            savedRecipeIds={user.savedRecipes.map(r => r.id)}
         />
      ) : activeTab === 'generate' ? (
        <GeneratorTab 
          ingredients={ingredients}
          addIngredient={addIngredient}
          removeIngredient={removeIngredient}
          onGenerate={handleGenerate}
          loading={loading}
          recipe={recipe}
          imageLoading={imageLoading}
          t={t}
          onToggleFavorite={toggleFavorite}
          savedRecipeIds={user.savedRecipes.map(r => r.id)}
        />
      ) : (
        <SavedTab 
          savedRecipes={user.savedRecipes} 
          t={t} 
          onToggleFavorite={toggleFavorite}
          onStartCooking={() => setActiveTab('generate')}
        />
      )}
    </div>
  );
};

export default SmartFridge;