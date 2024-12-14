import { formatSQLDate } from "@/app/Components/ReportsComponents/utils/dateUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const startDate = formatSQLDate(searchParams.get("startDate"));
		const endDate = formatSQLDate(searchParams.get("endDate"));

		if (!startDate || !endDate) {
			return NextResponse.json(
				{ error: "Start date and end date are required" },
				{ status: 400 },
			);
		}

		const params = new URLSearchParams({
			startDate: startDate,
			endDate: endDate,
		});

		const response = await fetch(
			`http://localhost:3001/reports/job-forecast?${params.toString()}`,
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
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching job forecast:", error);
		return NextResponse.json(
			{ error: "Failed to fetch job forecast" },
			{ status: 500 },
		);
	}
}
