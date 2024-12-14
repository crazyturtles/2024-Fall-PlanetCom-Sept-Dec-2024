import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch("http://localhost:3001/reports/customers", {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("API route error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch customers" },
			{ status: 500 },
		);
	}
}
