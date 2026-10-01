import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { getPendingRecipes, approveRecipe, rejectRecipe } from '../api/admin';
import { useAuthStore } from '../store/authStore';

export default function AdminPending() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['pending-recipes'],
    queryFn: getPendingRecipes,
    enabled: user?.role === 'admin',
  });

  function onDone(message) {
    queryClient.invalidateQueries({ queryKey: ['pending-recipes'] });
    toast.success(message);
  }

  const approveMutation = useMutation({
    mutationFn: approveRecipe,
    onSuccess: () => onDone('Recipe approved'),
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: rejectRecipe,
    onSuccess: () => onDone('Recipe rejected'),
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to reject'),
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] dark:bg-[#121212]">
        <p className="text-gray-500 dark:text-gray-400">Admin access only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#121212] p-8">
      <h1 className="text-2xl font-bold text-[#1D1D1D] dark:text-gray-100 mb-6">Pending recipes</h1>

      {isLoading && <p className="text-gray-500 dark:text-gray-400">Loading queue...</p>}
      {isError && <p className="text-red-500">Could not load the queue.</p>}

      {recipes && recipes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-gray-500 dark:text-gray-400">Nothing waiting for review.</p>
        </div>
      )}

      <div className="space-y-4 max-w-3xl">
        {recipes?.map((recipe) => (
          <div key={recipe._id} className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg text-[#1D1D1D] dark:text-gray-100">{recipe.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  by {recipe.owner?.name || 'Unknown'} · {recipe.mealType}
                </p>
                {recipe.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{recipe.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => approveMutation.mutate(recipe._id)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => rejectMutation.mutate(recipe._id)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  Reject
                </Button>
              </div>
            </div>

            <details className="mt-3">
              <summary className="text-sm text-[#2A9D8F] cursor-pointer font-medium">
                Review ingredients and steps
              </summary>
              <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1 list-disc list-inside">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing.raw || ing.name}</li>
                  ))}
                </ul>
                <ol className="space-y-1 list-decimal list-inside">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}