import type { ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface PipeChangeData {
	Unit: string;
	Total_Poured: number;
	Pipe_Changed: string;
	Deck_Total_Poured: number;
	Deck_Pipe_Changed: string;
	Status: string;
	SortKey: string;
}

export const pipeChangeConfig: ReportConfig<PipeChangeData> = {
	title: "Amount Pumped By Unit Since Last Pipe Change",
	baseEndpoint: "/api/reports/amount-pumped-since-pipe-change",
	columns: [
		{ header: "Unit", key: "Unit" },
		{
			header: "Total Poured",
			key: "Total_Poured",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Pipe Changed",
			key: "Pipe_Changed",
			formatter: (value) => value || "Never",
		},
		{
			header: "Total Poured",
			key: "Deck_Total_Poured",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Pipe Changed",
			key: "Deck_Pipe_Changed",
			formatter: (value) => value || "Never",
		},
	],
	headerGroups: [
		{ title: "", colspan: 1 },
		{ title: "Boom Pipe", colspan: 2 },
		{ title: "Deck Pipe", colspan: 2 },
	],
};
