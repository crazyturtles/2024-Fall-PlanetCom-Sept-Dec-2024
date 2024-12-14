"use client";
import { ReportPage } from "@/app/Components/ReportsComponents/ReportPage";
import { amountPumpedByJobTypeConfig } from "@/app/Components/ReportsComponents/reports/amountPumpedByJobTypeConfig";

export default function AmountPumpedByJobTypePage() {
	return <ReportPage config={amountPumpedByJobTypeConfig} />;
}
