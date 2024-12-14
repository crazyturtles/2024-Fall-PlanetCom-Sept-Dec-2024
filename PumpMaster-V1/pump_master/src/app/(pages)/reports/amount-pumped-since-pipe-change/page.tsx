"use client";

import { ReportPage } from "@/app/Components/ReportsComponents/ReportPage";
import { pipeChangeConfig } from "@/app/Components/ReportsComponents/reports/pipeChangeConfig";

export default function PipeChangeReportPage() {
	return <ReportPage config={pipeChangeConfig} />;
}
