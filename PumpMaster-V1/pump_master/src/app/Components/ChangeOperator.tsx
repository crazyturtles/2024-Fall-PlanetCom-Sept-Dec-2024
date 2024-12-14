"use client";

import { useEffect, useState } from "react";

interface ChangeOperatorProps {
	jobId: number;
	currentDriverID: number | null;
	updateJobOperator: (jobId: number, newOperatorName: string) => void;
	onClose: () => void;
}

const ChangeOperator = ({
	jobId,
	currentDriverID,
	updateJobOperator,
	onClose,
}: ChangeOperatorProps) => {
	const [operators, setOperators] = useState<{ id: number; name: string }[]>(
		[],
	);
	const [currentOperator, setCurrentOperator] = useState<string>(
		"No operator assigned",
	);
	const [selectedOperator, setSelectedOperator] = useState<number | null>(null);
	const [loadingOperators, setLoadingOperators] = useState(false);

	useEffect(() => {
		const fetchOperators = async () => {
			try {
				setLoadingOperators(true);
				const response = await fetch("http://localhost:3001/job/operators");
				if (!response.ok) throw new Error("Failed to fetch operators");
				const operatorsData = await response.json();
				setOperators(operatorsData);

				const currentOperatorName =
					operatorsData.find((op) => op.id === currentDriverID)?.name ||
					"No operator assigned";
				setCurrentOperator(currentOperatorName);
			} catch (error) {
				console.error("Error fetching operators:", error);
			} finally {
				setLoadingOperators(false);
			}
		};

		fetchOperators();
	}, [currentDriverID]);

	const handleAssignOperator = async () => {
		if (!jobId || selectedOperator === null) return;

		try {
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/assign-operator`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ operatorId: selectedOperator }),
				},
			);

			if (!response.ok) throw new Error("Failed to assign operator");

			const selectedOperatorName =
				operators.find((op) => op.id === selectedOperator)?.name ||
				"Unknown Operator";
			updateJobOperator(jobId, selectedOperatorName);
			if (onClose) onClose();
		} catch (error) {
			console.error("Error assigning operator:", error);
			alert("Failed to assign operator.");
		}
	};

	const selectId = "operator-select";

	return (
		<div>
			<h2 className="font-semibold text-lg">Change Operator</h2>
			<p>Current Operator: {currentOperator}</p>
			<div className="mt-4">
				<label htmlFor={selectId} className="mb-2 block font-medium text-sm">
					Select Operator:
				</label>
				{loadingOperators ? (
					<p>Loading operators...</p>
				) : (
					<select
						id={selectId}
						className="w-full rounded border p-2"
						value={selectedOperator || ""}
						onChange={(e) => setSelectedOperator(Number(e.target.value))}
					>
						<option value="">-- Select an Operator --</option>
						{operators.map((operator) => (
							<option key={operator.id} value={operator.id}>
								{operator.name}
							</option>
						))}
					</select>
				)}
			</div>
			<div className="mt-4 flex justify-end">
				<button
					className="rounded bg-blue-500 px-4 py-2 text-white"
					onClick={handleAssignOperator}
					disabled={!selectedOperator}
					type="button"
				>
					Assign
				</button>
			</div>
		</div>
	);
};

export default ChangeOperator;
