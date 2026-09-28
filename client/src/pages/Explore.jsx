import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPublicRecipes } from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import FilterBar from '../components/FilterBar';
import useDebounce from '../hooks/useDebounce';

export default function Explore() {
  const [q, setQ] = useState('');
  const [mealType, setMealType] = useState('');
  const debouncedQ = useDebounce(q, 400);
  const hasFilters = Boolean(debouncedQ || mealType);

  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['public-recipes', { q: debouncedQ, mealType }],
    queryFn: () =>
      getPublicRecipes({
        q: debouncedQ || undefined,
        mealType: mealType || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-8">
      <h1 className="text-2xl font-bold text-[#1D1D1D] mb-1">Explore</h1>
      <p className="text-gray-500 mb-6">Recipes shared by the community.</p>

      <FilterBar
        q={q}
        onQChange={setQ}
        mealType={mealType}
        onMealTypeChange={setMealType}
      />

      {isLoading && <p className="text-gray-500">Loading recipes...</p>}
      {isError && <p className="text-red-500">Could not load recipes.</p>}

      {recipes && recipes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">{hasFilters ? '🔍' : '🍽️'}</p>
          <p className="text-gray-500">
            {hasFilters
              ? 'No recipes match those filters.'
              : 'No shared recipes yet. Be the first to publish one!'}
          </p>
        </div>
      )}

      {recipes && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}