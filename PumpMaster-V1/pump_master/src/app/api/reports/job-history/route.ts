import type { JobHistory } from "@/app/Components/ReportsComponents/reports/jobHistoryConfig";
import { formatSQLDate } from "@/app/Components/ReportsComponents/utils/dateUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const customerId = searchParams.get("customerId");
	const startDate = formatSQLDate(searchParams.get("startDate"));
	const endDate = formatSQLDate(searchParams.get("endDate"));
	const unitSent = searchParams.get("unitSent");

	if (!customerId) {
		return NextResponse.json(
			{ error: "Customer ID is required" },
			{ status: 400 },
		);
	}

	try {
		const apiSearchParams = new URLSearchParams();
		apiSearchParams.append("customerId", customerId);
		if (unitSent) apiSearchParams.append("unitSent", unitSent);
		if (startDate) apiSearchParams.append("startDate", startDate);
		if (endDate) apiSearchParams.append("endDate", endDate);

		const response = await fetch(
			`http://localhost:3001/reports/job-history?${apiSearchParams.toString()}`,
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

		const transformedData = data.map((job: JobHistory) => ({
			...job,
			"Job Date": job["Job Date"]
				? new Date(job["Job Date"]).toISOString().split("T")[0]
				: null,
			"Pour Time":
				job["Pour Time"] && job["Pour Time"] !== "Invalid Date"
					? job["Pour Time"]
					: null,
		}));

		return NextResponse.json(transformedData);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch job history" },
			{ status: 500 },
		);
	}
}
