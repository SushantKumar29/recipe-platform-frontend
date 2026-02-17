import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import type { User } from "./authTypes";
import { camelizeKeys } from "@/lib/formatters";

export const registerUser = createAsyncThunk<
	{ user: User; token: string },
	{ name: string; email: string; password: string }
>("auth/signup", async (credentials, thunkAPI) => {
	try {
		const res = await api.post("/auth/signup", credentials);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			return thunkAPI.rejectWithValue(err.message);
		}
		return thunkAPI.rejectWithValue("Signup failed");
	}
});

export const loginUser = createAsyncThunk<
	{ user: User; token: string },
	{ email: string; password: string }
>("auth/login", async (credentials, thunkAPI) => {
	try {
		const res = await api.post("/auth/login", credentials);
		return camelizeKeys(res.data);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return thunkAPI.rejectWithValue(err.message);
		}
		return thunkAPI.rejectWithValue("Login failed");
	}
});
