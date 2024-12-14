import { middleware } from "../../../middleware";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

jest.mock("node-fetch", () => jest.fn());
jest.mock("next/server");
jest.mock("jose", () => ({
	jwtVerify: jest.fn(),
}));

describe("Auth Middleware", () => {
	let mockRequest;
	let baseUrl;

	beforeEach(() => {
		baseUrl = "http://localhost:3000";
		mockRequest = {
			cookies: {
				get: jest.fn(),
			},
			nextUrl: {
				pathname: "/dashboard",
			},
			url: baseUrl + "/dashboard",
		};

		jest.spyOn(console, "error").mockImplementation(() => {});
		jest.spyOn(console, "log").mockImplementation(() => {});

		global.fetch = jest.fn().mockImplementation(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve({ message: "Token is valid" }),
				text: () => Promise.resolve("Success"),
			}),
		);

		jwtVerify.mockImplementation(() =>
			Promise.resolve({ payload: { permissionLevel: 3 } }),
		);

		NextResponse.redirect = jest.fn();
		NextResponse.next = jest.fn();
		process.env.JWT_SECRET = "test-secret";
		jest.clearAllMocks();
	});

	describe("Token Validation", () => {
		it("redirects to login when no token present", async () => {
			mockRequest.cookies.get.mockReturnValue(null);
			await middleware(mockRequest);
			expect(NextResponse.redirect).toHaveBeenCalled();
		});

		it("redirects to login when token is invalid", async () => {
			mockRequest.cookies.get.mockReturnValue({ value: "invalid-token" });
			global.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: false,
					status: 401,
					text: () => Promise.resolve("Token validation failed"),
				}),
			);

			await middleware(mockRequest);
			expect(NextResponse.redirect).toHaveBeenCalled();
		});

		it("allows access with valid token", async () => {
			mockRequest.cookies.get.mockReturnValue({ value: "valid-token" });
			await middleware(mockRequest);
			expect(NextResponse.next).toHaveBeenCalled();
		});
	});

	describe("Permission Levels", () => {
		it("handles level 1 permissions correctly", async () => {
			mockRequest.cookies.get.mockReturnValue({ value: "valid-token" });
			jwtVerify.mockImplementation(() =>
				Promise.resolve({ payload: { permissionLevel: 1 } }),
			);

			mockRequest.nextUrl.pathname = "/reports/customer-list";
			await middleware(mockRequest);
			expect(NextResponse.next).toHaveBeenCalled();

			mockRequest.nextUrl.pathname = "/admin";
			await middleware(mockRequest);
			expect(NextResponse.redirect).toHaveBeenCalled();
		});

		it("handles level 3 permissions correctly", async () => {
			mockRequest.cookies.get.mockReturnValue({ value: "valid-token" });
			jwtVerify.mockImplementation(() =>
				Promise.resolve({ payload: { permissionLevel: 3 } }),
			);

			mockRequest.nextUrl.pathname = "/admin";
			await middleware(mockRequest);
			expect(NextResponse.next).toHaveBeenCalled();
		});
	});

	describe("Error Handling", () => {
		it("handles missing JWT_SECRET", async () => {
			const originalSecret = process.env.JWT_SECRET;
			process.env.JWT_SECRET = ""; // Set to empty string instead of deleting
			mockRequest.cookies.get.mockReturnValue({ value: "valid-token" });

			const mockUrl = new URL("/login", "http://localhost:3000");
			NextResponse.redirect.mockReturnValue(mockUrl);

			await middleware(mockRequest);
			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));

			process.env.JWT_SECRET = originalSecret;
		});

		it("handles backend validation failure", async () => {
			mockRequest.cookies.get.mockReturnValue({ value: "valid-token" });
			global.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: false,
					status: 500,
					text: () => Promise.resolve("Token validation failed"),
				}),
			);

			await middleware(mockRequest);
			expect(NextResponse.redirect).toHaveBeenCalled();
		});
	});

	describe("Route Protection", () => {
		it("protects configured routes", async () => {
			const protectedRoutes = [
				"/dashboard",
				"/admin",
				"/settings",
				"/reports/customer-list",
			];

			mockRequest.cookies.get.mockReturnValue({ value: "valid-token" });

			for (const route of protectedRoutes) {
				mockRequest.nextUrl.pathname = route;
				mockRequest.url = baseUrl + route;
				await middleware(mockRequest);
				expect(NextResponse.next).toHaveBeenCalled();
				jest.clearAllMocks();
			}
		});

		it("adds redirect parameter to login URL", async () => {
			mockRequest.cookies.get.mockReturnValue(null);
			mockRequest.nextUrl.pathname = "/admin";
			mockRequest.url = baseUrl + "/admin";
			await middleware(mockRequest);
			expect(NextResponse.redirect).toHaveBeenCalled();
			expect(
				NextResponse.redirect.mock.calls[0][0].searchParams.get("redirect"),
			).toBe("/admin");
		});
	});
});
