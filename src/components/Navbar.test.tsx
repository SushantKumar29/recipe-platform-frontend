import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/providers";
import Navbar from "./Navbar";

describe("Navbar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders navigation links for unauthenticated users", () => {
		renderWithProviders(<Navbar />, {
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

		expect(screen.getByText("RecipePlatform")).toBeInTheDocument();

		expect(screen.getByText("Login")).toBeInTheDocument();
		expect(screen.getByText("Sign Up")).toBeInTheDocument();

		expect(
			screen.queryByRole("button", { name: /user menu/i }),
		).not.toBeInTheDocument();
	});

	it("renders user menu for authenticated users", () => {
		renderWithProviders(<Navbar />, {
			preloadedState: {
				auth: {
					user: { id: "1", name: "John Doe", email: "john@example.com" },
					token: "fake-token",
					isAuthenticated: true,
					loading: false,
					error: null,
				},
			},
		});

		expect(screen.getByText("RecipePlatform")).toBeInTheDocument();

		expect(screen.queryByText("Login")).not.toBeInTheDocument();
		expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();

		expect(
			screen.getByRole("button", { name: /user menu/i }),
		).toBeInTheDocument();
		expect(screen.getByText("J")).toBeInTheDocument();
	});

	it("shows dropdown menu when user avatar is clicked", () => {
		renderWithProviders(<Navbar />, {
			preloadedState: {
				auth: {
					user: { id: "1", name: "John Doe", email: "john@example.com" },
					token: "fake-token",
					isAuthenticated: true,
					loading: false,
					error: null,
				},
			},
		});

		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
		expect(screen.queryByText("My Recipes")).not.toBeInTheDocument();
		expect(screen.queryByText("Logout")).not.toBeInTheDocument();

		const userMenuButton = screen.getByRole("button", { name: /user menu/i });
		fireEvent.click(userMenuButton);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("john@example.com")).toBeInTheDocument();
		expect(screen.getByText("My Recipes")).toBeInTheDocument();
		expect(screen.getByText("Logout")).toBeInTheDocument();
	});
});
