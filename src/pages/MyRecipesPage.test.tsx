import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/providers";
import MyRecipesPage from "./MyRecipesPage";

vi.mock("@/components/recipes/RecipeList", () => ({
	default: vi.fn(() => <div>Recipe List Component</div>),
}));

describe("MyRecipesPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirects to login when not authenticated", () => {
		renderWithProviders(<MyRecipesPage />, {
			preloadedState: {
				auth: {
					user: null,
					token: null,
					isAuthenticated: false,
					loading: false,
					error: null,
				},
			},
		});

		expect(screen.queryByText("Recipe List Component")).not.toBeInTheDocument();
	});

	it("renders RecipeList when authenticated", () => {
		renderWithProviders(<MyRecipesPage />, {
			preloadedState: {
				auth: {
					user: { id: "123", name: "Test User", email: "test@example.com" },
					token: "fake-token",
					isAuthenticated: true,
					loading: false,
					error: null,
				},
			},
		});

		expect(screen.getByText("Recipe List Component")).toBeInTheDocument();
	});
});
