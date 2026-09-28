import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
];

export default function FilterBar({ q, onQChange, mealType, onMealTypeChange }) {
  const hasFilters = q || mealType;

  function clearAll() {
    onQChange('');
    onMealTypeChange('');
  }

  return (
    <div className="mb-6 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder="Search by title or ingredient..."
          aria-label="Search recipes"
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
        />
      </div>

      {/* Meal type pills */}
      <div className="flex flex-wrap gap-2">
        {mealTypes.map((mt) => {
          const active = mealType === mt.value;
          return (
            <button
              key={mt.value}
              type="button"
              onClick={() => onMealTypeChange(active ? '' : mt.value)}
              aria-pressed={active}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                active
                  ? 'border-[#E63946] bg-[#E63946] text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {mt.emoji} {mt.label}
            </button>
          );
        })}
      </div>

      {/* Active filter pills */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 overflow-hidden"
          >
            <span className="text-xs text-gray-400">Active:</span>

            <AnimatePresence>
              {q && (
                <motion.span
                  key="q"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 bg-[#F4A261]/20 text-[#b5651d] px-3 py-1 rounded-full text-xs font-medium"
                >
                  “{q}”
                  <button
                    type="button"
                    onClick={() => onQChange('')}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              )}
              {mealType && (
                <motion.span
                  key="meal"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full text-xs font-medium capitalize"
                >
                  {mealType}
                  <button
                    type="button"
                    onClick={() => onMealTypeChange('')}
                    aria-label="Clear meal type filter"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-[#E63946] underline"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}