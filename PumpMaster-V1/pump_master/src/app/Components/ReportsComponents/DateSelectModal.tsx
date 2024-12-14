import { ModalForm } from "@/app/Components/ReportsComponents/ReportsModalComponents/ModalForm";
import type { FormField } from "@/app/Components/ReportsComponents/ReportsModalComponents/modalTypes";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DateSelectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (startDate: string, endDate: string) => void;
}

export default function DateSelectModal({
	isOpen,
	onClose,
	onSelect,
}: DateSelectModalProps) {
	const router = useRouter();
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [dateRange, setDateRange] = useState<string>("custom");

	const handleCancel = () => {
		router.push("/");
	};

	// Quick select options for common date ranges
	const handleQuickSelect = (range: string) => {
		const today = new Date();
		let start: Date;
		let end: Date;

		switch (range) {
			case "today":
				start = today;
				end = today;
				break;
			case "yesterday":
				start = addDays(today, -1);
				end = addDays(today, -1);
				break;
			case "last7":
				start = addDays(today, -7);
				end = addDays(today, -1);
				break;
			case "last30":
				start = addDays(today, -30);
				end = addDays(today, -1);
				break;
			case "thisMonth":
				start = startOfMonth(today);
				end = endOfMonth(today);
				break;
			case "lastMonth": {
				const lastMonth = addDays(startOfMonth(today), -1);
				start = startOfMonth(lastMonth);
				end = endOfMonth(lastMonth);
				break;
			}
			default:
				return;
		}

		setStartDate(format(start, "yyyy-MM-dd"));
		setEndDate(format(end, "yyyy-MM-dd"));
		setDateRange(range);
	};

	const fields: FormField[] = [
		{
			id: "date-range",
			label: "Quick Select",
			type: "select",
			value: dateRange,
			onChange: (value) => handleQuickSelect(value),
			options: [
				{ value: "custom", label: "Custom Range" },
				{ value: "today", label: "Today" },
				{ value: "yesterday", label: "Yesterday" },
				{ value: "last7", label: "Last 7 Days" },
				{ value: "last30", label: "Last 30 Days" },
				{ value: "thisMonth", label: "This Month" },
				{ value: "lastMonth", label: "Last Month" },
			],
		},
		{
			id: "start-date",
			label: "Start Date",
			type: "date",
			value: startDate,
			onChange: (value) => {
				setStartDate(value);
				setDateRange("custom");
			},
		},
		{
			id: "end-date",
			label: "End Date",
			type: "date",
			value: endDate,
			onChange: (value) => {
				setEndDate(value);
				setDateRange("custom");
			},
		},
	];

	const validateDates = (): boolean => {
		if (!startDate || !endDate) return false;
		const start = new Date(startDate);
		const end = new Date(endDate);
		return start <= end;
	};

	const handleSubmit = (e: React.FormEvent): void => {
		e.preventDefault();
		if (validateDates()) {
			onSelect(startDate, endDate);
		}
	};

	return (
		<ModalForm
			isOpen={isOpen}
			onClose={handleCancel}
			title="Select Date Range"
			fields={fields}
			onSubmit={handleSubmit}
			isSubmitDisabled={!validateDates()}
			submitLabel="Preview Report"
			size="md"
		/>
	);
}
