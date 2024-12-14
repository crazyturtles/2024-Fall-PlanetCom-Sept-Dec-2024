import type { ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface JobForecast {
	CustomerCompanyName: string;
	PendingJobCount: number;
	ConfirmedJobCount: number;
	CompletedJobCount: number;
	TotalJobCount: number;
	StartDate?: string;
	EndDate?: string;
}

export const jobForecastConfig: ReportConfig<JobForecast> = {
	title: "Job Forecast Report",
	baseEndpoint: "/api/reports/job-forecast",
	requiresDateRange: true,
	columns: [
		{ header: "Customer", key: "CustomerCompanyName" },
		{
			header: "Pending Jobs",
			key: "PendingJobCount",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Confirmed Jobs",
			key: "ConfirmedJobCount",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Completed Jobs",
			key: "CompletedJobCount",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Total Jobs",
			key: "TotalJobCount",
			align: "right",
			formatter: columnFormatters.number,
		},
	],
	additionalParams: {
		dateFormat: "dd-mm-yyyy",
	},
};
