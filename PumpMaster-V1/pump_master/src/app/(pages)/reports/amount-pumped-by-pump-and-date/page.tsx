"use client";
import { ReportPage } from "@/app/Components/ReportsComponents/ReportPage";
import { amountPumpedByPumpAndDateConfig } from "@/app/Components/ReportsComponents/reports/amountPumpedByPumpAndDateConfig";

export default function AmountPumpedByPumpAndDatePage() {
	return <ReportPage config={amountPumpedByPumpAndDateConfig} />;
}
