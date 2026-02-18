import type { AppDispatch, RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createRecipe } from '@/slices/recipes/recipeThunks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

type RecipeFormValues = {
  title: string;
  ingredients: string;
  preparationTime: number;
  steps: string;
  image: FileList;
};

const NewRecipePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>();

  const onSubmit = async (data: RecipeFormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('ingredients', data.ingredients);
      formData.append('preparationTime', String(data.preparationTime));
      formData.append('steps', data.steps);
      formData.append('image', data?.image?.[0]);

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

            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    placeholder="Chocolate Cake"
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: {
                        value: 100,
                        message: 'Title must be under 100 characters',
                      },
                    })}
                  />
                  {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="ingredients">Ingredients</FieldLabel>
                  <Textarea
                    id="ingredients"
                    placeholder="Flour, Sugar, Cocoa powder..."
                    {...register('ingredients', {
                      required: 'Ingredients are required',
                      minLength: {
                        value: 10,
                        message: 'Please add more detailed ingredients',
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
                      required: 'Preparation time is required',
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: 'Must be at least 1 minute',
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
                    placeholder="Step 1: Preheat oven..."
                    {...register('steps', {
                      required: 'Steps are required',
                      minLength: {
                        value: 20,
                        message: 'Steps should be more detailed',
                      },
                    })}
                  />
                  {errors.steps && <p className="text-xs text-red-600">{errors.steps.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="image">Recipe Image</FieldLabel>
                  <Input id="image" type="file" accept="image/*" {...register('image')} />
                  {errors.image && <p className="text-xs text-red-600">{errors.image.message}</p>}
                </Field>
                <Field
                  orientation="horizontal"
                  className="flex-col sm:flex-row gap-2 sm:gap-3 mt-6"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default NewRecipePage;
