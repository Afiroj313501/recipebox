import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import IngredientChipsInput from '../components/IngredientChipsInput';
import SuggestionCard from '../components/SuggestionCard';
import CookingLoader from '../components/CookingLoader';
import { getSuggestions } from '../api/suggest';

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
];

export default function Suggest() {
  const [ingredients, setIngredients] = useState([]);
  const [mealType, setMealType] = useState('dinner');

  const mutation = useMutation({
    mutationFn: getSuggestions,
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Could not get suggestions');
    },
  });

  function handleSubmit() {
    if (ingredients.length === 0) {
      toast.error('Add at least one ingredient');
      return;
    }
    mutation.mutate({
      ingredients: ingredients.map((ingredient) => ingredient.name),
      mealType,
    });
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D1D1D] mb-1">What can I cook?</h1>
        <p className="text-gray-500 mb-6">
          Tell me what's in your kitchen, and I'll find recipes that fit.
        </p>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients
          </label>
          <IngredientChipsInput ingredients={ingredients} onChange={setIngredients} />

          <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
            Meal type
          </label>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {mealTypes.map((meal) => (
              <button
                key={meal.value}
                type="button"
                onClick={() => setMealType(meal.value)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-3 transition-all ${
                  mealType === meal.value
                    ? 'border-[#E63946] bg-[#E63946]/5 -translate-y-0.5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{meal.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{meal.label}</span>
              </button>
            ))}
          </div>

          <Button onClick={handleSubmit} disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? 'Finding recipes...' : 'Find recipes'}
          </Button>
        </div>

        {mutation.isPending && <CookingLoader />}

        {!mutation.isPending && mutation.data && mutation.data.results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🤔</p>
            <p className="text-gray-500">
              No close matches yet. Try adding more ingredients, or add more recipes to your box.
            </p>
          </div>
        )}

        {!mutation.isPending && mutation.data && mutation.data.results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mutation.data.results.map((result, index) => (
              <SuggestionCard key={result._id || index} result={result} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}