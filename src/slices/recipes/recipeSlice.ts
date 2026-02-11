import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Recipe, RecipeDetail } from "../../types/recipes/recipeTypes";
import type { Comment } from "@/types/comments/commentTypes";

interface RecipeState {
	items: Recipe[];
	selectedRecipe: RecipeDetail | null;
	comments: Comment[];
	commentsLoading: boolean;
	commentsPagination: {
		page: number;
		totalPages: number;
		totalComments: number;
		hasNext: boolean;
		hasPrev: boolean;
		limit: number;
	} | null;
	loading: boolean;
	isRateLimited: boolean;
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	} | null;
	ratingLoading: boolean;
	ratingError: string | null;
	userRating: {
		recipeId: string;
		value: number;
	} | null;
	updatingCommentId: string | null;
	deletingCommentId: string | null;
}

const initialState: RecipeState = {
	items: [],
	selectedRecipe: null,
	comments: [],
	commentsLoading: false,
	commentsPagination: null,
	loading: false,
	isRateLimited: false,
	pagination: null,
	ratingLoading: false,
	ratingError: null,
	userRating: null,
	updatingCommentId: null,
	deletingCommentId: null,
};

interface SetRecipesPayload {
	data: Recipe[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	} | null;
}

interface SetCommentsPayload {
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

const recipeSlice = createSlice({
	name: "recipes",
	initialState,
	reducers: {
		fetchStart(state) {
			state.loading = true;
			state.isRateLimited = false;
		},
		setRecipes(state, action: PayloadAction<SetRecipesPayload>) {
			state.items = action.payload.data;
			state.pagination = action.payload.pagination || null;
			state.loading = false;
		},
		setRecipeDetail(state, action: PayloadAction<RecipeDetail>) {
			state.selectedRecipe = action.payload;
			state.loading = false;
		},
		updateRecipeRating(
			state,
			action: PayloadAction<{ averageRating: number; ratingCount: number }>,
		) {
			if (state.selectedRecipe) {
				state.selectedRecipe.averageRating = action.payload.averageRating;
				state.selectedRecipe.ratingCount = action.payload.ratingCount;
			}
		},
		setUserRating(
			state,
			action: PayloadAction<{ recipeId: string; value: number } | null>,
		) {
			state.userRating = action.payload;
		},
		fetchError(state) {
			state.loading = false;
		},
		rateLimited(state) {
			state.loading = false;
			state.isRateLimited = true;
		},
		clearSelectedRecipe(state) {
			state.selectedRecipe = null;
			state.comments = [];
			state.commentsPagination = null;
			state.userRating = null;
		},
		fetchCommentsStart(state) {
			state.commentsLoading = true;
		},
		setComments(state, action: PayloadAction<SetCommentsPayload>) {
			state.comments = action.payload.comments;
			state.commentsPagination = action.payload.pagination;
			state.commentsLoading = false;
		},
		addComment(state, action: PayloadAction<Comment>) {
			state.comments.unshift(action.payload);
			if (state.commentsPagination) {
				state.commentsPagination.totalComments += 1;
			}
		},

		updateComment(state, action: PayloadAction<Comment>) {
			const index = state.comments.findIndex(
				(comment) => comment._id === action.payload._id,
			);
			if (index !== -1) {
				state.comments[index] = action.payload;
			}
			state.updatingCommentId = null;
		},

		deleteComment(state, action: PayloadAction<string>) {
			state.comments = state.comments.filter(
				(comment) => comment._id !== action.payload,
			);
			if (state.commentsPagination) {
				state.commentsPagination.totalComments -= 1;
			}
			state.deletingCommentId = null;
		},

		setUpdatingCommentId(state, action: PayloadAction<string | null>) {
			state.updatingCommentId = action.payload;
		},

		setDeletingCommentId(state, action: PayloadAction<string | null>) {
			state.deletingCommentId = action.payload;
		},
		fetchCommentsError(state) {
			state.commentsLoading = false;
		},
		clearComments(state) {
			state.comments = [];
			state.commentsPagination = null;
		},
		setRatingLoading(state, action: PayloadAction<boolean>) {
			state.ratingLoading = action.payload;
		},
		setRatingError(state, action: PayloadAction<string | null>) {
			state.ratingError = action.payload;
		},
		clearRatingError(state) {
			state.ratingError = null;
		},
		clearUserRating(state) {
			state.userRating = null;
		},
	},
});

export const {
	fetchStart,
	setRecipes,
	setRecipeDetail,
	updateRecipeRating,
	setUserRating,
	fetchError,
	rateLimited,
	clearSelectedRecipe,
	fetchCommentsStart,
	setComments,
	addComment,
	updateComment,
	deleteComment,
	fetchCommentsError,
	clearComments,
	setRatingLoading,
	setRatingError,
	clearRatingError,
	clearUserRating,
	setUpdatingCommentId,
	setDeletingCommentId,
} = recipeSlice.actions;

export default recipeSlice.reducer;
