import { Link, useNavigate } from 'react-router-dom';

const mealTypeEmoji = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden"
    >
      <div className="h-40 bg-gradient-to-br from-[#F4A261] to-[#E63946] flex items-center justify-center text-4xl">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          mealTypeEmoji[recipe.mealType] || '🍽️'
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1D1D1D] truncate">{recipe.title}</h3>
        <p className="text-sm text-gray-500 capitalize">
          {recipe.mealType} · {recipe.ingredients.length} ingredients
        </p>
        {recipe.owner?.name && (
          <Link
            to={`/users/${recipe.owner._id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-gray-400 hover:text-[#E63946] mt-0.5 block w-fit"
          >
            by {recipe.owner.name}
          </Link>
        )}
        {recipe.ratingsCount > 0 && (
          <p className="text-xs text-[#b5651d] mt-1">
            ★ {recipe.rating.toFixed(1)} ({recipe.ratingsCount})
          </p>
        )}
        {recipe.visibility === 'public' && (
          <span
            className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
              recipe.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : recipe.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {recipe.status}
          </span>
        )}
      </div>
    </div>
  );
}