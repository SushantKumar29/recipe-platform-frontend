import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/axios";
import {
	fetchStart,
	setRecipes,
	fetchError,
	rateLimited,
	setRecipeDetail,
} from "./recipeSlice";
import type { RecipesResponse } from "./recipeTypes";

export const fetchRecipes = createAsyncThunk(
	"recipes/fetchAll",
	async (_, { dispatch }) => {
		try {
			dispatch(fetchStart());
			const res = await api.get("/recipes");

			const responseData = res.data as RecipesResponse;

			if (responseData.data) {
				dispatch(
					setRecipes({
						data: responseData.data,
						pagination: responseData.pagination,
					}),
				);
			} else {
				dispatch(
					setRecipes({
						data: res.data,
						pagination: null,
					}),
				);
			}
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			} else {
				dispatch(fetchError());
				throw error;
			}
		}
	},
);

export const fetchRecipeById = createAsyncThunk(
	"recipes/fetchById",
	async (id: string, { dispatch }) => {
		try {
			dispatch(fetchStart());
			const res = await api.get(`/recipes/${id}`);
			dispatch(setRecipeDetail(res.data));
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			} else {
				dispatch(fetchError());
				throw error;
			}
		}
	},
);
