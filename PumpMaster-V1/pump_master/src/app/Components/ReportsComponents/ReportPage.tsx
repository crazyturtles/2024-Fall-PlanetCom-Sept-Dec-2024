"use client";

import CustomerSelectModal from "@/app/Components/ReportsComponents/CustomerSelectModal";
import { DataTable } from "@/app/Components/ReportsComponents/DataTable";
import DateSelectModal from "@/app/Components/ReportsComponents/DateSelectModal";
import PrintPreviewLayout from "@/app/Components/ReportsComponents/PrintPreviewLayout";
import {
	type BaseReportRow,
	type ReportConfig,
	createColumns,
} from "@/app/Components/ReportsComponents/types/reportTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageSetupModal, { type PageSetupState } from "../PageSetupModal";
import { useCustomerSelect } from "../hooks/useCustomerSelect";
import { ReportLayout } from "./ReportLayout";

const DEFAULT_PAGE_SETTINGS: PageSetupState = {
	size: "Letter",
	orientation: "landscape",
	margins: {
		left: 6.35,
		right: 6.35,
		top: 6.35,
		bottom: 6.35,
	},
	dimensions: {
		width: 215.9,
		height: 279.4,
	},
};

export function ReportPage<T extends BaseReportRow>({
	config,
}: {
	config: ReportConfig<T>;
}) {
	const router = useRouter();
	const [data, setData] = useState<T[]>([]);
	const [subtitle, setSubtitle] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDateModalOpen, setIsDateModalOpen] = useState(
		config.requiresDateRange ?? false,
	);
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [zoom, setZoom] = useState(100);
	const [printSettings, setPrintSettings] = useState<PageSetupState>(
		DEFAULT_PAGE_SETTINGS,
	);
	const [isPageSetupModalOpen, setIsPageSetupModalOpen] = useState(false);

	const {
		isModalOpen: isCustomerModalOpen,
		selectedCustomerId,
		selectedCustomerName,
		showReport: showCustomerReport,
		handleModalClose: handleCustomerModalClose,
		handleCustomerSelect,
		showUnitSearch,
	} = useCustomerSelect(
		config.requiresCustomer,
		config.baseEndpoint.includes("job-history"),
	);

	const fetchData = async () => {
		setError(null);
		setIsLoading(true);

		try {
			if (config.requiresCustomer && !selectedCustomerId) return;
			if (config.requiresDateRange && (!startDate || !endDate)) return;

			const response = await fetch(getApiEndpoint());
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const jsonData = await response.json();

			if (jsonData.subtitle) {
				setSubtitle(jsonData.subtitle);
			}

			if (config.onDataReceived) {
				const processedData = await config.onDataReceived(jsonData);
				setData(processedData);
			} else {
				setData(jsonData.data || jsonData);
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while fetching the data",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const getApiEndpoint = (): string => {
		const params = new URLSearchParams(config.additionalParams);

		if (config.requiresCustomer && selectedCustomerId) {
			params.append("customerId", selectedCustomerId);
			const searchTerm = localStorage.getItem("unitSearchTerm") || "";
			if (searchTerm && config.baseEndpoint.includes("job-history")) {
				params.append("unitSent", searchTerm);
			}
		}

		if (config.requiresDateRange && startDate && endDate) {
			params.append("startDate", startDate);
			params.append("endDate", endDate);
		}

		return `${config.baseEndpoint}${params.toString() ? `?${params.toString()}` : ""}`;
	};

	const handleDateSelect = (start: string, end: string) => {
		setStartDate(start);
		setEndDate(end);
		setIsDateModalOpen(false);
	};

	useEffect(() => {
		if (
			(!config.requiresCustomer || selectedCustomerId) &&
			(!config.requiresDateRange || (startDate && endDate))
		) {
			fetchData();
		}
	}, [config, selectedCustomerId, startDate, endDate]);

	const paginatedData = Array.isArray(data)
		? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
		: [];

	const renderReportContent = () => {
		return (
			<ReportLayout
				title={config.title}
				subtitle={subtitle}
				pageSettings={printSettings}
				customerName={selectedCustomerName || undefined}
				isLoading={isLoading}
				error={error}
				pagination={{
					currentPage,
					totalPages: Math.ceil(
						(Array.isArray(data) ? data.length : 0) / rowsPerPage,
					),
					totalItems: Array.isArray(data) ? data.length : 0,
				}}
				onRefresh={fetchData}
			>
				<div className="w-full">
					<DataTable<T>
						columns={createColumns(config.columns)}
						headerGroups={config.headerGroups}
						data={paginatedData}
						className={config.className}
					/>
				</div>
			</ReportLayout>
		);
	};

	if (config.requiresCustomer && !showCustomerReport) {
		return (
			<CustomerSelectModal
				isOpen={isCustomerModalOpen}
				onClose={handleCustomerModalClose}
				onSelect={handleCustomerSelect}
				showUnitSearch={config.baseEndpoint.includes("job-history")}
			/>
		);
	}

	if (config.requiresDateRange && (!startDate || !endDate)) {
		return (
			<DateSelectModal
				isOpen={isDateModalOpen}
				onClose={() => router.push("/")}
				onSelect={handleDateSelect}
			/>
		);
	}

	return (
		<>
			<PrintPreviewLayout
				title={config.title}
				subtitle={subtitle}
				data={data}
				columns={createColumns(config.columns)}
				headerGroups={config.headerGroups}
				currentPage={currentPage}
				totalPages={Math.ceil(data.length / rowsPerPage)}
				zoom={zoom}
				pageSettings={printSettings}
				additionalHeaderContent={
					selectedCustomerName && (
						<div className="text-sm">Customer: {selectedCustomerName}</div>
					)
				}
				onPrint={() => {
					window.print();
				}}
				onNextPage={() =>
					setCurrentPage((prev) =>
						Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)),
					)
				}
				onPrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
				onZoomIn={() => setZoom((prev) => Math.min(prev + 25, 200))}
				onZoomOut={() => setZoom((prev) => Math.max(prev - 25, 25))}
				onRefresh={fetchData}
				onPageSetupClick={() => setIsPageSetupModalOpen(true)}
			>
				{renderReportContent()}
			</PrintPreviewLayout>

			<PageSetupModal
				isOpen={isPageSetupModalOpen}
				onClose={() => setIsPageSetupModalOpen(false)}
				onSave={(settings) => {
					setPrintSettings(settings);
					setIsPageSetupModalOpen(false);
				}}
			/>
			<CustomerSelectModal
				isOpen={isCustomerModalOpen}
				onClose={handleCustomerModalClose}
				onSelect={handleCustomerSelect}
				showUnitSearch={config.baseEndpoint.includes("job-history")}
			/>
			<DateSelectModal
				isOpen={isDateModalOpen}
				onClose={() => router.push("/")}
				onSelect={handleDateSelect}
			/>
		</>
	);
}
