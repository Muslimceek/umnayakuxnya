import React, { useState } from 'react';
import { Ghost, Search, Filter, Grid, List, SortAsc, Heart, Clock, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedRecipe } from '../../types';
import RecipeCard from './RecipeCard';

interface SavedTabProps {
  savedRecipes: GeneratedRecipe[];
  t: (key: string) => string;
  onToggleFavorite: (recipe: GeneratedRecipe) => void;
  onStartCooking: () => void;
}

const SavedTab: React.FC<SavedTabProps> = ({ 
  savedRecipes, 
  t, 
  onToggleFavorite, 
  onStartCooking 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'time' | 'calories'>('recent');
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null);

  // Filter and sort
  const filteredRecipes = savedRecipes
    .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'time') return a.prepTimeMinutes - b.prepTimeMinutes;
      if (sortBy === 'calories') return a.calories - b.calories;
      return 0; // recent (default order)
    });

  // Full recipe view
  if (selectedRecipe) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          onClick={() => setSelectedRecipe(null)}
          className="mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200 hover:bg-stone-900 hover:text-white transition-all text-sm font-bold flex items-center gap-2"
        >
          ← Back
        </button>
        <RecipeCard
          recipe={selectedRecipe}
          t={t}
          onToggleFavorite={() => onToggleFavorite(selectedRecipe)}
          isSaved={true}
        />
      </motion.div>
    );
  }
  return (
    <div className="space-y-4">
      {savedRecipes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-6 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl border border-stone-100 min-h-[60vh]"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl flex items-center justify-center mb-4 shadow-lg"
          >
            <Ghost size={32} className="text-rose-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-stone-800 mb-2">{t('fridge_saved_empty')}</h3>
          <p className="text-stone-400 text-sm max-w-xs">{t('fridge_saved_empty_desc')}</p>
        </motion.div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 border border-stone-100 shadow-lg sticky top-0 z-10">
            {/* Search Bar */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex bg-stone-50 rounded-2xl p-1 gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-stone-900 shadow-sm' 
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-stone-900 shadow-sm' 
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Sort Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[{ key: 'recent', label: 'Recent' }, { key: 'time', label: 'Quick First' }, { key: 'calories', label: 'Low Cal' }].map(option => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    sortBy === option.key
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="px-2">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'}
            </p>
          </div>

          {/* Recipes Grid/List */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                {filteredRecipes.map((recipe, idx) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 hover:scale-105 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/400/400`}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Heart Badge */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe); }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors group/heart"
                      >
                        <Heart size={14} className="text-white fill-white" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-stone-900 mb-2 leading-tight line-clamp-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {recipe.prepTimeMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={10} /> {recipe.calories}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredRecipes.map((recipe, idx) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="bg-white rounded-3xl p-4 shadow-lg border border-stone-100 hover:shadow-xl transition-all cursor-pointer flex gap-4 group"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/200/200`}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-stone-900 mb-1 truncate">
                        {recipe.title}
                      </h3>
                      <p className="text-xs text-stone-500 mb-2 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {recipe.prepTimeMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={10} /> {recipe.calories} cal
                        </span>
                        <span className="px-2 py-0.5 bg-stone-100 rounded-full font-bold">
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Heart */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe); }}
                      className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center hover:bg-rose-500 transition-colors group/heart flex-shrink-0"
                    >
                      <Heart size={16} className="text-rose-500 group-hover/heart:text-white fill-rose-500 group-hover/heart:fill-white transition-colors" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default SavedTab;