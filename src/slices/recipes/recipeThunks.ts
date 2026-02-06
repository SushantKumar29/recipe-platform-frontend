import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
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
} from "./recipeSlice";
import type { RecipesResponse } from "./recipeTypes";
import type {
	AddCommentData,
	CommentResponse,
} from "@/types/comments/commentTypes";

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

export const fetchRecipeComments = createAsyncThunk(
	"recipes/fetchComments",
	async (
		{
			recipeId,
			page = 1,
			limit = 10,
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
					comments: responseData.comments,
					pagination: responseData.pagination,
				}),
			);
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			} else {
				dispatch(fetchCommentsError());
				throw error;
			}
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
			return res.data.comment;
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				dispatch(rateLimited());
			}
			throw error;
		}
	},
);
