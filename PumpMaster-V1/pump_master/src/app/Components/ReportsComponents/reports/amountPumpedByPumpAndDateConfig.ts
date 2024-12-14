import type { ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface AmountPumpedByPumpAndDate {
	Unit: string;
	TotalPumped: number;
}

export interface AmountPumpedConfig
	extends ReportConfig<AmountPumpedByPumpAndDate> {
	subtitle?: string;
}

export const amountPumpedByPumpAndDateConfig: AmountPumpedConfig = {
	title: "Amount Pumped (by Pump and Date)",
	baseEndpoint: "/api/reports/amount-pumped-by-pump-and-date",
	requiresDateRange: true,
	subtitle: "",
	columns: [
		{
			header: "Unit",
			key: "Unit",
			align: "left",
		},
		{
			header: "Total Pumped",
			key: "TotalPumped",
			align: "right",
			formatter: columnFormatters.number,
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
