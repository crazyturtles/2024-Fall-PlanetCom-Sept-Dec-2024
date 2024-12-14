import { format } from "date-fns";
import type { PageSetupState } from "../PageSetupModal";
import { DataTable } from "./DataTable";
import type { Column, HeaderGroup } from "./types/reportTypes";

interface PrintContentProps<T> {
	data: T[];
	columns: Column<T>[];
	headerGroups?: HeaderGroup[];
	title: string;
	subtitle?: string;
	pageSettings: PageSetupState;
	additionalHeaderContent?: React.ReactNode;
	className?: string;
}

export function PrintContent<T>({
	data,
	columns,
	headerGroups,
	title,
	subtitle,
	pageSettings,
	additionalHeaderContent,
	className = "",
}: PrintContentProps<T>) {
	const { margins } = pageSettings;

	return (
		<div
			className={`print-content ${className}`}
			style={{
				padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
			}}
		>
			{/* Report Header */}
			<div className="mb-6">
				<h1 className="mb-1 font-bold text-xl">{title}</h1>
				{subtitle && (
					<div className="mb-2 text-gray-600 text-sm">{subtitle}</div>
				)}
				{additionalHeaderContent}
			</div>

			{/* Report Content */}
			<div className="mb-6">
				<DataTable<T>
					data={data}
					columns={columns}
					headerGroups={headerGroups}
					className="print-table w-full"
				/>
			</div>

			{/* Report Footer */}
			<div className="mt-4 text-gray-600 text-xs">
				<div className="flex justify-between">
					<span>Printed: {format(new Date(), "MMMM dd, yyyy HH:mm:ss")}</span>
				</div>
			</div>
		</div>
	);
}
