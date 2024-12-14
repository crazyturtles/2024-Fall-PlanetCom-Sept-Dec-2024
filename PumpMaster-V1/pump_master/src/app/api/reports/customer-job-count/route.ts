import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const customerId = searchParams.get("customerId");

	if (!customerId) {
		return NextResponse.json(
			{ error: "Customer ID is required" },
			{ status: 400 },
		);
	}

	try {
		const response = await fetch(
			`http://localhost:3001/reports/customer-job-count?customerId=${customerId}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				next: { revalidate: 0 },
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching customer job count:", error);
		return NextResponse.json(
			{ error: "Failed to fetch customer job count" },
			{ status: 500 },
		);
	}
}
