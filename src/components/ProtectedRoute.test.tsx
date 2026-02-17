import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { renderWithProviders } from "@/test/providers";

const TestComponent = () => <div>Protected Content</div>;

describe("ProtectedRoute", () => {
	it("redirects when not authenticated", () => {
		renderWithProviders(
			<ProtectedRoute>
				<TestComponent />
			</ProtectedRoute>,
			{
				preloadedState: {
					auth: {
						user: null,
						token: null,
						isAuthenticated: false,
						loading: false,
						error: null,
					},
				},
			},
		);

		expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
	});

	it("renders content when authenticated", () => {
		renderWithProviders(
			<ProtectedRoute>
				<TestComponent />
			</ProtectedRoute>,
			{
				preloadedState: {
					auth: {
						user: { id: "1", name: "Test User", email: "test@example.com" },
						token: "fake-token",
						isAuthenticated: true,
						loading: false,
						error: null,
					},
				},
			},
		);

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
	});
});
