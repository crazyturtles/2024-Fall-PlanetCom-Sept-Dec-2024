import type React from "react";

export type ColumnAlignment = "left" | "right" | "center";
export type ColumnWrap = "nowrap" | "wrap";
export type ColumnWidth =
	| "w-min"
	| "w-auto"
	| "w-max"
	| "col-5"
	| "col-10"
	| "col-15"
	| "col-20"
	| "col-25"
	| "col-30"
	| "col-35"
	| "col-40"
	| "col-50";

export interface BaseReportRow {
	[key: string]: any;
}

export interface HeaderGroup {
	title: string;
	colspan: number;
}

export interface Column<T> {
	header: string | React.ReactNode;
	accessor: keyof T | ((item: T) => React.ReactNode);
	align?: ColumnAlignment;
	width?: ColumnWidth;
	wrap?: ColumnWrap;
	formatter?: (value: any) => string | number;
}

export interface ColumnConfig<T> {
	header: string;
	key: keyof T;
	align?: ColumnAlignment;
	width?: ColumnWidth;
	wrap?: ColumnWrap;
	formatter?: (value: any) => string | number;
	searchable?: boolean;
}

export interface ReportConfig<T extends BaseReportRow = BaseReportRow> {
	title: string;
	baseEndpoint: string;
	requiresCustomer?: boolean;
	requiresDateRange?: boolean;
	className?: string;
	additionalParams?: Record<string, string>;
	columns: ColumnConfig<T>[];
	headerGroups?: HeaderGroup[];
	defaultSort?: {
		key: keyof T;
		direction: "asc" | "desc";
	};
	printConfig?: {
		orientation?: "portrait" | "landscape";
		pageSize?: "letter" | "legal" | "a4";
		margins?: {
			top?: number;
			right?: number;
			bottom?: number;
			left?: number;
		};
	};
	onDataReceived?: (response: any) => Promise<T[]>;
}

export function createColumns<T>(config: ColumnConfig<T>[]): Column<T>[] {
	return config.map(({ header, key, align, width, wrap, formatter }) => ({
		header,
		accessor: formatter ? (item: T) => formatter(item[key]) : key,
		align,
		width,
		wrap,
	}));
}

// Type guard for checking if a value is a valid column alignment
export function isValidColumnAlignment(
	value: string,
): value is ColumnAlignment {
	return ["left", "right", "center"].includes(value);
}

// Type guard for checking if a value is a valid column wrap setting
export function isValidColumnWrap(value: string): value is ColumnWrap {
	return ["nowrap", "wrap"].includes(value);
}

// Type guard for checking if a value is a valid column width
export function isValidColumnWidth(value: string): value is ColumnWidth {
	const validWidths = [
		"w-min",
		"w-auto",
		"w-max",
		"col-5",
		"col-10",
		"col-15",
		"col-20",
		"col-25",
		"col-30",
		"col-35",
		"col-40",
		"col-50",
	];
	return validWidths.includes(value);
}

// Helper function to create a basic report configuration
export function createReportConfig<T extends BaseReportRow>(
	config: Partial<ReportConfig<T>> &
		Pick<ReportConfig<T>, "title" | "baseEndpoint" | "columns">,
): ReportConfig<T> {
	return {
		...config,
		className: config.className ?? "",
		requiresCustomer: config.requiresCustomer ?? false,
		requiresDateRange: config.requiresDateRange ?? false,
		additionalParams: config.additionalParams ?? {},
		printConfig: {
			orientation: "landscape",
			pageSize: "letter",
			margins: {
				top: 0.5,
				right: 0.5,
				bottom: 0.5,
				left: 0.5,
			},
			...config.printConfig,
		},
	};
}

export function createTypedColumn<T>(
	config: Omit<ColumnConfig<T>, "key"> & { key: keyof T },
): ColumnConfig<T> {
	return config;
}
