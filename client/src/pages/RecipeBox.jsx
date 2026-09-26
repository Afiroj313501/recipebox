import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getMyRecipes } from '../api/recipes';
import RecipeCard from '../components/RecipeCard';

export default function RecipeBox() {
  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['my-recipes'],
    queryFn: getMyRecipes,
  });

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1D1D1D]">Your Recipe Box</h1>
        <Button asChild>
          <Link to="/recipes/new">+ Add Recipe</Link>
        </Button>
      </div>

      {isLoading && <p className="text-gray-500">Loading your recipes...</p>}
      {isError && <p className="text-red-500">Something went wrong loading your recipes.</p>}

      {recipes && recipes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍳</p>
          <p className="text-gray-500 mb-4">Nothing here yet — add your first recipe.</p>
          <Button asChild>
            <Link to="/recipes/new">+ Add Recipe</Link>
          </Button>
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