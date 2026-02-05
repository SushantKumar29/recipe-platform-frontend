export interface User {
	_id: string;
	name: string;
	email: string;
}

export interface Rating {
	_id: string;
	value: number;
	author: User;
	recipe: string;
	createdAt: string;
	updatedAt: string;
}

export interface Comment {
	_id: string;
	content: string;
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
	image?: string;
	author: string | User;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	__v?: number;
	ratingCount: number;
	averageRating: number;
}

export interface RecipeDetail extends Recipe {
	comments: Comment[];
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
