"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "./DatePicker";

interface FilterJobProps {
	onDateChange: (date: Date) => void;
}

const FilterJob = ({ onDateChange }: FilterJobProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryDate = searchParams?.get("date");

	const [selectedDate, setSelectedDate] = useState<Date>(() => {
		if (queryDate) {
			const [year, month, day] = queryDate.split("-").map(Number);
			return new Date(year, month - 1, day);
		}
		return new Date();
	});

	const isToday = () => {
		const today = new Date();
		return (
			selectedDate.getDate() === today.getDate() &&
			selectedDate.getMonth() === today.getMonth() &&
			selectedDate.getFullYear() === today.getFullYear()
		);
	};

	const handleDateChange = (newDate: Date) => {
		const normalizedDate = new Date(
			newDate.getFullYear(),
			newDate.getMonth(),
			newDate.getDate(),
		);
		setSelectedDate(normalizedDate);
		onDateChange(normalizedDate);

		const dateString = normalizedDate.toISOString().slice(0, 10);
		router.replace(`?date=${dateString}`);
	};

	const goToPreviousDay = () => {
		const previousDay = new Date(selectedDate);
		previousDay.setDate(previousDay.getDate() - 1);
		handleDateChange(previousDay);
	};

	const goToNextDay = () => {
		const nextDay = new Date(selectedDate);
		nextDay.setDate(nextDay.getDate() + 1);
		handleDateChange(nextDay);
	};

	const goToToday = () => {
		const today = new Date();
		handleDateChange(today);
	};

	useEffect(() => {
		onDateChange(selectedDate);
	}, [selectedDate]);

	useEffect(() => {
		if (queryDate) {
			const [year, month, day] = queryDate.split("-").map(Number);
			setSelectedDate(new Date(year, month - 1, day));
		} else {
			const today = new Date();
			const localToday = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
			);
			setSelectedDate(localToday);
		}
	}, [queryDate]);

	return (
		<div className="filter-job-container flex items-center gap-2 text-black">
			<button
				type="button"
				onClick={goToPreviousDay}
				data-testid="previous-day"
				className="flex h-11 w-12 items-center justify-center rounded-full bg-blue-500 px-5 py-3 font-bold text-sm text-white hover:bg-blue-700"
			>
				<i className="fas fa-angle-left" />
			</button>

			<DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />

			<button
				type="button"
				onClick={goToToday}
				data-testid="today-button"
				className={`flex items-center justify-center rounded-full px-5 py-3 font-bold text-sm ${isToday()
						? "outlined-blue"
						: "bg-blue-500 text-white hover:bg-blue-700"
					}`}
			>
				Today
			</button>

			<button
				type="button"
				onClick={goToNextDay}
				data-testid="next-day"
				className="flex h-11 w-12 items-center justify-center rounded-full bg-blue-500 px-5 py-3 font-bold text-sm text-white hover:bg-blue-700"
			>
				<i className="fas fa-angle-right" />
			</button>
		</div>
	);
};

export default FilterJob;
