import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/providers";
import HomePage from "./HomePage";

vi.mock("@/components/recipes/RecipeList", () => ({
	default: vi.fn((props) => (
		<div data-testid='recipe-list'>
			<h1>{props.title || "Recipe List"}</h1>
			<div data-testid='show-new-recipe'>
				{props.showNewRecipeButton?.toString()}
			</div>
		</div>
	)),
}));

describe("HomePage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders RecipeList with correct props", () => {
		renderWithProviders(<HomePage />);

		expect(screen.getByTestId("recipe-list")).toBeInTheDocument();
		expect(screen.getByText("All Recipes")).toBeInTheDocument();
		expect(screen.getByTestId("show-new-recipe")).toHaveTextContent("true");
	});
});
