import type React from "react";
import { getStatusClass } from "./reports/jobHistoryConfig";
import type { Column, HeaderGroup } from "./types/reportTypes";

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	headerGroups?: HeaderGroup[];
	className?: string;
}

export function DataTable<T>({
	data,
	columns,
	headerGroups,
	className = "",
}: DataTableProps<T>) {
	const validData = Array.isArray(data)
		? data.filter((item): item is T => item != null)
		: [];

	const getCellContent = (item: T, column: Column<T>): React.ReactNode => {
		if (typeof column.accessor === "function") {
			return column.accessor(item);
		}

		const value = item[column.accessor];
		const content = column.formatter ? column.formatter(value) : value;

		if (column.header === "Status" && typeof content === "string") {
			return <span className={getStatusClass(content)}>{content}</span>;
		}

		return content as React.ReactNode;
	};

	const getCellClassName = (column: Column<T>): string => {
		const classes = [
			"border",
			"border-gray-300",
			"px-2",
			"py-1",
			"text-gray-900",
			"text-xs",
		];

		if (column.align) {
			classes.push(`text-${column.align}`);
		} else {
			classes.push("text-left");
		}

		if (column.width) {
			classes.push(column.width);
		}

		if (column.wrap === "nowrap") {
			classes.push("whitespace-nowrap");
		} else if (column.wrap === "wrap") {
			classes.push("whitespace-normal break-words");
		} else {
			classes.push("whitespace-normal");
		}

		return classes.join(" ");
	};

	if (validData.length === 0) {
		return (
			<div className="w-full p-8 text-center text-gray-500">
				No records found for the report.
			</div>
		);
	}

	return (
		<div className="w-full overflow-x-auto bg-white print:overflow-visible">
			<table
				className={`${className} w-full table-auto print:w-full print:min-w-0`}
			>
				{headerGroups && headerGroups.length > 0 && (
					<thead>
						<tr>
							{headerGroups.map((group, index) => (
								<th
									key={index}
									colSpan={group.colspan}
									className="whitespace-nowrap border border-gray-300 bg-gray-50 px-3 py-2 text-left font-medium text-gray-900 text-xs"
								>
									{group.title}
								</th>
							))}
						</tr>
					</thead>
				)}
				<thead className="print:table-header-group">
					<tr>
						{columns.map((column, index) => (
							<th key={index} className={getCellClassName(column)}>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{validData.map((item, rowIndex) => (
						<tr
							key={rowIndex}
							className={`print:break-inside-avoid ${
								rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
							}`}
						>
							{columns.map((column, colIndex) => (
								<td key={colIndex} className={getCellClassName(column)}>
									{getCellContent(item, column)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
