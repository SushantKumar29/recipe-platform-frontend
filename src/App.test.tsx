import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./test/providers";

describe("App", () => {
	it("renders without crashing", () => {
		renderWithProviders(<App />);

		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("shows login link when not authenticated", () => {
		renderWithProviders(<App />, {
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

		expect(screen.getByText(/login/i)).toBeInTheDocument();
	});
});
