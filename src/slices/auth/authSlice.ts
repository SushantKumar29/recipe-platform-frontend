import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./authTypes";

const loadAuthState = (): AuthState => {
	try {
		const serializedState = localStorage.getItem("auth");
		if (serializedState === null) {
			return {
				user: null,
				token: null,
				isAuthenticated: false,
				loading: false,
				error: null,
			};
		}
		return JSON.parse(serializedState);
	} catch (err) {
		console.error("Error loading auth state from localStorage:", err);
		return {
			user: null,
			token: null,
			isAuthenticated: false,
			loading: false,
			error: null,
		};
	}
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthUser(state, action: PayloadAction<{ user: User; token: string }>) {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			state.error = null;

			localStorage.setItem("auth", JSON.stringify(state));
		},

		logout(state) {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			state.error = null;

			localStorage.removeItem("auth");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase("auth/signup/pending", (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase("auth/signup/fulfilled", (state, action: any) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAuthenticated = true;
				state.error = null;

				localStorage.setItem("auth", JSON.stringify(state));
			})
			.addCase("auth/signup/rejected", (state, action: any) => {
				state.loading = false;
				state.error = action.payload;

				localStorage.removeItem("auth");
			})
			.addCase("auth/login/pending", (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase("auth/login/fulfilled", (state, action: any) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAuthenticated = true;
				state.error = null;

				localStorage.setItem("auth", JSON.stringify(state));
			})
			.addCase("auth/login/rejected", (state, action: any) => {
				state.loading = false;
				state.error = action.payload;

				localStorage.removeItem("auth");
			});
	},
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
