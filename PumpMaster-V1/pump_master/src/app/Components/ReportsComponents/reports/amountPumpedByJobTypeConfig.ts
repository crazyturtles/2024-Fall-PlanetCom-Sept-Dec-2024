import type { ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface AmountPumpedByJobType {
	JobType: string;
	Customer: string;
	PumpType: string;
	Meters: number;
	Hours: number;
	HourlyRate: number;
	FlatRate: number;
}

export interface AmountPumpedByJobTypeConfig
	extends ReportConfig<AmountPumpedByJobType> {
	subtitle?: string;
}

export const amountPumpedByJobTypeConfig: AmountPumpedByJobTypeConfig = {
	title: "Amount Pumped By Job Type",
	baseEndpoint: "/api/reports/amount-pumped-by-job-type",
	requiresDateRange: true,
	subtitle: "",
	columns: [
		{
			header: "Job Type",
			key: "JobType",
			align: "left",
		},
		{
			header: "Customer",
			key: "Customer",
			align: "left",
		},
		{
			header: "Pump Type",
			key: "PumpType",
			align: "left",
		},
		{
			header: "Meters",
			key: "Meters",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Hours",
			key: "Hours",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Hourly Rate",
			key: "HourlyRate",
			align: "right",
		},
		{
			header: "Flat Rate",
			key: "FlatRate",
			align: "right",
		},
	],
	printConfig: {
		orientation: "landscape",
		pageSize: "letter",
		margins: {
			top: 0.5,
			right: 0.5,
			bottom: 0.5,
			left: 0.5,
		},
	},
};
