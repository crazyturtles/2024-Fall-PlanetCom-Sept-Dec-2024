import type { ReportConfig } from "../types/reportTypes";

export interface Customer {
	CompanyName: string;
	Contact: string;
	Phone: string;
	Email: string;
}

export const customerListConfig: ReportConfig<Customer> = {
	title: "Customer List",
	baseEndpoint: "/api/reports/customer-list",
	columns: [
		{ header: "Company Name", key: "CompanyName" },
		{ header: "Contact", key: "Contact" },
		{ header: "Phone Number", key: "Phone" },
		{ header: "Email Address", key: "Email" },
	],
};
