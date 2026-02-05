import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "@/slices/recipes/recipeSlice";
import authReducer from "@/slices/auth/authSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		recipes: recipeReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
