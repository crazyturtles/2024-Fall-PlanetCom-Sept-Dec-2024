import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoginPage from "../../(pages)/login/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

// Mock axios
jest.mock("axios");

describe("LoginPage", () => {
	const mockRouter = {
		push: jest.fn(),
	};

	beforeEach(() => {
		useRouter.mockReturnValue(mockRouter);
		mockRouter.push.mockClear();
		axios.post.mockClear();
	});

	describe("Rendering", () => {
		it("renders login form elements", () => {
			render(<LoginPage />);

			expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /login/i }),
			).toBeInTheDocument();
		});

		it("renders logo image", () => {
			render(<LoginPage />);
			const logo = screen.getByAltText("PumpMaster Logo");
			expect(logo).toBeInTheDocument();
		});
	});

	describe("Form Validation", () => {
		it("validates empty username", async () => {
			render(<LoginPage />);

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			expect(
				await screen.findByText(/username cannot be empty/i),
			).toBeInTheDocument();
		});

		it("validates empty password", async () => {
			render(<LoginPage />);

			const usernameInput = screen.getByLabelText(/username/i);
			fireEvent.change(usernameInput, { target: { value: "testuser" } });

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			expect(
				await screen.findByText(/password cannot be empty/i),
			).toBeInTheDocument();
		});
	});

	describe("Login Process", () => {
		it("handles successful login", async () => {
			const mockResponse = {
				data: {
					token: "mock-token",
					user: {
						username: "testuser",
						role: "user",
						permissionLevel: 1,
					},
				},
			};

			axios.post.mockResolvedValueOnce(mockResponse);

			render(<LoginPage />);

			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "testuser" },
			});
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: "password123" },
			});

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			await waitFor(() => {
				expect(mockRouter.push).toHaveBeenCalledWith("/");
			});
		});

		it("handles login failure", async () => {
			const errorMessage = "Invalid credentials";
			axios.post.mockRejectedValueOnce({
				response: { data: { message: errorMessage } },
			});

			render(<LoginPage />);

			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "wronguser" },
			});
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: "wrongpass" },
			});

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			expect(await screen.findByText(errorMessage)).toBeInTheDocument();
		});

		it("shows loading state during login", async () => {
			axios.post.mockImplementationOnce(() => new Promise(() => {}));

			render(<LoginPage />);

			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "testuser" },
			});
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: "password123" },
			});

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
		});
	});

	describe("Error Handling", () => {
		it("handles unexpected errors", async () => {
			axios.post.mockRejectedValueOnce(new Error("Network error"));

			render(<LoginPage />);

			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "testuser" },
			});
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: "password123" },
			});

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			expect(
				await screen.findByText(/an unexpected error occurred/i),
			).toBeInTheDocument();
		});

		it("handles server errors", async () => {
			axios.post.mockRejectedValueOnce({
				response: { status: 500, data: { message: "Server error" } },
			});

			render(<LoginPage />);

			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "testuser" },
			});
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: "password123" },
			});

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			expect(await screen.findByText(/server error/i)).toBeInTheDocument();
		});
	});
});
