import type { User } from '@/types/users/userTypes';

export interface Rating {
  id: string;
  value: number;
  author: User;
  authorId: string;
  recipe: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  image?: string | { url: string; publicId: string };
  author: string | User;
  isPublished: boolean;
  preparationTime: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  ratingCount?: number;
  averageRating?: number;
}

export interface RecipeDetail extends Recipe {
  ratings: Rating[];
  averageRating?: number;
  ratingCount?: number;
  userRating?: number;
}

export interface RecipesResponse {
  data: Recipe[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RecipeFilters {
  search: string;
  preparationTime: string;
  minRating: string;
  sortBy: string;
  sortOrder: string;
  authorId?: string;
}
