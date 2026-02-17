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

			.addMatcher(
				(action): action is PayloadAction<{ user: User; token: string }> =>
					action.type === "auth/signup/fulfilled",
				(state, action) => {
					state.loading = false;
					state.user = action.payload.user;
					state.token = action.payload.token;
					state.isAuthenticated = true;
					state.error = null;

					localStorage.setItem("auth", JSON.stringify(state));
				},
			)

			.addMatcher(
				(action): action is PayloadAction<string | undefined> =>
					action.type === "auth/signup/rejected",
				(state, action) => {
					state.loading = false;
					state.error = action.payload ?? "Signup failed";
					localStorage.removeItem("auth");
				},
			)

			.addMatcher(
				(action) => action.type === "auth/signup/pending",
				(state) => {
					state.loading = true;
					state.error = null;
				},
			)

			.addMatcher(
				(action): action is PayloadAction<{ user: User; token: string }> =>
					action.type === "auth/login/fulfilled",
				(state, action) => {
					state.loading = false;
					state.user = action.payload.user;
					state.token = action.payload.token;
					state.isAuthenticated = true;
					state.error = null;

					localStorage.setItem("auth", JSON.stringify(state));
				},
			)

			.addMatcher(
				(action): action is PayloadAction<string | undefined> =>
					action.type === "auth/login/rejected",
				(state, action) => {
					state.loading = false;
					state.error = action.payload ?? "Login failed";
					localStorage.removeItem("auth");
				},
			)

			.addMatcher(
				(action) => action.type === "auth/login/pending",
				(state) => {
					state.loading = true;
					state.error = null;
				},
			);
	},
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
