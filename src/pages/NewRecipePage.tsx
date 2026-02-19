import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import type { AppDispatch, RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { createRecipe } from '@/slices/recipes/recipeThunks';
import RecipeForm, { type RecipeFormValues } from '@/components/recipes/RecipeForm';

const NewRecipePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: RecipeFormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('ingredients', data.ingredients);
      formData.append('preparationTime', String(data.preparationTime));
      formData.append('steps', data.steps);
      if (data.image) {
        formData.append('image', data.image);
      }

      await dispatch(createRecipe(formData)).unwrap();
      toast.success('Recipe created successfully');
      navigate('/');
    } catch (err: unknown) {
      toast.error(
        typeof err === 'string'
          ? err
          : (err as { message: string })?.message || 'Failed to create recipe',
      );
    }
  };

  if (!isAuthenticated) {
    return null;
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Your Recipe</h1>
            </div>

            <RecipeForm onSubmit={handleSubmit} submitButtonText="Submit" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRecipePage;
