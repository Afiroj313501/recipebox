import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getMyRecipes } from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import FilterBar from '../components/FilterBar';
import useDebounce from '../hooks/useDebounce';

export default function RecipeBox() {
  const [q, setQ] = useState('');
  const [mealType, setMealType] = useState('');

  const debouncedQ = useDebounce(q, 400);
  const hasFilters = Boolean(debouncedQ || mealType);

  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['my-recipes', { q: debouncedQ, mealType }],
    queryFn: () =>
      getMyRecipes({
        q: debouncedQ || undefined,
        mealType: mealType || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1D1D1D]">Your Recipe Box</h1>
        <Button asChild>
          <Link to="/recipes/new">+ Add Recipe</Link>
        </Button>
      </div>

      <FilterBar
        q={q}
        onQChange={setQ}
        mealType={mealType}
        onMealTypeChange={setMealType}
      />

      {isLoading && <p className="text-gray-500">Loading your recipes...</p>}
      {isError && (
        <p className="text-red-500">Something went wrong loading your recipes.</p>
      )}

      {recipes && recipes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">{hasFilters ? '🔍' : '🍳'}</p>
          <p className="text-gray-500 mb-4">
            {hasFilters
              ? 'No recipes match those filters.'
              : 'Nothing here yet — add your first recipe.'}
          </p>
          {!hasFilters && (
            <Button asChild>
              <Link to="/recipes/new">+ Add Recipe</Link>
            </Button>
          )}
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