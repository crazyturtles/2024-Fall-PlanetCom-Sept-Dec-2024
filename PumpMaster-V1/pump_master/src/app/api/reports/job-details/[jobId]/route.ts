import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { jobId: string } },
) {
	const jobId = params.jobId;

	if (!jobId) {
		return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
	}

	try {
		const response = await fetch(
			`http://localhost:3001/reports/job-details/${jobId}`,
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
		console.error("Error fetching job details:", error);
		return NextResponse.json(
			{ error: "Failed to fetch job details" },
			{ status: 500 },
		);
	}
}
