import type { User } from "@/types/users/userTypes";

export interface Rating {
	_id: string;
	value: number;
	author: User;
	recipe: string;
	createdAt: string;
	updatedAt: string;
}

export interface Recipe {
	_id: string;
	title: string;
	ingredients: string;
	steps: string;
	image?: string | { url: string; publicId: string };
	author: string | User;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	__v?: number;
	ratingCount: number;
	averageRating: number;
	preparationTime: number;
}

export interface RecipeDetail extends Recipe {
	ratings: Rating[];
	id?: string;
	averageRating: number;
	ratingCount: number;
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
