import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeSchema, type RecipeFormData } from '@/validation/recipeSchema';

export type RecipeFormValues = RecipeFormData;

type RecipeFormProps = {
  initialValues?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitButtonText: string;
  imagePreviewUrl?: string | null;
};

const RecipeForm = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText,
  imagePreviewUrl,
}: RecipeFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipeFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(recipeSchema),
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-2">
        {/* Title Field */}
        <Field className="gap-1">
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" placeholder="Chocolate Cake" {...register('title')} />
          <div className="min-h-6">
            {errors.title && (
              <p className="text-xs sm:text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
        </Field>

        {/* Ingredients Field */}
        <Field className="gap-1">
          <FieldLabel htmlFor="ingredients">Ingredients</FieldLabel>
          <Textarea
            id="ingredients"
            placeholder="Flour, Sugar, Cocoa powder..."
            {...register('ingredients')}
          />
          <div className="min-h-6">
            {errors.ingredients && (
              <p className="text-xs sm:text-sm text-red-600">{errors.ingredients.message}</p>
            )}
          </div>
        </Field>

        {/* Preparation Time Field */}
        <Field className="gap-1">
          <FieldLabel htmlFor="preparationTime">Preparation Time (minutes)</FieldLabel>
          <Input
            id="preparationTime"
            type="number"
            {...register('preparationTime', { valueAsNumber: true })}
          />
          <div className="min-h-6">
            {errors.preparationTime && (
              <p className="text-xs sm:text-sm text-red-600">{errors.preparationTime.message}</p>
            )}
          </div>
        </Field>

        {/* Steps Field */}
        <Field className="gap-1">
          <FieldLabel htmlFor="steps">Steps</FieldLabel>
          <Textarea id="steps" placeholder="Step 1: Preheat oven..." {...register('steps')} />
          <div className="min-h-6">
            {errors.steps && (
              <p className="text-xs sm:text-sm text-red-600">{errors.steps.message}</p>
            )}
          </div>
        </Field>

        {/* Image Field – with setValueAs to convert FileList → File | undefined */}
        <Field className="gap-1">
          <FieldLabel htmlFor="image">
            {imagePreviewUrl ? 'Replace Image (optional)' : 'Recipe Image'}
          </FieldLabel>
          {imagePreviewUrl && (
            <div className="mb-2 flex justify-center">
              <img
                src={imagePreviewUrl}
                alt="Current recipe"
                className="h-40 rounded-md object-cover"
              />
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register('image', {
              setValueAs: (value: FileList) => (value?.length ? value[0] : undefined),
            })}
          />
          <div className="min-h-6">
            {errors.image && (
              <p className="text-xs sm:text-sm text-red-600">
                {(errors.image as { message: string }).message}
              </p>
            )}
          </div>
        </Field>

        {/* Submit Button */}
        <Field orientation="horizontal" className="flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default RecipeForm;
