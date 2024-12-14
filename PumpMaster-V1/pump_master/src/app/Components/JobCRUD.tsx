"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterJob from "./FilterJob";
import JobTable from "./JobTable";
import SearchJob from "./SearchJob";
import UnitStatus from "./UnitStatus";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface JobCRUDProps {
	entityName: string;
	entityTable: string;
	fetchLink: string;
	onOpenForm: (jobId: number) => void;
}

const JobCRUD = ({
	entityName,
	entityTable,
	fetchLink,
	onOpenForm,
}: JobCRUDProps) => {
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

	const [currentTime, setCurrentTime] = useState<string>("");
	const [showTimeCounter, setShowTimeCounter] = useState<boolean>(false);

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);

		const dateString = date.toISOString().split("T")[0];
		router.replace(`?date=${dateString}`);
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = new Date();
			setCurrentTime(now.toLocaleTimeString());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

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

	const isToday = selectedDate.toDateString() === new Date().toDateString();

	return (
		<div className="job-crud-container">
			<h2 data-testid="dashboard-heading" className="mb-4 font-semibold text-2xl text-black">
				{entityName} Dashboard
			</h2>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<FilterJob onDateChange={handleDateChange} />
				</div>
				<div className="relative text-center">
					<button
						type="button"
						data-testid="toggle-time-counter"
						onClick={() => setShowTimeCounter((prev) => !prev)}
						className="transform cursor-pointer rounded-full bg-blue-500 px-8 py-2 font-bold text-2xl text-white transition-transform hover:bg-blue-700 active:scale-95"
					>
						{selectedDate.toLocaleDateString("en-US", { weekday: "long" })},{" "}
						{selectedDate.toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</button>

					{showTimeCounter && (
						<div
							className="-top-20 -translate-x-1/2 absolute left-1/2 z-30 transform rounded-lg bg-gray-800 px-4 py-2 font-bold text-lg text-white shadow-lg"
							style={{ minWidth: "150px", textAlign: "center" }}
						>
							<p>Current Time:</p>
							<p className="text-xl">{currentTime}</p>
						</div>
					)}
				</div>
				<div>
					<div className="flex space-x-2 text-black">
						<UnitStatus fetchLink={fetchLink} filterDate={selectedDate} />
						<SearchJob
							fetchLink={fetchLink}
							onEdit={(jobId: number): void => {
								onOpenForm(jobId);
							}}
						/>
					</div>
				</div>
			</div>

			{process.env.NODE_ENV === "test" && (
				<div data-testid="selected-date">{selectedDate.toISOString()}</div>
			)}

			<JobTable
				entityTable={entityTable}
				fetchLink={fetchLink}
				onEdit={onOpenForm}
				filterDate={selectedDate}
				jobs={[]}
			/>
		</div>
	);
};

export default JobCRUD;
