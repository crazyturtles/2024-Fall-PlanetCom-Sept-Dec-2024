import type { PageSetupState } from "@/app/Components/PageSetupModal";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TableState<T> {
	data: T[];
	isLoading: boolean;
	error: string;
	page: number;
	rowsPerPage: number;
	dynamicRowsPerPage: number;
	isPageSetupOpen: boolean;
	pageSettings: PageSetupState;
	tableContainerRef: React.RefObject<HTMLDivElement>;
}

export interface TableActions {
	handleChangePage: (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => void;
	handleChangeRowsPerPage: (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => void;
	handlePageSetupSave: (settings: PageSetupState) => void;
	setIsPageSetupOpen: (isOpen: boolean) => void;
	getCurrentPageData: () => any[];
	fetchData: () => Promise<void>;
}

const DEFAULT_PAGE_SETTINGS: PageSetupState = {
	size: "Letter",
	orientation: "landscape",
	margins: {
		left: 6.35,
		right: 6.35,
		top: 6.35,
		bottom: 6.35,
	},
	dimensions: { width: 215.9, height: 279.4 },
};

const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 52;

export function useTablePagination<T>(
	fetchUrl: string,
): [TableState<T>, TableActions] {
	const [data, setData] = useState<T[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
	const [dynamicRowsPerPage, setDynamicRowsPerPage] = useState(25);
	const [pageSettings, setPageSettings] = useState<PageSetupState>(
		DEFAULT_PAGE_SETTINGS,
	);

	const tableContainerRef = useRef<HTMLDivElement>(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(fetchUrl);
			if (!response.ok) {
				throw new Error(`Failed to fetch data from ${fetchUrl}`);
			}
			const result = await response.json();
			setData(result);
			setError("");
		} catch (err) {
			setError("Failed to fetch data. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, [fetchUrl]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const getCurrentPageData = useCallback(() => {
		const startIndex = page * rowsPerPage;
		const endIndex = startIndex + rowsPerPage;
		return data.slice(startIndex, endIndex);
	}, [data, page, rowsPerPage]);

	const calculateRowsPerPage = useCallback(() => {
		if (!tableContainerRef.current) return;

		const containerHeight = tableContainerRef.current.clientHeight;
		const mmToPx = 3.779528;
		const marginsHeight =
			(pageSettings.margins.top + pageSettings.margins.bottom) * mmToPx;

		const availableHeight =
			containerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - marginsHeight;
		const calculatedRows = Math.floor(availableHeight / ROW_HEIGHT);

		return Math.max(10, calculatedRows);
	}, [pageSettings.margins.top, pageSettings.margins.bottom]);

	useEffect(() => {
		const updateRowsPerPage = () => {
			const calculated = calculateRowsPerPage();
			if (calculated) {
				setDynamicRowsPerPage(calculated);
				setRowsPerPage(calculated);
			}
		};

		updateRowsPerPage();
		window.addEventListener("resize", updateRowsPerPage);
		return () => window.removeEventListener("resize", updateRowsPerPage);
	}, [calculateRowsPerPage, pageSettings.margins]);

	const handleChangePage = useCallback(
		(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
			setPage(newPage);
		},
		[],
	);

	const handleChangeRowsPerPage = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number.parseInt(event.target.value, 10));
			setPage(0);
		},
		[],
	);

	const handlePageSetupSave = useCallback((settings: PageSetupState) => {
		setPageSettings(settings);
		setIsPageSetupOpen(false);
	}, []);

	return [
		{
			data,
			isLoading,
			error,
			page,
			rowsPerPage,
			dynamicRowsPerPage,
			isPageSetupOpen,
			pageSettings,
			tableContainerRef,
		},
		{
			handleChangePage,
			handleChangeRowsPerPage,
			handlePageSetupSave,
			setIsPageSetupOpen,
			getCurrentPageData,
			fetchData,
		},
	];
}
