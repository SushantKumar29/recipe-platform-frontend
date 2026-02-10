import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import type { User } from "./authTypes";

export const registerUser = createAsyncThunk<
	{ user: User; token: string },
	{ name: string; email: string; password: string }
>("auth/signup", async (credentials, thunkAPI) => {
	try {
		const res = await api.post("/auth/signup", credentials);
		return res.data;
	} catch (err: any) {
		return thunkAPI.rejectWithValue(
			err.response?.data?.message || "Signup failed",
		);
	}
});

export const loginUser = createAsyncThunk<
	{ user: User; token: string },
	{ email: string; password: string }
>("auth/login", async (credentials, thunkAPI) => {
	try {
		const res = await api.post("/auth/login", credentials);
		return res.data;
	} catch (err: any) {
		return thunkAPI.rejectWithValue(
			err.response?.data?.message || "Login failed",
		);
	}
});
