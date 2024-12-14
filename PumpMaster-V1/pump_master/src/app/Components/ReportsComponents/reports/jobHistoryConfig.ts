import type { ReportConfig } from "../types/reportTypes";
import { createReportConfig, createTypedColumn } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface JobHistory {
	Customer: string;
	"Job Date": string;
	"Pour Time": string;
	"Unit Sent": string;
	Operator: string;
	"Site Phone": string;
	"Site Address": string;
	"Site Area": string;
	Supplier: string;
	"Pour Types": string;
	Status: string;
}

const createColumn = createTypedColumn<JobHistory>;

export const JOB_STATUS = {
	PENDING: "Pending",
	CONFIRMED: "Confirmed",
	SCHEDULED: "Scheduled",
	OPERATOR_CONFIRMED: "Operator Confirmed",
	CLEANING: "Cleaning",
	COMPLETE: "Complete",
	CANCELLED: "Cancelled",
	INVOICED: "Invoiced",
} as const;

export const getStatusClass = (status: string): string => {
	const statusMap: Record<string, string> = {
		[JOB_STATUS.OPERATOR_CONFIRMED]: "bg-green-100 text-green-700",
		[JOB_STATUS.CANCELLED]: "bg-red-100 text-red-700",
		[JOB_STATUS.INVOICED]: "bg-blue-100 text-blue-700",
	};

	return `${statusMap[status] || "bg-gray-100 text-gray-700"} px-2 py-0.5 rounded-full text-xs font-medium text-center inline-block min-w-[90px]`;
};

export const jobHistoryConfig: ReportConfig<JobHistory> = createReportConfig({
	title: "Job History Report",
	baseEndpoint: "/api/reports/job-history",
	requiresCustomer: true,
	requiresDateRange: false,

	columns: [
		createColumn({
			header: "Job Date",
			key: "Job Date",
			formatter: columnFormatters.date,
			width: "w-min",
			wrap: "nowrap",
			align: "left",
		}),
		createColumn({
			header: "Pour Time",
			key: "Pour Time",
			formatter: columnFormatters.time,
			width: "w-min",
			wrap: "nowrap",
			align: "left",
		}),
		createColumn({
			header: "Unit Sent",
			key: "Unit Sent",
			width: "w-min",
			wrap: "nowrap",
			align: "left",
			searchable: true,
		}),
		createColumn({
			header: "Operator",
			key: "Operator",
			width: "w-min",
			wrap: "wrap",
			align: "left",
		}),
		createColumn({
			header: "Phone",
			key: "Site Phone",
			width: "w-min",
			wrap: "nowrap",
			align: "left",
		}),
		createColumn({
			header: "Address",
			key: "Site Address",
			width: "col-20",
			wrap: "wrap",
			align: "left",
		}),
		createColumn({
			header: "Area",
			key: "Site Area",
			width: "w-min",
			wrap: "wrap",
			align: "left",
		}),
		createColumn({
			header: "Supplier",
			key: "Supplier",
			width: "w-min",
			wrap: "wrap",
			align: "left",
		}),
		createColumn({
			header: "Pour Types",
			key: "Pour Types",
			width: "w-min",
			wrap: "nowrap",
			align: "left",
		}),
		createColumn({
			header: "Status",
			key: "Status",
			width: "w-min",
			wrap: "nowrap",
			align: "center",
		}),
	],

	headerGroups: [
		{ title: "Job Details", colspan: 3 },
		{ title: "Site Information", colspan: 4 },
		{ title: "Pour Details", colspan: 3 },
	],

	defaultSort: {
		key: "Job Date",
		direction: "desc",
	},

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

	additionalParams: {
		includeCompleted: "true",
		includeCancelled: "true",
	},

	className: "job-history-table",
});

export const jobHistoryConfigs = {
	default: jobHistoryConfig,

	compact: {
		...jobHistoryConfig,
		columns: jobHistoryConfig.columns.filter((col) =>
			["Job Date", "Unit Sent", "Operator", "Site Address", "Status"].includes(
				col.header as string,
			),
		),
	},

	print: {
		...jobHistoryConfig,
		printConfig: {
			orientation: "landscape",
			pageSize: "letter",
			margins: {
				top: 0.5,
				right: 0.25,
				bottom: 0.5,
				left: 0.25,
			},
		},
	},

	export: {
		...jobHistoryConfig,
		columns: jobHistoryConfig.columns.map((col) => ({
			...col,
			width: "auto",
			wrap: "wrap",
		})),
	},
};

export function getJobHistoryColumn(columnName: keyof JobHistory) {
	return jobHistoryConfig.columns.find((col) => col.key === columnName);
}

export function isJobHistory(record: any): record is JobHistory {
	return (
		typeof record === "object" &&
		record !== null &&
		typeof record["Job Date"] === "string" &&
		typeof record["Unit Sent"] === "string" &&
		typeof record.Status === "string"
	);
}
