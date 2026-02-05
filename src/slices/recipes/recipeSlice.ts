import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Recipe, RecipeDetail } from "./recipeTypes";

interface RecipeState {
	items: Recipe[];
	selectedRecipe: RecipeDetail | null;
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
} = recipeSlice.actions;

export default recipeSlice.reducer;
