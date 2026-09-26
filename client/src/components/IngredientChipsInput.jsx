import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Small emoji map for common ingredients — falls back to a generic icon
const emojiMap = {
  egg: '🥚', eggs: '🥚',
  tomato: '🍅', tomatoes: '🍅',
  onion: '🧅', onions: '🧅',
  garlic: '🧄',
  chicken: '🍗',
  beef: '🥩',
  rice: '🍚',
  cheese: '🧀',
  milk: '🥛',
  butter: '🧈',
  potato: '🥔', potatoes: '🥔',
  carrot: '🥕', carrots: '🥕',
  pepper: '🌶️',
  fish: '🐟',
  bread: '🍞',
  pasta: '🍝',
  mushroom: '🍄', mushrooms: '🍄',
  lemon: '🍋',
  avocado: '🥑',
};

function getEmoji(name) {
  return emojiMap[name.toLowerCase().trim()] || '🥘';
}

export default function IngredientChipsInput({ ingredients, onChange }) {
  const [input, setInput] = useState('');

  function addIngredient() {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Avoid duplicates
    if (ingredients.some((ing) => ing.name.toLowerCase() === trimmed.toLowerCase())) {
      setInput('');
      return;
    }

    onChange([...ingredients, { name: trimmed.toLowerCase(), raw: trimmed }]);
    setInput('');
  }

  function removeIngredient(index) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient();
    }
    if (e.key === 'Backspace' && input === '' && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border border-gray-300 rounded-xl p-3 min-h-[52px] focus-within:ring-2 focus-within:ring-[#E63946]">
        <AnimatePresence>
          {ingredients.map((ing, index) => (
            <motion.span
              key={ing.name + index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1 bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full text-sm font-medium"
            >
              <span>{getEmoji(ing.name)}</span>
              <span>{ing.name}</span>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                aria-label={`Remove ${ing.name}`}
                className="hover:text-[#E63946] ml-1"
              >
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addIngredient}
          placeholder={ingredients.length === 0 ? 'Type an ingredient and press Enter...' : ''}
          className="flex-1 min-w-[120px] outline-none text-sm py-1"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add an ingredient</p>
    </div>
  );
}