import { NextResponse } from "next/server";

interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	status?: number;
}

export async function GET(
	request: Request,
	{ params }: { params: { reportType: string } },
) {
	const { reportType } = params;
	const { searchParams } = new URL(request.url);

	try {
		// Build query parameters dynamically from all searchParams
		const queryParams = new URLSearchParams();
		searchParams.forEach((value, key) => {
			queryParams.append(key, value);
		});

		// Make the request to the backend service
		const response = await fetch(
			`http://localhost:3001/reports/${reportType}${
				queryParams.toString() ? `?${queryParams.toString()}` : ""
			}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(`API route error for ${reportType}:`, error);
		const errorResponse: ApiResponse = {
			error: `Failed to fetch ${reportType} report: ${(error as Error).message}`,
			status: 500,
		};
		return NextResponse.json(errorResponse, { status: errorResponse.status });
	}
}
