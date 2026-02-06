import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Recipe, RecipeDetail } from "./recipeTypes";
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
		fetchCommentsError(state) {
			state.commentsLoading = false;
		},
		clearComments(state) {
			state.comments = [];
			state.commentsPagination = null;
		},
	},
});

export const {
	fetchStart,
	setRecipes,
	setRecipeDetail,
	fetchError,
	rateLimited,
	clearSelectedRecipe,
	fetchCommentsStart,
	setComments,
	addComment,
	fetchCommentsError,
	clearComments,
} = recipeSlice.actions;

export default recipeSlice.reducer;
