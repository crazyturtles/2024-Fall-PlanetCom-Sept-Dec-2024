import { formatSQLDate } from "@/app/Components/ReportsComponents/utils/dateUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const customerId = searchParams.get("customerId");
	const startDate = formatSQLDate(searchParams.get("startDate"));
	const endDate = formatSQLDate(searchParams.get("endDate"));

	if (!customerId) {
		return NextResponse.json(
			{ error: "Customer ID is required" },
			{ status: 400 },
		);
	}

	try {
		const params = new URLSearchParams({
			customerId: customerId,
		});

		if (startDate) params.append("startDate", startDate);
		if (endDate) params.append("endDate", endDate);

		const response = await fetch(
			`http://localhost:3001/reports/job-history?${params.toString()}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				next: { revalidate: 0 },
			},
		);

		if (!response.ok) {
			console.error(`API Error: ${response.status} - ${await response.text()}`);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json({ count: data.length });
	} catch (error) {
		console.error("Error fetching job history count:", error);
		return NextResponse.json(
			{ error: "Failed to fetch job history count" },
			{ status: 500 },
		);
	}
}
