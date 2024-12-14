import type { ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface InventoryItem {
	Category: string;
	"Part #": string;
	"Part Description": string;
	Qty: number;
	Cost: number;
}

export const inventoryConfig: ReportConfig<InventoryItem> = {
	title: "Inventory List",
	baseEndpoint: "/api/reports/inventory-list",
	columns: [
		{ header: "Category", key: "Category" },
		{ header: "Part #", key: "Part #" },
		{ header: "Part Description", key: "Part Description" },
		{
			header: "Qty",
			key: "Qty",
			align: "right",
			formatter: columnFormatters.number,
		},
		{
			header: "Cost",
			key: "Cost",
			align: "right",
			formatter: columnFormatters.currency,
		},
	],
};
