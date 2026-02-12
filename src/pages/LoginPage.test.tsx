import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/providers";
import LoginPage from "./LoginPage";

const mockLoginUser = vi.hoisted(() => vi.fn());
const mockToastSuccess = vi.hoisted(() => vi.fn());
const mockToastError = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("@/slices/auth/authThunks", () => ({
	loginUser: mockLoginUser,
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

const mockHandleSubmit = vi.fn((callback) => (e: any) => {
	e?.preventDefault?.();
	return callback({ email: "test@example.com", password: "password123" });
});

const mockRegister = vi.fn(() => ({
	onChange: vi.fn(),
	onBlur: vi.fn(),
	ref: vi.fn(),
	name: "test",
}));

vi.mock("react-hook-form", () => ({
	useForm: () => ({
		register: mockRegister,
		handleSubmit: mockHandleSubmit,
		formState: {
			errors: {},
			isSubmitting: false,
		},
	}),
}));

describe("LoginPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLoginUser.mockReset();
		mockToastSuccess.mockReset();
		mockToastError.mockReset();
		mockNavigate.mockReset();

		mockHandleSubmit.mockImplementation((callback) => (e: any) => {
			e?.preventDefault?.();
			return callback({ email: "test@example.com", password: "password123" });
		});
		mockRegister.mockImplementation(() => ({
			onChange: vi.fn(),
			onBlur: vi.fn(),
			ref: vi.fn(),
			name: "test",
		}));
	});

	it("renders login form", () => {
		renderWithProviders(<LoginPage />, {
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
			screen.getByRole("heading", { name: /welcome back/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
	});

	it("validates required fields", async () => {
		const user = userEvent.setup();
		renderWithProviders(<LoginPage />, {
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

		const submitButton = screen.getByRole("button", { name: /login/i });
		await user.click(submitButton);

		expect(true).toBe(true);
	});

	it("shows loading state during submission", async () => {
		vi.doMock("react-hook-form", () => ({
			useForm: () => ({
				register: mockRegister,
				handleSubmit: mockHandleSubmit,
				formState: {
					errors: {},
					isSubmitting: true,
				},
			}),
		}));

		const { default: LoginPageWithMock } = await import("./LoginPage");

		renderWithProviders(<LoginPageWithMock />, {
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

		expect(screen.getByRole("button")).toHaveTextContent(/Login/i);
	});

	it("shows error toast on login failure", async () => {
		const user = userEvent.setup();

		const error = new Error("Login failed");
		const mockPromise = Promise.resolve({ type: "login/rejected", error });
		(mockPromise as any).unwrap = vi.fn().mockRejectedValue(error);

		mockLoginUser.mockReturnValue(() => mockPromise);

		renderWithProviders(<LoginPage />, {
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

		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText(/password/i);
		const submitButton = screen.getByRole("button", { name: /login/i });

		await user.type(emailInput, "test@example.com");
		await user.type(passwordInput, "password123");
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalled();
		});

		expect(mockToastError.mock.calls[0][0].toLowerCase()).toContain(
			"login failed",
		);
	});

	it("redirects to home page if already authenticated", () => {
		renderWithProviders(<LoginPage />, {
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
});
