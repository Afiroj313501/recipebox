import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IngredientChipsInput from '../components/IngredientChipsInput';
import { createRecipe, updateRecipe, getRecipeById } from '../api/recipes';
import { uploadImage } from '../api/upload';

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
];

const emptyForm = {
  title: '',
  description: '',
  mealType: 'dinner',
  cuisine: '',
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 20,
  ingredients: [],
  steps: [''],
  visibility: 'private',
};

export default function RecipeForm() {
  const { id } = useParams(); // present when editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(emptyForm);

  // Load existing recipe data when editing
  const { data: existingRecipe } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
    enabled: isEditing,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existingRecipe) {
      setForm({
        title: existingRecipe.title,
        description: existingRecipe.description || '',
        mealType: existingRecipe.mealType,
        cuisine: existingRecipe.cuisine || '',
        servings: existingRecipe.servings,
        prepMinutes: existingRecipe.prepMinutes,
        cookMinutes: existingRecipe.cookMinutes,
        ingredients: existingRecipe.ingredients,
        steps: existingRecipe.steps.length ? existingRecipe.steps : [''],
        visibility: existingRecipe.visibility,
      });
      setImagePreview(existingRecipe.imageUrl || '');
    }
  }, [existingRecipe]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEditing ? updateRecipe(id, payload) : createRecipe(payload),
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
      if (isEditing && recipe.visibility === 'public' && recipe.status === 'pending') {
        toast.success('Updated. It will be reviewed again before going public.');
      } else {
        toast.success(isEditing ? 'Recipe updated!' : 'Recipe created!');
      }
      navigate(`/recipes/${recipe._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Something went wrong');
    },
  });

  function handleStepChange(index, value) {
    const newSteps = [...form.steps];
    newSteps[index] = value;
    setForm({ ...form, steps: newSteps });
  }

  function addStep() {
    setForm({ ...form, steps: [...form.steps, ''] });
  }

  function removeStep(index) {
    setForm({ ...form, steps: form.steps.filter((_, i) => i !== index) });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.ingredients.length === 0) {
      toast.error('Add at least one ingredient');
      return;
    }
    const cleanSteps = form.steps.map((s) => s.trim()).filter(Boolean);
    if (cleanSteps.length === 0) {
      toast.error('Add at least one step');
      return;
    }

    let imageUrl = existingRecipe?.imageUrl || '';

    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        toast.error('Image upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    mutation.mutate({
      ...form,
      imageUrl,
      steps: cleanSteps,
      servings: Number(form.servings),
      prepMinutes: Number(form.prepMinutes),
      cookMinutes: Number(form.cookMinutes),
    });
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#121212] py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-[#1D1D1D] dark:text-gray-100">
          {isEditing ? 'Edit Recipe' : 'New Recipe'}
        </h1>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            placeholder="Grandma's Tomato Pasta"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <label
            htmlFor="recipe-image"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-[#E63946] transition-colors overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImagePlus className="text-gray-400" size={28} />
                <span className="text-sm text-gray-400">Click to upload a photo</span>
              </>
            )}
          </label>
          <input
            id="recipe-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            rows={2}
            placeholder="A quick weeknight classic..."
          />
        </div>

        {/* Meal type tiles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meal type</label>
          <div className="grid grid-cols-4 gap-3">
            {mealTypes.map((mt) => (
              <button
                key={mt.value}
                type="button"
                onClick={() => setForm({ ...form, mealType: mt.value })}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-3 transition-all ${
                  form.mealType === mt.value
                    ? 'border-[#E63946] bg-[#E63946]/5 -translate-y-0.5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{mt.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{mt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Servings / times */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
            <input
              type="number"
              min={1}
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prep (min)</label>
            <input
              type="number"
              min={0}
              value={form.prepMinutes}
              onChange={(e) => setForm({ ...form, prepMinutes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cook (min)</label>
            <input
              type="number"
              min={0}
              value={form.cookMinutes}
              onChange={(e) => setForm({ ...form, cookMinutes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
          <IngredientChipsInput
            ingredients={form.ingredients}
            onChange={(ingredients) => setForm({ ...form, ingredients })}
          />
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
          <div className="space-y-2">
            {form.steps.map((step, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="mt-2 text-sm font-semibold text-[#E63946] w-6">
                  {index + 1}.
                </span>
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  rows={1}
                  placeholder={`Step ${index + 1}...`}
                />
                {form.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="mt-2 text-gray-400 hover:text-[#E63946]"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-2 text-sm text-[#2A9D8F] font-medium hover:underline"
          >
            + Add step
          </button>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, visibility: 'private' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                form.visibility === 'private'
                  ? 'border-[#1D1D1D] bg-[#1D1D1D] text-white'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              🔒 Private
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, visibility: 'public' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                form.visibility === 'public'
                  ? 'border-[#2A9D8F] bg-[#2A9D8F] text-white'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              🌍 Public
            </button>
          </div>
          {form.visibility === 'public' && (
            <p className="text-xs text-gray-500 mt-1">
              Public recipes are reviewed before appearing for others.
            </p>
          )}
        </div>

        <Button type="submit" disabled={mutation.isPending || uploading} className="w-full">
          {uploading ? 'Uploading image...' : mutation.isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create recipe'}
        </Button>
      </form>
    </div>
  );
}