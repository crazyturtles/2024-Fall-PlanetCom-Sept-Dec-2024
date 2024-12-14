// "use client";

// import { ReportPage } from "@/app/Components/ReportsComponents/ReportPage";
// import { jobDetailsConfig } from "@/app/Components/ReportsComponents/reports/jobDetailsConfig";
// import { useParams } from "next/navigation";

// export default function JobDetailsPage() {
// 	const params = useParams();
// 	const jobId = params.jobId;

// 	const configWithJobId = {
// 		...jobDetailsConfig,
// 		baseEndpoint: `/api/reports/job-details/${jobId}`,
// 	};

// 	return <ReportPage config={configWithJobId} />;
// }
