import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import api from "@/lib/axios";
import {
	fetchStart,
	setRecipes,
	fetchError,
	rateLimited,
	setRecipeDetail,
	setComments,
	fetchCommentsStart,
	addComment,
	fetchCommentsError,
	updateComment,
	deleteComment,
	setUpdatingCommentId,
	setDeletingCommentId,
} from "./recipeSlice";
import type { RecipesResponse } from "../../types/recipes/recipeTypes";
import type {
	AddCommentData,
	UpdateCommentData,
	DeleteCommentData,
	CommentResponse,
} from "@/types/comments/commentTypes";
import { camelizeKeys } from "@/lib/formatters";

export const fetchRecipes = createAsyncThunk(
	"recipes/fetchAll",
	async (
		params: {
			search?: string;
			authorId?: string;
			preparationTime?: string;
			minRating?: number;
			page?: number;
			limit?: number;
			sortBy?: string;
			sortOrder?: string;
		} = {},
		{ dispatch },
	) => {
		try {
			dispatch(fetchStart());

			const queryParams: Record<string, string | number> = {};

			if (params?.search) queryParams.search = params.search;
			if (params?.authorId) queryParams.authorId = params.authorId;
			if (params?.preparationTime)
				queryParams.preparationTime = params.preparationTime;
			if (params?.minRating) queryParams.minRating = params.minRating;
			if (params?.page) queryParams.page = params.page;
			if (params?.limit) queryParams.limit = params.limit;
			if (params?.sortBy) queryParams.sortBy = params.sortBy;
			if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

			const res = await api.get("/recipes", { params: queryParams });

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

			return camelizeKeys(responseData);
		} catch (error: unknown) {
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
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			} else {
				dispatch(fetchError());
				throw error;
			}
		}
	},
);

export const fetchRecipeComments = createAsyncThunk(
	"recipes/fetchComments",
	async (
		{
			recipeId,
			page = 1,
			limit = 3,
			sortBy = "createdAt",
			sortOrder = "desc",
		}: {
			recipeId: string;
			page?: number;
			limit?: number;
			sortBy?: string;
			sortOrder?: string;
		},
		{ dispatch },
	) => {
		try {
			dispatch(fetchCommentsStart());

			const res = await api.get(`/recipes/${recipeId}/comments`, {
				params: {
					page,
					limit,
					sortBy,
					sortOrder,
				},
			});

			const responseData = res.data as CommentResponse;
			dispatch(
				setComments({
					comments: camelizeKeys(responseData.comments),
					pagination: responseData.pagination,
				}),
			);
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			} else {
				dispatch(fetchCommentsError());
				throw error;
			}
		}
	},
);

export const createRecipe = createAsyncThunk(
	"recipes/createRecipe",
	async (formData: FormData, { rejectWithValue }) => {
		try {
			const response = await api.post("/recipes", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return camelizeKeys(response.data);
		} catch (error) {
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || "Failed to create recipe",
				);
			}
			return rejectWithValue("Failed to create recipe");
		}
	},
);

export const updateRecipe = createAsyncThunk(
	"recipes/updateRecipe",
	async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
		try {
			const response = await api.put(`/recipes/${id}`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return camelizeKeys(response.data);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || "Failed to update recipe",
				);
			}
			return rejectWithValue("Failed to update recipe");
		}
	},
);

export const deleteRecipe = createAsyncThunk(
	"recipes/deleteRecipe",
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await api.delete(`/recipes/${id}`);
			return camelizeKeys(response.data);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || "Failed to delete recipe",
				);
			}
			return rejectWithValue("Failed to delete recipe");
		}
	},
);

export const rateRecipe = createAsyncThunk(
	"recipes/rateRecipe",
	async (
		{ recipeId, value }: { recipeId: string; value: number },
		{ rejectWithValue },
	) => {
		try {
			const response = await api.post(`/recipes/${recipeId}/rate`, { value });
			return camelizeKeys(response.data);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || "Failed to rate recipe",
				);
			}
			return rejectWithValue("Failed to rate recipe");
		}
	},
);

export const addNewComment = createAsyncThunk(
	"recipes/addComment",
	async (commentData: AddCommentData, { dispatch }) => {
		try {
			const res = await api.post(`/recipes/${commentData.recipeId}/comments`, {
				content: commentData.content,
			});

			dispatch(addComment(res.data.comment));
			return camelizeKeys(res.data.comment);
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			}
			throw error;
		}
	},
);

export const updateRecipeComment = createAsyncThunk(
	"recipes/updateComment",
	async (
		{ commentId, content }: UpdateCommentData,
		{ dispatch, rejectWithValue },
	) => {
		try {
			dispatch(setUpdatingCommentId(commentId));

			const res = await api.put(`/comments/${commentId}`, {
				content,
			});

			dispatch(updateComment(res.data.comment));
			return res.data.comment;
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			}
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || "Failed to update comment",
				);
			}
			return rejectWithValue("Failed to update comment");
		} finally {
			dispatch(setUpdatingCommentId(null));
		}
	},
);

export const deleteRecipeComment = createAsyncThunk(
	"recipes/deleteComment",
	async ({ commentId }: DeleteCommentData, { dispatch, rejectWithValue }) => {
		try {
			dispatch(setDeletingCommentId(commentId));

			await api.delete(`/comments/${commentId}`);

			dispatch(deleteComment(commentId));
			return commentId;
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			}
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || "Failed to delete comment",
				);
			}
			return rejectWithValue("Failed to delete comment");
		} finally {
			dispatch(setDeletingCommentId(null));
		}
	},
);
