import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/users';
import RecipeCard from '../components/RecipeCard';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { id } = useParams();
  const currentUser = useAuthStore((s) => s.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getUserProfile(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] dark:bg-[#121212]">
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] dark:bg-[#121212]">
        <p className="text-gray-500 dark:text-gray-400">User not found.</p>
      </div>
    );
  }

  const { user, recipes } = data;
  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#121212] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F4A261] to-[#E63946] flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1D] dark:text-gray-100">
              {user.name}
              {isOwnProfile && (
                <span className="text-sm font-normal text-gray-400 ml-2">(you)</span>
              )}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {recipes.length} shared recipe{recipes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-gray-500 dark:text-gray-400">
              {isOwnProfile
                ? "You haven't shared any public recipes yet."
                : "This person hasn't shared any public recipes yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={{ ...recipe, owner: user }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
