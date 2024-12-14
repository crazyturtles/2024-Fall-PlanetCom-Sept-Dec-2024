import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Add polyfill
global.setImmediate = (callback) => setTimeout(callback, 0);

const baseLevelPaths = [
	"/dashboard",
	"/profile",
	"/settings",
	"/reports/amount-pumped-since-pipe-change",
	"/reports/customer-job-count",
	"/reports/customer-job-history",
	"/reports/customer-list",
	"/reports/customer-pumptype-rates",
	"/reports/inventory-list",
	"/reports/job-forecast",
	"/reports/operator-list",
	"/reports/pourType-list",
	"/reports/pumpType-list",
	"/reports/supplier-list",
	"/reports/unit-list",
	"/",
];

export async function middleware(req) {
	// Get the token from cookies
	const token = req.cookies.get("authToken")?.value;

	// Check if the secret key is defined
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		console.error("JWT_SECRET is not defined");
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Redirect to login if token is not found or invalid
	if (!token || typeof token !== "string") {
		const loginUrl = new URL("/login", req.url);
		loginUrl.searchParams.set("redirect", req.nextUrl.pathname); // Add redirect URL
		return NextResponse.redirect(loginUrl);
	}

	try {
		// Verify the token with the backend
		const validateTokenResponse = await fetch(
			"http://localhost:3001/auth/validate-token",
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include", // Ensures cookies are sent with the request
			},
		);

		if (!validateTokenResponse.ok) {
			const errorText = await validateTokenResponse.text();
			console.error(
				"Token validation failed with backend:",
				validateTokenResponse.status,
				errorText,
			);
			throw new Error("Token is invalid or expired.");
		}

		// Verify the token locally and extract payload
		const secretKey = new TextEncoder().encode(secret);
		const { payload } = await jwtVerify(token, secretKey);
		const userPermissionLevel = payload.permissionLevel || 0;

		// Define directories for each permission level
		const permissionDirectories = {
			level0: [],
			level1: baseLevelPaths,
			level2: [],
			level3: [
				...baseLevelPaths,
				"/operator",
				"/pour-type",
				"/supplier",
				"/technician",
				"/unified-ui-test",
				"/pumps",
				"/job-type",
				"/units",
				"/units/edit",
				"/units/create",
				"/admin",
				"/company-information",
				"/customers",
				"/emails",
				"/jobs",
				"/manage-rates",
				"/",
			],
		};

		// Combine allowed paths up to the user's permission level and deduplicate
		let allowedPaths = [];
		for (let i = 0; i <= userPermissionLevel; i++) {
			const levelPaths = permissionDirectories[`level${i}`] || [];
			allowedPaths = [...allowedPaths, ...levelPaths];
		}

		// Redirect to index if the requested path is not in the allowed paths
		if (!allowedPaths.includes(req.nextUrl.pathname)) {
			console.log("Access denied for path:", req.nextUrl.pathname);
			return NextResponse.redirect(new URL("/", req.url)); // Redirect to index
		}

		// Allow the request if it's within the allowed paths
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error.message);

		// Redirect to login if token verification fails
		const loginUrl = new URL("/login", req.url);
		loginUrl.searchParams.set("redirect", req.nextUrl.pathname); // Add redirect URL
		return NextResponse.redirect(loginUrl);
	}
}

// Define the matcher for routes requiring middleware processing
export const config = {
	matcher: [
		"/dashboard",
		"/profile",
		"/settings",
		"/admin",
		"/company-information",
		"/customers",
		"/emails",
		"/jobs",
		"/manage-rates",
		"/operator",
		"/pour-type",
		"/supplier",
		"/technician",
		"/unified-ui-test",
		"/pumps",
		"/job-type",
		"/reports/amount-pumped-since-pipe-change",
		"/reports/customer-job-count",
		"/reports/customer-job-history",
		"/reports/customer-list",
		"/reports/customer-pumptype-rates",
		"/reports/inventory-list",
		"/reports/job-forecast",
		"/reports/operator-list",
		"/reports/pourType-list",
		"/reports/pumpType-list",
		"/reports/supplier-list",
		"/reports/unit-list",
		"/units",
		"/units/edit",
		"/units/create",
		"/",
	],
};
