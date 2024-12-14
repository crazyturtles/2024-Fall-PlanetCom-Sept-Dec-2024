import type { ReportConfig } from "@/app/Components/ReportsComponents/types/reportTypes";
import { columnFormatters } from "@/app/Components/ReportsComponents/utils/formatters";

export interface Unit {
	UnitNumber: string;
	Driver: string;
	Mileage: number;
	MileageDate: string;
	HourlyRate: number;
	PourRate: number;
}

export const unitListConfig: ReportConfig<Unit> = {
	title: "Unit List",
	baseEndpoint: "/api/reports/unit-list",
	columns: [
		{ header: "Unit", key: "UnitNumber" },
		{ header: "Driver", key: "Driver" },
		{
			header: "Mileage",
			key: "Mileage",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Mileage Date",
			key: "MileageDate",
			formatter: columnFormatters.date,
		},
		{
			header: "Hourly Rate",
			key: "HourlyRate",
			align: "right",
			formatter: columnFormatters.currency,
		},
		{
			header: "Pour Rate",
			key: "PourRate",
			align: "right",
			formatter: columnFormatters.currency,
		},
	],
	headerGroups: [
		{ title: "Unit Information", colspan: 2 },
		{ title: "Usage Details", colspan: 2 },
		{ title: "Rate Information", colspan: 2 },
	],
};
