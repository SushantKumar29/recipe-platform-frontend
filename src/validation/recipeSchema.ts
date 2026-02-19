import { z } from 'zod';

export const recipeSchema = z.object({
  title: z
    .string('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must be at most 50 characters'),
  ingredients: z.string().min(1, 'Ingredients are required'),
  steps: z.string().min(1, 'Steps are required').min(8, 'Steps must be at least 8 characters'),
  preparationTime: z
    .number('Preparation time is required')
    .min(1, 'Preparation time must be at least 1 minute')
    .max(1440, 'Preparation time must be at most 24 hours'),
  image: z.any().optional(),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
