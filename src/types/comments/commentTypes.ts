import type { User } from "../users/userTypes";

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
	pagination: CommentsPagination;
}

export interface AddCommentData {
	content: string;
	recipeId: string;
}

export interface UpdateCommentData {
	content: string;
	commentId: string;
}

export interface DeleteCommentData {
	commentId: string;
}

export interface CommentQueryParams {
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
}

export interface CommentsPagination {
	page: number;
	totalPages: number;
	totalComments: number;
	hasNext: boolean;
	hasPrev: boolean;
	limit: number;
}
