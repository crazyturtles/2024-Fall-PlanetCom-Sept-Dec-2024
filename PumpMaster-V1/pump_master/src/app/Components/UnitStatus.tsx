import { useEffect, useState } from "react";
import Modal from "./Modal";

interface UnitStatusProps {
	fetchLink: string;
	filterDate: Date | null;
}

interface Unit {
	unitID: number;
	unitNumber: string;
}

interface Job {
	JobUnitID: number | null;
}

const UnitStatus = ({ fetchLink, filterDate }: UnitStatusProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [units, setUnits] = useState<Unit[]>([]);
	const [unitJobCounts, setUnitJobCounts] = useState<Map<number, number>>(
		new Map(),
	);
	const [loading, setLoading] = useState(false);

	const fetchUnits = async () => {
		setLoading(true);
		setUnits([]);
		const url = `http://localhost:3001/${fetchLink}/unit-status`;

		try {
			const response = await fetch(url);
			const data = await response.json();
			const validatedUnits = data
				.map((unit: any) => {
					if (unit.UnitID !== undefined && unit.UnitNumber !== undefined) {
						return { unitID: unit.UnitID, unitNumber: unit.UnitNumber };
					}
					console.warn("Invalid unit data found:", unit);
					return null;
				})
				.filter((unit: Unit | null) => unit !== null) as Unit[];
			setUnits(validatedUnits);
		} catch (error) {
			console.error("Error fetching units:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchJobsForDate = async () => {
		if (!filterDate) return;
		setUnitJobCounts(new Map());
		const dateString = filterDate.toISOString().slice(0, 10);
		const url = `http://localhost:3001/${fetchLink}?date=${dateString}`;

		try {
			const response = await fetch(url);
			const { jobs } = await response.json();

			const jobCounts = new Map<number, number>();
			jobs.forEach((job: Job) => {
				if (job.JobUnitID !== null && job.JobUnitID !== undefined) {
					jobCounts.set(job.JobUnitID, (jobCounts.get(job.JobUnitID) || 0) + 1);
				}
			});

			setUnitJobCounts(jobCounts);
		} catch (error) {
			console.error("Error fetching jobs for date:", error);
		}
	};

	useEffect(() => {
		if (isModalOpen) {
			fetchUnits();
			fetchJobsForDate();
		}
	}, [isModalOpen, filterDate]);

	const getProgressPercentage = (count: number) =>
		Math.round((count / 7) * 100 * 100) / 100;


	return (
		<>
			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				className="flex items-center justify-center rounded-full bg-blue-500 px-5 py-3 font-bold text-sm text-white hover:bg-blue-700"
				aria-label="Unit Status"
			>
				<i className="fas fa-truck mr-0.5 scale-x-[-1] transform" />
				<p className="pl-1">Status</p>
			</button>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				isWide={false}
			>
				<div className="max-w-7xl p-4">
					<h2 className="mb-8 text-center font-bold text-gray-800 text-xl">
						Unit Availability
					</h2>
					{loading ? (
						<p className="text-center text-gray-600">Loading units...</p>
					) : units.length === 0 ? (
						<p className="text-center text-gray-600">No units available.</p>
					) : (
						<div className="unit-status-content scrollbar-custom max-h-[70vh] overflow-y-auto">
							<ul className="space-y-2">
								{units.map((unit) => {
									const jobCount = unitJobCounts.get(unit.unitID) || 0;
									const isUnavailable = jobCount >= 7;

									return (
										<li
											key={unit.unitID}
											className="flex items-center justify-between text-gray-700"
										>
											<span className="min-w-[200px] font-medium text-base">
												{unit.unitNumber}
											</span>

											<div className="relative mr-16 h-2 w-40 rounded-full bg-gray-300">
												<div
													className="h-full bg-blue-500"
													style={{
														width: `${getProgressPercentage(jobCount)}%`,
													}}
												/>
												<span className="absolute inset-0 flex items-center justify-center font-semibold text-gray-700 text-xs">
													{jobCount}/7
												</span>
											</div>
											{/* <div className="flex min-w-[220px] items-center space-x-6">
											</div> */}

											<span
												className={`flex items-center rounded-full px-2 py-0.5 font-semibold text-sm ${isUnavailable ? "text-red-500" : "text-green-500"
													}`}
											>
												{isUnavailable ? (
													<>
														<i className="fas fa-times-circle mr-1" />{" "}
														Unavailable
													</>
												) : (
													<>
														<i className="fas fa-check-circle mr-1" /> Available
													</>
												)}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</div>
			</Modal>
		</>
	);
};

export default UnitStatus;
