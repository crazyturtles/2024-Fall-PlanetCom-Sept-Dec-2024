"use client";

import { ReportPage } from "@/app/Components/ReportsComponents/ReportPage";
import { customerJobCountConfig } from "@/app/Components/ReportsComponents/reports/customerJobCountConfig";

export default function CustomerJobCountPage() {
	return <ReportPage config={customerJobCountConfig} />;
}
