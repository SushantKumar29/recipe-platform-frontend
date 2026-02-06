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
}

export interface RecipeDetail extends Recipe {
	ratings: Rating[];
	id?: string;
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
