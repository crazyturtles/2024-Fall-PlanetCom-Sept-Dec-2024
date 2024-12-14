export const dynamic = "force-dynamic";

import { formatSQLDate } from "@/app/Components/ReportsComponents/utils/dateUtils";
import { format, parseISO } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		if (!startDate || !endDate) {
			return NextResponse.json(
				{ error: "Start date and end date are required" },
				{ status: 400 },
			);
		}

		const formattedStart = formatSQLDate(startDate);
		const formattedEnd = formatSQLDate(endDate);

		const response = await fetch(
			`http://localhost:3001/reports/amount-pumped-by-job-type?startDate=${formattedStart}&endDate=${formattedEnd}`,
			{
				headers: { "Content-Type": "application/json" },
				next: { revalidate: 0 },
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const formattedStartDate = format(parseISO(startDate), "dd-MMM-yyyy");
		const formattedEndDate = format(parseISO(endDate), "dd-MMM-yyyy");

		return NextResponse.json({
			data: data,
			subtitle: `Between ${formattedStartDate} and ${formattedEndDate}`,
		});
	} catch (error) {
		console.error("Error fetching amount pumped by job type:", error);
		return NextResponse.json(
			{ error: "Failed to fetch amount pumped by job type data" },
			{ status: 500 },
		);
	}
}
