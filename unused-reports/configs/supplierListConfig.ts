import type { ReportConfig } from "@/app/Components/ReportsComponents/types/reportTypes";

export interface Supplier {
	CompanyName: string;
	Contact: string;
	Phone: string;
	Email: string;
}

export const supplierListConfig: ReportConfig<Supplier> = {
	title: "Supplier List",
	baseEndpoint: "/api/reports/supplier-list",
	columns: [
		{ header: "Company Name", key: "CompanyName" },
		{ header: "Contact Name", key: "Contact" },
		{ header: "Phone Number", key: "Phone" },
		{ header: "Email Address", key: "Email" },
	],
	headerGroups: [
		{ title: "Company Details", colspan: 2 },
		{ title: "Contact Information", colspan: 2 },
	],
};
