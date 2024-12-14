import type { ReportConfig } from "@/app/Components/ReportsComponents/types/reportTypes";
import { columnFormatters } from "@/app/Components/ReportsComponents/utils/formatters";

export interface Operator {
	OperatorName: string;
	Phone: string;
	Email: string;
	Cell: string;
	TextMsgNum: number;
}

export const operatorListConfig: ReportConfig<Operator> = {
	title: "Operator List",
	baseEndpoint: "/api/reports/operator-list",
	columns: [
		{ header: "Operator Name", key: "OperatorName" },
		{ header: "Phone", key: "Phone" },
		{ header: "Cell", key: "Cell" },
		{
			header: "Text Msg #",
			key: "TextMsgNum",
			align: "right",
			formatter: columnFormatters.number,
		},
		{ header: "Email", key: "Email" },
	],
	headerGroups: [
		{ title: "Basic Information", colspan: 1 },
		{ title: "Contact Information", colspan: 4 },
	],
};
