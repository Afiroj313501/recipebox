import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ProgressRing from './ProgressRing';
import { createRecipe } from '../api/recipes';

const mealTypeEmoji = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export default function SuggestionCard({ result, index }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const total = result.have.length + result.missing.length;

  const saveMutation = useMutation({
    mutationFn: () =>
      createRecipe({
        title: result.title,
        mealType: result.mealType,
        prepMinutes: result.prepMinutes || 0,
        cookMinutes: result.cookMinutes || 0,
        servings: 2,
        ingredients: [
          ...result.have.map((name) => ({ name: name.toLowerCase(), raw: name })),
          ...result.missing.map((name) => ({ name: name.toLowerCase(), raw: name })),
        ],
        steps: result.steps?.length ? result.steps : ['Steps not provided — edit to add your own.'],
        tags: result.tags || [],
        isAISuggestion: true,
        visibility: 'private',
      }),
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
      toast.success('Saved to your Recipe Box!');
      navigate(`/recipes/${recipe._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Could not save recipe');
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-[#1D1D1D]">{result.title}</h3>
          <p className="text-xs text-gray-500 capitalize">
            {mealTypeEmoji[result.mealType]} {result.mealType}
            {(result.prepMinutes || result.cookMinutes) > 0 &&
              ` · ${result.prepMinutes + result.cookMinutes} min`}
          </p>
        </div>
        <ProgressRing have={result.have.length} total={total} />
      </div>

      {result.missing.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Missing</p>
          <div className="flex flex-wrap gap-1">
            {result.missing.map((ingredient) => (
              <span
                key={ingredient}
                className="text-xs bg-[#F4A261]/15 text-[#b5651d] px-2 py-0.5 rounded-full"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}

      {result._id ? (
        <Link
          to={`/recipes/${result._id}`}
          className="inline-block text-sm font-medium text-[#E63946] hover:underline"
        >
          Cook this →
        </Link>
      ) : (
        <Button
          size="sm"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : '+ Save to Recipe Box'}
        </Button>
      )}
    </motion.div>
  );
}
