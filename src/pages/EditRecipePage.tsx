import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import type { AppDispatch, RootState } from '@/app/store';
import RecipeForm, { type RecipeFormValues } from '@/components/recipes/RecipeForm';
import { Button } from '@/components/ui/button';
import { fetchRecipeById, updateRecipe } from '@/slices/recipes/recipeThunks';

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { selectedRecipe, loading } = useSelector((state: RootState) => state.recipes);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchRecipeById(id));
  }, [id, dispatch]);

  const handleSubmit = async (data: RecipeFormValues) => {
    try {
      if (!id) return;

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('ingredients', data.ingredients);
      formData.append('preparationTime', String(data.preparationTime));
      formData.append('steps', data.steps);
      if (data.image) {
        formData.append('image', data.image);
      }

      await dispatch(updateRecipe({ id, data: formData })).unwrap();
      toast.success('Recipe updated successfully');
      navigate(`/recipes/${id}`);
    } catch (err: unknown) {
      toast.error(
        typeof err === 'string'
          ? err
          : (err as { message: string })?.message || 'Failed to update recipe',
      );
    }
  };

  const initialValues = selectedRecipe
    ? {
        title: selectedRecipe.title,
        ingredients: selectedRecipe.ingredients.join('\n'),
        preparationTime: selectedRecipe.preparationTime,
        steps: selectedRecipe.steps.join('\n'),
      }
    : undefined;

  const imagePreviewUrl =
    selectedRecipe &&
    (typeof selectedRecipe.image === 'string' ? selectedRecipe.image : selectedRecipe.image?.url);

  if (!isAuthenticated) return null;
  if (loading || !selectedRecipe) {
    return <div className="py-24 text-center text-gray-600">Loading recipe...</div>;
  }

  return (
    <div className="h-full my-12 py-12">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft /> Back
            </Button>
          </div>
          <div className="bg-white border-[#00ff9D] border-t-4 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Recipe</h1>
            </div>

            <RecipeForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              isSubmitting={false}
              submitButtonText="Update Recipe"
              imagePreviewUrl={imagePreviewUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipePage;
