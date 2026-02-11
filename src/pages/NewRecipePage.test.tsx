import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/providers";
import NewRecipePage from "./NewRecipePage";

vi.mock("@/slices/recipes/recipeThunks", () => ({
	createRecipe: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
	default: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe("NewRecipePage", async () => {
	const { createRecipe } = await import("@/slices/recipes/recipeThunks");
	const toast = await import("react-hot-toast");
	const mockCreateRecipe = vi.mocked(createRecipe);
	const mockToastSuccess = vi.mocked(toast.default.success);
	const mockToastError = vi.mocked(toast.default.error);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders new recipe form", () => {
		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		expect(
			screen.getByRole("heading", { name: /add your recipe/i }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/ingredients/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/preparation time \(minutes\)/i),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/steps/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/recipe image/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
	});

	it("redirects to login when not authenticated", () => {
		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: false,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		expect(mockNavigate).toHaveBeenCalledWith("/login");
	});

	it("validates required fields", async () => {
		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		const submitButton = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/title is required/i)).toBeInTheDocument();
			expect(screen.getByText(/ingredients are required/i)).toBeInTheDocument();
			expect(
				screen.getByText(/preparation time is required/i),
			).toBeInTheDocument();
			expect(screen.getByText(/steps are required/i)).toBeInTheDocument();
		});
	});

	it("validates preparation time minimum value", async () => {
		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		const prepTimeInput = screen.getByLabelText(
			/preparation time \(minutes\)/i,
		);
		const submitButton = screen.getByRole("button", { name: /submit/i });

		fireEvent.change(prepTimeInput, { target: { value: "0" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/must be at least 1 minute/i),
			).toBeInTheDocument();
		});
	});

	it("submits form with valid data", async () => {
		const user = userEvent.setup();

		mockCreateRecipe.mockResolvedValue({} as any);

		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		await user.type(screen.getByLabelText(/title/i), "Test Recipe");
		await user.type(
			screen.getByLabelText(/ingredients/i),
			"Flour, Sugar, Eggs",
		);
		await user.type(
			screen.getByLabelText(/preparation time \(minutes\)/i),
			"30",
		);
		await user.type(
			screen.getByLabelText(/steps/i),
			"Step 1: Mix ingredients. Step 2: Bake for 30 minutes.",
		);

		const file = new File(["dummy content"], "test.jpg", {
			type: "image/jpeg",
		});
		const fileInput = screen.getByLabelText(/recipe image/i);
		await user.upload(fileInput, file);

		const submitButton = screen.getByRole("button", { name: /submit/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockCreateRecipe).toHaveBeenCalled();
		});
	});

	it("shows loading state during submission", async () => {
		const user = userEvent.setup();

		const neverResolvingPromise = new Promise(() => {});

		(neverResolvingPromise as any).unwrap = () => neverResolvingPromise;

		mockCreateRecipe.mockReturnValue(() => neverResolvingPromise as any);

		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		await user.type(screen.getByLabelText(/title/i), "Test Recipe");
		await user.type(
			screen.getByLabelText(/ingredients/i),
			"Flour, Sugar, Eggs",
		);
		await user.type(
			screen.getByLabelText(/preparation time \(minutes\)/i),
			"30",
		);
		await user.type(
			screen.getByLabelText(/steps/i),
			"Step 1: Mix ingredients. Step 2: Bake.",
		);

		const submitButton = screen.getByRole("button", { name: /submit/i });
		await user.click(submitButton);

		expect(submitButton.textContent).toBe("Submitting...");
		expect(submitButton).toBeDisabled();
	});

	it("shows success toast and redirects on successful submission", async () => {
		const user = userEvent.setup();

		const mockUnwrap = vi.fn().mockResolvedValue({});
		const mockPromise = Promise.resolve({});

		(mockPromise as any).unwrap = mockUnwrap;

		mockCreateRecipe.mockReturnValue(() => mockPromise as any);

		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		await user.type(screen.getByLabelText(/title/i), "Test Recipe");
		await user.type(
			screen.getByLabelText(/ingredients/i),
			"Flour, Sugar, Eggs",
		);
		await user.type(
			screen.getByLabelText(/preparation time \(minutes\)/i),
			"30",
		);
		await user.type(
			screen.getByLabelText(/steps/i),
			"Step 1: Mix ingredients. Step 2: Bake for 30 minutes.",
		);

		const submitButton = screen.getByRole("button", { name: /submit/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockUnwrap).toHaveBeenCalled();
		});

		await waitFor(() => {
			expect(mockToastSuccess).toHaveBeenCalledWith(
				"Recipe created successfully",
			);
			expect(mockNavigate).toHaveBeenCalledWith("/");
		});
	});

	it("shows error toast on submission failure", async () => {
		const user = userEvent.setup();

		const error = new Error("Recipe creation failed");
		const mockUnwrap = vi.fn().mockRejectedValue(error);

		const mockPromise = Promise.resolve({});

		(mockPromise as any).unwrap = mockUnwrap;

		mockCreateRecipe.mockReturnValue(() => mockPromise as any);

		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		await user.type(screen.getByLabelText(/title/i), "Test Recipe");
		await user.type(
			screen.getByLabelText(/ingredients/i),
			"Flour, Sugar, Eggs",
		);
		await user.type(
			screen.getByLabelText(/preparation time \(minutes\)/i),
			"30",
		);
		await user.type(
			screen.getByLabelText(/steps/i),
			"Step 1: Mix ingredients. Step 2: Bake for 30 minutes.",
		);

		const submitButton = screen.getByRole("button", { name: /submit/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalledWith("Recipe creation failed");
		});
	});

	it("does not render form when not authenticated", () => {
		const { container } = renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: false,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		expect(container.firstChild).toBeNull();
	});

	it("accepts image file upload", async () => {
		const user = userEvent.setup();

		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		const file = new File(["dummy content"], "recipe.jpg", {
			type: "image/jpeg",
		});
		const fileInput = screen.getByLabelText(
			/recipe image/i,
		) as HTMLInputElement;

		await user.upload(fileInput, file);

		expect(fileInput.files?.[0]).toEqual(file);
		expect(fileInput.files).toHaveLength(1);
	});

	it("validates title length", async () => {
		renderWithProviders(<NewRecipePage />, {
			preloadedState: {
				auth: {
					isAuthenticated: true,
					user: null,
					token: null,
					loading: false,
					error: null,
				},
			},
		});

		const titleInput = screen.getByLabelText(/title/i);
		const submitButton = screen.getByRole("button", { name: /submit/i });

		const longTitle = "A".repeat(101);
		fireEvent.change(titleInput, { target: { value: longTitle } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/title must be under 100 characters/i),
			).toBeInTheDocument();
		});
	});
});
