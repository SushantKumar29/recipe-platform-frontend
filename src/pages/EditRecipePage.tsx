import type { AppDispatch, RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchRecipeById, updateRecipe } from '@/slices/recipes/recipeThunks';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

type RecipeFormValues = {
  title: string;
  ingredients: string;
  preparationTime: number;
  steps: string;
  image: FileList;
};

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const { selectedRecipe, loading } = useSelector((state: RootState) => state.recipes);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchRecipeById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedRecipe) {
      reset({
        title: selectedRecipe.title,
        ingredients: selectedRecipe.ingredients.join('\n'),
        preparationTime: selectedRecipe.preparationTime,
        steps: selectedRecipe.steps.join('\n'),
      });
    }
  }, [selectedRecipe, reset]);

  const onSubmit = async (data: RecipeFormValues) => {
    try {
      if (!id) return;

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('ingredients', data.ingredients);
      formData.append('preparationTime', String(data.preparationTime));
      formData.append('steps', data.steps);

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
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
  const imageUrl =
    typeof selectedRecipe?.image === 'string' ? selectedRecipe.image : selectedRecipe?.image?.url;

  if (loading || !selectedRecipe) {
    return <div className="py-24 text-center text-gray-600">Loading recipe...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="h-full my-12 py-12">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft /> Back
            </Button>
          </div>
          <div className="w-full max-w-4xl bg-white border-[#00ff9D] border-t-4 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Recipe</h1>
            </div>

            {imageUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={imageUrl}
                  alt={selectedRecipe.title}
                  className="h-40 rounded-md object-cover"
                />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: {
                        value: 100,
                        message: 'Max 100 characters',
                      },
                    })}
                  />
                  {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="ingredients">Ingredients</FieldLabel>
                  <Textarea
                    id="ingredients"
                    {...register('ingredients', {
                      required: 'Ingredients are required',
                      minLength: {
                        value: 10,
                        message: 'Add more details',
                      },
                    })}
                  />
                  {errors.ingredients && (
                    <p className="text-xs text-red-600">{errors.ingredients.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="preparationTime">Preparation Time (minutes)</FieldLabel>
                  <Input
                    id="preparationTime"
                    type="number"
                    {...register('preparationTime', {
                      required: 'Required',
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: 'Minimum 1 minute',
                      },
                    })}
                  />
                  {errors.preparationTime && (
                    <p className="text-xs text-red-600">{errors.preparationTime.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="steps">Steps</FieldLabel>
                  <Textarea
                    id="steps"
                    {...register('steps', {
                      required: 'Steps are required',
                      minLength: {
                        value: 20,
                        message: 'Too short',
                      },
                    })}
                  />
                  {errors.steps && <p className="text-xs text-red-600">{errors.steps.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="image">Replace Image (optional)</FieldLabel>
                  <Input id="image" type="file" accept="image/*" {...register('image')} />
                </Field>

                <Field className="mt-6">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? 'Updating...' : 'Update Recipe'}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipePage;
