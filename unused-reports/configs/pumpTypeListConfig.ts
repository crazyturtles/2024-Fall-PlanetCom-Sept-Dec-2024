import type { ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface PumpType {
	Name: string;
	HourlyRate: number;
	PourRate?: number;
	Description?: string;
}

export const pumpTypeListConfig: ReportConfig<PumpType> = {
	title: "Pump Type List",
	baseEndpoint: "/api/reports/pumptype-list",
	columns: [
		{
			header: "Name",
			key: "Name",
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
			formatter: (value) => (value ? columnFormatters.currency(value) : "-"),
		},
		{
			header: "Description",
			key: "Description",
			formatter: columnFormatters.nullableString,
		},
	],
	headerGroups: [
		{ title: "Pump Type Details", colspan: 1 },
		{ title: "Rate Information", colspan: 3 },
	],
	className: "min-w-full",
	requiresCustomer: false,
	requiresDateRange: false,
};
