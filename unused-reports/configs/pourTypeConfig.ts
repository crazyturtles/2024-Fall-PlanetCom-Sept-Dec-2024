import type { ReportConfig } from "@/app/Components/ReportsComponents/types/reportTypes";

export interface PourType {
	Name: string;
	Comments: string;
}

export const pourTypeConfig: ReportConfig<PourType> = {
	title: "Pour Type List",
	baseEndpoint: "/api/reports/pourtype-list",
	columns: [
		{ header: "Name", key: "Name" },
		{ header: "Comments", key: "Comments" },
	],
	headerGroups: [{ title: "Pour Type Details", colspan: 2 }],
};
