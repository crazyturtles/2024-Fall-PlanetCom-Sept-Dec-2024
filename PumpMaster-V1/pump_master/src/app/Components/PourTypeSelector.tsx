import { useCallback, useEffect, useState } from "react";

interface PourType {
	PourTypeID: number;
	PourTypeName: string;
}

interface PourTypeSelectorProps {
	jobId: number;
	onSelectedChange: (selectedTypes: PourType[]) => void;
}

interface JobFormProps {
	jobId: number;
	onClose: () => void;
	initialData?: any;
}

const PourTypeSelector: React.FC<PourTypeSelectorProps> = ({
	jobId,
	onSelectedChange,
}) => {
	const [pourTypes, setPourTypes] = useState<PourType[]>([]);
	const [selectedPourType, setSelectedPourType] = useState<PourType[]>([]);
	const [initialJobId] = useState(jobId);

	const fetchPourTypes = useCallback(async () => {
		try {
			const response = await fetch(
				`http://localhost:3001/job/dropdown/pourtypes/${jobId}`,
			);
			const data = await response.json();

			const fetchedPourTypes = data.pourTypes || [];
			const fetchedSelectedPourTypes = data.selectedPourTypes || [];

			if (pourTypes.length === 0) {
				setPourTypes(fetchedPourTypes);
			}

			if (selectedPourType.length === 0) {
				setSelectedPourType(fetchedSelectedPourTypes);
			}
		} catch (error) {
			console.error("Error fetching pour types:", error);
		}
	}, [jobId]);

	const fetchInitialPourTypes = useCallback(async () => {
		try {
			const response = await fetch(
				`http://localhost:3001/job/dropdown/pourtypes/${initialJobId}`,
			);
			const data = await response.json();

			const fetchedPourTypes = data.pourTypes || [];
			const fetchedSelectedPourTypes = data.selectedPourTypes || [];

			if (pourTypes.length === 0) {
				setPourTypes(fetchedPourTypes);
			}

			if (selectedPourType.length === 0) {
				setSelectedPourType(fetchedSelectedPourTypes);
			}
		} catch (error) {
			console.error("Error fetching pour types:", error);
		}
	}, [initialJobId]);

	useEffect(() => {
		fetchPourTypes();
	}, [fetchPourTypes]);

	useEffect(() => {
		if (selectedPourType.length > 0) {
			onSelectedChange(selectedPourType);
		}
	}, [selectedPourType, onSelectedChange]);

	const handleCheckboxChange = (pourType: PourType) => {
		setSelectedPourType((prevSelectedPourTypes) => {
			const isSelected = prevSelectedPourTypes.some(
				(pt) => pt.PourTypeID === pourType.PourTypeID,
			);
			const newSelectedPourTypes = isSelected
				? prevSelectedPourTypes.filter(
						(pt) => pt.PourTypeID !== pourType.PourTypeID,
					)
				: [...prevSelectedPourTypes, pourType];

			return newSelectedPourTypes;
		});
	};

	const handleRemoveSelected = (pourTypeID: number) => {
		setSelectedPourType((prevSelectedPourTypes) => {
			const newSelectedPourTypes = prevSelectedPourTypes.filter(
				(pt) => pt.PourTypeID !== pourTypeID,
			);
			return newSelectedPourTypes;
		});
	};

	return (
		<div className="rounded bg-gray-100 p-4">
			<h3 className="mb-2 font-semibold">Select Pour Types:</h3>

			<div className="max-h-48 overflow-y-auto rounded border p-2">
				{pourTypes.length === 0 ? (
					<p>No pour types available.</p>
				) : (
					pourTypes.map((pourType) => (
						<label key={pourType.PourTypeID} className="mb-1 flex items-center">
							<input
								type="checkbox"
								checked={selectedPourType.some(
									(pt) => pt.PourTypeID === pourType.PourTypeID,
								)}
								onChange={() => handleCheckboxChange(pourType)}
								className="mr-2 accent-blue-500"
							/>
							{pourType.PourTypeName}
						</label>
					))
				)}
			</div>

			{selectedPourType.length > 0 ? (
				<div className="mt-4">
					<h4 className="mb-2 font-semibold">Selected Pour Types:</h4>
					<div className="flex flex-wrap gap-2">
						{selectedPourType.map((pourType) => (
							<div
								key={pourType.PourTypeID}
								className="flex cursor-pointer items-center rounded-full bg-blue-200 px-3 font-semibold text-blue-800 hover:bg-blue-300"
								onClick={() => handleRemoveSelected(pourType.PourTypeID)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handleRemoveSelected(pourType.PourTypeID);
									}
								}}
							>
								{pourType.PourTypeName}
								<i className="fa-solid fa-circle-xmark pl-1 text-sm " />
							</div>
						))}
					</div>
				</div>
			) : (
				<p className="mt-2 text-gray-500">
					No pour types selected for this job.
				</p>
			)}
		</div>
	);
};

export default PourTypeSelector;
