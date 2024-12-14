import { format } from "date-fns";
import { useState } from "react";

interface UseJobForecastReturn {
	isModalOpen: boolean;
	startDate: string | null;
	endDate: string | null;
	handleDateSelect: (start: string, end: string) => void;
	handleModalClose: () => void;
	getApiEndpoint: () => string;
	getFormattedTitle: () => string;
}

export function useJobForecast(): UseJobForecastReturn {
	const [isModalOpen, setIsModalOpen] = useState(true);
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);

	const handleDateSelect = (start: string, end: string) => {
		setStartDate(start);
		setEndDate(end);
		setIsModalOpen(false);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const getApiEndpoint = () => {
		const params = new URLSearchParams();
		if (startDate) params.append("startDate", startDate);
		if (endDate) params.append("endDate", endDate);
		return `/api/reports/job-forecast${params.toString() ? `?${params.toString()}` : ""}`;
	};

	const getFormattedTitle = () => {
		if (!startDate || !endDate) return "Job Forecast";
		return `Job Forecast (${format(new Date(startDate), "MMM dd, yyyy")} - ${format(new Date(endDate), "MMM dd, yyyy")})`;
	};

	return {
		isModalOpen,
		startDate,
		endDate,
		handleDateSelect,
		handleModalClose,
		getApiEndpoint,
		getFormattedTitle,
	};
}
