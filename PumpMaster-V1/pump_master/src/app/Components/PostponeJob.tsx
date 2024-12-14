"use client";

import { useEffect, useState } from "react";

interface PostponeJobProps {
	jobId: number;
	initialDate: Date;
	updateJobStartDate: (jobId: number, newStartDate: Date) => void;
	onClose: () => void;
}

const PostponeJob = ({
	jobId,
	initialDate,
	updateJobStartDate,
	onClose,
}: PostponeJobProps) => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date(initialDate));
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setSelectedDate(initialDate);
	}, [initialDate]);

	const handlePostponeJob = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/postpone`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						JobStartDate: selectedDate?.toISOString(),
						JobStatus: 60,
					}),
				},
			);

			if (!response.ok) throw new Error("Failed to postpone job");

			updateJobStartDate(jobId, selectedDate);
			onClose();
			//alert("Job postponed successfully!");
		} catch (error) {
			console.error("Error postponing job:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2 className="font-semibold text-lg">Postpone Job</h2>
			<p className="text-gray-600">
				Current Date: {initialDate.toISOString().split("T")[0]}
			</p>
			<div className="mt-4">
				<label htmlFor="newDate" className="mb-2 block font-medium text-sm">
					Select New Date:
				</label>
				<input
					id="newDate"
					type="date"
					className="w-full rounded border p-2"
					value={selectedDate.toISOString().split("T")[0]}
					onChange={(e) => setSelectedDate(new Date(e.target.value))}
				/>

				<p className="mt-2 text-gray-600">
					Postpone to: {selectedDate?.toISOString().split("T")[0]}
				</p>
			</div>
			<div className="mt-4 flex justify-end">
				<button
					className="rounded bg-blue-500 px-4 py-2 text-white"
					onClick={handlePostponeJob}
					disabled={loading}
					type="button"
				>
					{loading ? "Postponing..." : "Postpone"}
				</button>
			</div>
		</div>
	);
};

export default PostponeJob;
