import type { ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface CustomerJobCount {
	CustomerID: number;
	CustomerCompanyName: string;
	JobCount: number;
}

export const customerJobCountConfig: ReportConfig<CustomerJobCount> = {
	title: "Customer Job Count",
	baseEndpoint: "/api/reports/customer-job-count",
	requiresCustomer: true,
	columns: [
		{ header: "Company Name", key: "CustomerCompanyName" },
		{
			header: "Total Jobs",
			key: "JobCount",
			align: "right",
			formatter: columnFormatters.number,
		},
	],
};
