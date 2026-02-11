import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/providers";
import SignupPage from "./SignupPage";

const mockRegisterUser = vi.hoisted(() => vi.fn());
const mockToastSuccess = vi.hoisted(() => vi.fn());
const mockToastError = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("@/slices/auth/authThunks", () => ({
	registerUser: mockRegisterUser,
}));

vi.mock("react-hot-toast", () => ({
	default: {
		success: mockToastSuccess,
		error: mockToastError,
	},
}));

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe("SignupPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockRegisterUser.mockReset();
		mockToastSuccess.mockReset();
		mockToastError.mockReset();
		mockNavigate.mockReset();
	});

	it("renders signup form", () => {
		renderWithProviders(<SignupPage />, {
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

		expect(
			screen.getByRole("heading", { name: /welcome to recipe platform/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/present your recipes/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /sign up/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/already registered/i)).toBeInTheDocument();
		expect(screen.getByText(/login here/i)).toBeInTheDocument();
	});

	it("redirects to home page if already authenticated", () => {
		renderWithProviders(<SignupPage />, {
			preloadedState: {
				auth: {
					user: { _id: "1", name: "Test User", email: "test@example.com" },
					token: "fake-token",
					isAuthenticated: true,
					loading: false,
					error: null,
				},
			},
		});

		expect(mockNavigate).toHaveBeenCalledWith("/");
	});

	it("returns null when authenticated", () => {
		const { container } = renderWithProviders(<SignupPage />, {
			preloadedState: {
				auth: {
					user: { _id: "1", name: "Test User", email: "test@example.com" },
					token: "fake-token",
					isAuthenticated: true,
					loading: false,
					error: null,
				},
			},
		});

		expect(container.firstChild).toBeNull();
	});

	it("submits form with valid data", async () => {
		const user = userEvent.setup();

		const mockUnwrap = vi.fn().mockResolvedValue({});
		mockRegisterUser.mockReturnValue({ unwrap: mockUnwrap });

		renderWithProviders(<SignupPage />, {
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

		const nameInput = screen.getByLabelText(/name/i);
		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText(/password/i);
		const submitButton = screen.getByRole("button", { name: /sign up/i });

		await user.type(nameInput, "John Doe");
		await user.type(emailInput, "john@example.com");
		await user.type(passwordInput, "password123");
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockRegisterUser).toHaveBeenCalledWith({
				name: "John Doe",
				email: "john@example.com",
				password: "password123",
			});
		});
	});

	it("shows loading state during submission", async () => {
		const user = userEvent.setup();

		const neverResolvingPromise = new Promise(() => {});

		mockRegisterUser.mockReturnValue(() => ({
			unwrap: () => neverResolvingPromise,
		}));

		renderWithProviders(<SignupPage />, {
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

		await user.type(screen.getByLabelText(/name/i), "John Doe");
		await user.type(screen.getByLabelText(/email/i), "john@example.com");
		await user.type(screen.getByLabelText(/password/i), "password123");

		const submitButton = screen.getByRole("button", { name: /sign up/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(submitButton).toBeDisabled();
		});
	});

	it("shows success toast on successful submission", async () => {
		const user = userEvent.setup();

		const mockUnwrap = vi.fn().mockResolvedValue({});
		mockRegisterUser.mockReturnValue(() => ({
			unwrap: mockUnwrap,
		}));

		renderWithProviders(<SignupPage />, {
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

		await user.type(screen.getByLabelText(/name/i), "John Doe");
		await user.type(screen.getByLabelText(/email/i), "john@example.com");
		await user.type(screen.getByLabelText(/password/i), "password123");

		const submitButton = screen.getByRole("button", { name: /sign up/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockToastSuccess).toHaveBeenCalledWith(
				'{"name":"John Doe","email":"john@example.com","password":"password123"}',
			);
		});
	});

	it("shows error toast on submission failure", async () => {
		const user = userEvent.setup();

		const error = new Error("Registration failed");

		const mockPromise = Promise.resolve({});

		(mockPromise as any).unwrap = vi.fn().mockRejectedValue(error);

		mockRegisterUser.mockReturnValue(() => mockPromise);

		renderWithProviders(<SignupPage />, {
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

		await user.type(screen.getByLabelText(/name/i), "John Doe");
		await user.type(screen.getByLabelText(/email/i), "john@example.com");
		await user.type(screen.getByLabelText(/password/i), "password123");

		const submitButton = screen.getByRole("button", { name: /sign up/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalledWith("Registration failed");
		});
	});

	it("shows validation errors for invalid input", async () => {
		const user = userEvent.setup();

		renderWithProviders(<SignupPage />, {
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

		const nameInput = screen.getByLabelText(/name/i);
		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText(/password/i);
		const submitButton = screen.getByRole("button", { name: /sign up/i });

		await user.type(nameInput, "John123");
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/name cannot contain numbers or special characters/i),
			).toBeInTheDocument();
		});

		await user.clear(nameInput);
		await user.clear(emailInput);
		await user.type(emailInput, "invalid-email");
		await user.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
		});

		await user.clear(emailInput);
		await user.clear(passwordInput);
		await user.type(passwordInput, "short");
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/password must be at least 8 characters/i),
			).toBeInTheDocument();
		});
	});
});
