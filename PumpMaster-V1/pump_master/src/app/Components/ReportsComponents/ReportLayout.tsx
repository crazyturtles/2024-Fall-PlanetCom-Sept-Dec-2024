import { format } from "date-fns";
import type { ReactNode } from "react";
import type { PageSetupState } from "../PageSetupModal";

interface ReportLayoutProps {
	title: string;
	subtitle?: string;
	pageSettings: PageSetupState;
	contentRef?: React.RefObject<HTMLDivElement>;
	customerName?: string;
	isLoading?: boolean;
	error?: string | null;
	pagination?: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
	};
	onRefresh?: () => void;
	children: ReactNode;
	className?: string;
}

export function ReportLayout({
	title,
	subtitle,
	pageSettings,
	contentRef,
	customerName,
	isLoading,
	error,
	pagination,
	onRefresh,
	children,
	className = "",
}: ReportLayoutProps) {
	return (
		<div className={`flex flex-col ${className}`}>
			{/* Report Header */}
			<div className="mb-4 border-b bg-white px-4 py-2 print:pb-4">
				<h1 className="text-left font-bold text-base text-gray-900">{title}</h1>
				{subtitle && (
					<div className="mt-1 text-gray-600 text-xs">{subtitle}</div>
				)}
				{customerName && (
					<div className="mt-1 text-gray-600 text-xs">
						Customer: {customerName}
					</div>
				)}
			</div>

			{/* Report Content */}
			<main className="flex-1 text-xs" ref={contentRef}>
				<div className="px-4">
					<div
						className="relative w-full"
						// style={{
						// 	minHeight: `${pageSettings.dimensions.height}mm`,
						// 	maxHeight: `${pageSettings.dimensions.height}mm`,
						// 	overflow: 'hidden'
						// }}
					>
						<div className="w-full">
							{error ? (
								<div className="mb-4 rounded-md bg-red-50 p-4">
									<div className="flex">
										<div className="ml-3">
											<h3 className="font-medium text-red-800 text-sm">
												Error loading report
											</h3>
											<div className="mt-2 text-red-700 text-sm">{error}</div>
										</div>
									</div>
								</div>
							) : isLoading ? (
								<div className="flex items-center justify-center p-8">
									<div className="animate-spin dark:text-black">Loading...</div>
								</div>
							) : (
								children
							)}
						</div>
					</div>
				</div>
			</main>

			{/* Report Footer */}
			<div className="mt-4 border-t px-4 py-1 text-xs">
				<div className="flex items-center justify-between">
					<div className="text-gray-900">
						Printed: {format(new Date(), "MMMM dd, yyyy HH:mm:ss")}
					</div>
					{pagination && (
						<div className="text-gray-900">
							Page {pagination.currentPage} of {pagination.totalPages}
							<span className="ml-2 text-gray-500">
								({pagination.totalItems} items)
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
