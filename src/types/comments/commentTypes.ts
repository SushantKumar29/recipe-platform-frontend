import type { User } from "@/types/users/userTypes";

export interface Comment {
	_id: string;
	content: string;
	author: User;
	recipe: string;
	createdAt: string;
	updatedAt: string;
}

export interface CommentResponse {
	comments: Comment[];
	pagination: {
		page: number;
		totalPages: number;
		totalComments: number;
		hasNext: boolean;
		hasPrev: boolean;
		limit: number;
	};
}

export interface AddCommentData {
	content: string;
	recipeId: string;
}

export interface CommentQueryParams {
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
}
