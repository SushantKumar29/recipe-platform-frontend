import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";

import recipeReducer from "@/slices/recipes/recipeSlice";
import authReducer from "@/slices/auth/authSlice";

const rootReducer = combineReducers({
	auth: authReducer,
	recipes: recipeReducer,
});

export function renderWithProviders(
	ui: React.ReactElement,
	{
		preloadedState = {},
		route = "/",
	}: {
		preloadedState?: Record<string, unknown>;
		route?: string;
	} = {},
) {
	const store = configureStore({
		reducer: rootReducer,
		preloadedState,
	});

	window.history.pushState({}, "Test page", route);

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<Provider store={store}>
			<BrowserRouter>{children}</BrowserRouter>
		</Provider>
	);

	return { store, ...render(ui, { wrapper: Wrapper }) };
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
