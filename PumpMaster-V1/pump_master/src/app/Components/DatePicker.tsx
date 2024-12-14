"use client";

import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
	selectedDate: Date;
	onDateChange: (newDate: Date) => void;
}

const DatePicker = ({ selectedDate, onDateChange }: DatePickerProps) => {
	const [viewingMonth, setViewingMonth] = useState<number>(
		selectedDate.getMonth(),
	);
	const [viewingYear, setViewingYear] = useState<number>(
		selectedDate.getFullYear(),
	);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isYearPicker, setIsYearPicker] = useState<boolean>(false);
	const [isMonthPicker, setIsMonthPicker] = useState<boolean>(false);
	const datePickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				datePickerRef.current &&
				!datePickerRef.current.contains(event.target as Node) &&
				!isYearPicker &&
				!isMonthPicker
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isYearPicker, isMonthPicker]);

	useEffect(() => {
		setViewingMonth(selectedDate.getMonth());
		setViewingYear(selectedDate.getFullYear());
	}, [selectedDate]);

	const generateCalendar = () => {
		const firstDayOfMonth = new Date(viewingYear, viewingMonth, 1);
		const lastDayOfMonth = new Date(viewingYear, viewingMonth + 1, 0);
		const daysInMonth = lastDayOfMonth.getDate();
		const firstDay = firstDayOfMonth.getDay();
		const calendarDays: (number | null)[] = [];

		for (let i = 0; i < firstDay; i++) {
			calendarDays.push(null);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			calendarDays.push(day);
		}

		return calendarDays;
	};

	const changeMonth = (increment: boolean) => {
		if (increment) {
			if (viewingMonth === 11) {
				setViewingMonth(0);
				setViewingYear(viewingYear + 1);
			} else {
				setViewingMonth(viewingMonth + 1);
			}
		} else {
			if (viewingMonth === 0) {
				setViewingMonth(11);
				setViewingYear(viewingYear - 1);
			} else {
				setViewingMonth(viewingMonth - 1);
			}
		}
	};

	const toggleYearPicker = () => {
		setIsYearPicker(!isYearPicker);
		setIsMonthPicker(false);
	};

	const toggleMonthPicker = () => {
		setIsMonthPicker(!isMonthPicker);
		setIsYearPicker(false);
	};

	const selectYear = (year: number) => {
		setViewingYear(year);
		setIsYearPicker(false);
		setIsMonthPicker(true);
	};

	const selectMonth = (month: number) => {
		setViewingMonth(month);
		setIsMonthPicker(false);
	};

	const handleDayClick = (day: number) => {
		onDateChange(new Date(viewingYear, viewingMonth, day));
		setIsOpen(false);
	};

	const yearRange = Array.from({ length: 21 }, (_, i) => 2014 + i);

	return (
		<div className="relative" ref={datePickerRef} data-testid="date-picker">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
				className="flex items-center justify-center rounded-full bg-blue-500 px-5 py-3 font-bold text-sm text-white hover:bg-blue-600"
				data-testid="date-picker-button"
			>
				{`${selectedDate.getDate().toString().padStart(2, "0")}-${(
					selectedDate.getMonth() + 1
				)
					.toString()
					.padStart(2, "0")}-${selectedDate.getFullYear()}`}
			</button>

			{isOpen && (
				<div className="-left-3 absolute top-full z-20 mt-2 w-64 rounded-lg bg-white p-3 shadow-lg">
					<div
						className={`flex ${!isYearPicker && !isMonthPicker
							? "justify-between"
							: "justify-center"
							} mb-2 items-center text-sm`}
					>
						{!isYearPicker && !isMonthPicker && (
							<div className="flex w-1/2 justify-between">
								<button
									type="button"
									className="text-blue-600 text-lg"
									onClick={() => changeMonth(false)}
									onKeyDown={(e) => e.key === "Enter" && changeMonth(false)}
								>
									<i className="fas fa-chevron-left" />
								</button>
								<button
									type="button"
									className="text-blue-600 text-lg"
									onClick={() => changeMonth(true)}
									onKeyDown={(e) => e.key === "Enter" && changeMonth(true)}
								>
									<i className="fas fa-chevron-right" />
								</button>
							</div>
						)}
						<span
							className="cursor-pointer font-semibold text-sm"
							onClick={toggleYearPicker}
							onKeyDown={(e) => e.key === "Enter" && toggleYearPicker()}
						>
							{isYearPicker
								? "Select Year"
								: `${new Date(viewingYear, viewingMonth).toLocaleString(
									"default",
									{ month: "long" },
								)} ${viewingYear}`}
						</span>
					</div>

					{isYearPicker && (
						<div className="flex flex-wrap justify-center gap-1">
							{yearRange.map((year) => (
								<button
									key={year}
									type="button"
									className="rounded-full px-2 py-1 text-sm hover:bg-blue-500 hover:text-white"
									onClick={() => selectYear(year)}
									onKeyDown={(e) => e.key === "Enter" && selectYear(year)}
								>
									{year}
								</button>
							))}
						</div>
					)}

					{isMonthPicker && (
						<div className="grid grid-cols-3 gap-2 text-center">
							{Array.from({ length: 12 }, (_, i) => (
								<button
									key={i}
									type="button"
									className="rounded-full px-2 py-1 text-sm hover:bg-blue-500 hover:text-white"
									onClick={() => selectMonth(i)}
									onKeyDown={(e) => e.key === "Enter" && selectMonth(i)}
								>
									{new Date(viewingYear, i).toLocaleString("default", {
										month: "short",
									})}
								</button>
							))}
						</div>
					)}

					{!isYearPicker && !isMonthPicker && (
						<>
							<div className="grid grid-cols-7 gap-1 text-center text-xs">
								{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
									(day) => (
										<div key={day} className="font-semibold text-xs">
											{day}
										</div>
									),
								)}
							</div>
							<div className="grid grid-cols-7 gap-1 text-center text-xs">
								{generateCalendar().map((day, idx) =>
									day !== null ? (
										<button
											key={idx}
											type="button"
											className={`flex items-center justify-center rounded-full px-2 py-1.5 text-xs ${selectedDate.getDate() === day &&
												selectedDate.getMonth() === viewingMonth &&
												selectedDate.getFullYear() === viewingYear
												? "bg-blue-500 text-white"
												: "hover:bg-blue-500 hover:text-white"
												}`}
											onClick={() => handleDayClick(day)}
											onKeyDown={(e) =>
												e.key === "Enter" && handleDayClick(day)
											}
										>
											{day}
										</button>
									) : (
										<div key={idx} />
									),
								)}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default DatePicker;
