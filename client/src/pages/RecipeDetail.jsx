import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import StarRating from '../components/StarRating';
import CommentsSection from '../components/CommentsSection';
import { getRecipeById, deleteRecipe, rateRecipe } from '../api/recipes';
import { useAuthStore } from '../store/authStore';

const mealTypeEmoji = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
      toast.success('Recipe deleted');
      navigate('/recipes');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete recipe');
    },
  });

  const rateMutation = useMutation({
    mutationFn: (value) => rateRecipe(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
      queryClient.invalidateQueries({ queryKey: ['public-recipes'] });
      toast.success('Thanks for rating!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Could not save your rating');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <p className="text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] gap-3">
        <p className="text-gray-500">Recipe not found, or you don't have access to it.</p>
        <Button asChild variant="outline">
          <Link to="/recipes">Back to Recipe Box</Link>
        </Button>
      </div>
    );
  }

  const isOwner = currentUser?._id === recipe.owner?._id;
  const isPublicApproved = recipe.visibility === 'public' && recipe.status === 'approved';
  const canRate = !isOwner && isPublicApproved && Boolean(currentUser);

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-10 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left column — image + meta */}
        <div>
          <div className="h-64 rounded-2xl bg-gradient-to-br from-[#F4A261] to-[#E63946] flex items-center justify-center text-6xl overflow-hidden mb-4">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              mealTypeEmoji[recipe.mealType] || '🍽️'
            )}
          </div>

          <h1 className="text-3xl font-bold text-[#1D1D1D] mb-2">{recipe.title}</h1>
          {recipe.owner?.name && (
            <p className="text-sm text-gray-500 mb-2">by {recipe.owner.name}</p>
          )}
          {recipe.description && (
            <p className="text-gray-600 mb-4">{recipe.description}</p>
          )}

          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
            <span className="bg-white px-3 py-1 rounded-full shadow-sm capitalize">
              {mealTypeEmoji[recipe.mealType]} {recipe.mealType}
            </span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">
              🍽️ {recipe.servings} servings
            </span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">
              ⏱️ {recipe.prepMinutes + recipe.cookMinutes} min total
            </span>
          </div>

          {isPublicApproved && (
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(recipe.rating)} readOnly />
                <span className="text-sm text-gray-600">
                  {recipe.ratingsCount > 0
                    ? `${recipe.rating.toFixed(1)} (${recipe.ratingsCount})`
                    : 'No ratings yet'}
                </span>
              </div>

              {canRate && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {recipe.myRating ? 'Your rating' : 'Rate this recipe'}
                  </p>
                  <StarRating
                    value={recipe.myRating || 0}
                    onChange={(v) => rateMutation.mutate(v)}
                  />
                </div>
              )}
            </div>
          )}

          {isOwner && (
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to={`/recipes/${recipe._id}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('Delete this recipe? This can\'t be undone.')) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>

        {/* Right column — ingredients + steps */}
        <div>
          <h2 className="text-lg font-semibold text-[#1D1D1D] mb-3">Ingredients</h2>
          <ul className="space-y-2 mb-6">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-sm text-gray-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" />
                {ing.raw || `${ing.qty ?? ''} ${ing.unit ?? ''} ${ing.name}`.trim()}
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold text-[#1D1D1D] mb-3">Steps</h2>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E63946] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <CommentsSection recipeId={recipe._id} />
      </div>
    </div>
  );
}