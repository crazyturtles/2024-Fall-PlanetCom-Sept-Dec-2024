"use client";

import { ReportPage } from "@/app/Components/ReportsComponents/ReportPage";
import { jobHistoryConfig } from "@/app/Components/ReportsComponents/reports/jobHistoryConfig";

export default function JobHistoryPage() {
	return <ReportPage config={jobHistoryConfig} />;
}
