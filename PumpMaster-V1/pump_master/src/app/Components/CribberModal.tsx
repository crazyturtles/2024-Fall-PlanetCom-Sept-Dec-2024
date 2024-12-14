import type React from "react";
import { useEffect, useState } from "react";

interface CribberModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (selectedCribber: string) => void;
}

const CribberModal = ({ isOpen, onClose, onSelect }: CribberModalProps) => {
	const [cribberList, setCribberList] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredCribbers, setFilteredCribbers] = useState<string[]>([]);

	useEffect(() => {
		const fetchCribberData = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					"http://localhost:3001/job/lookup/cribber",
				);
				const data = await response.json();
				const cribbers = data.map((item: any) => item.CribberText);
				setCribberList(cribbers);
				setFilteredCribbers(cribbers);
			} catch (error) {
				console.error("Error fetching cribber data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (isOpen) {
			fetchCribberData();
		}
	}, [isOpen]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (!query.trim()) {
			setFilteredCribbers(cribberList);
			return;
		}

		const filtered = cribberList.filter((cribber) =>
			cribber.toLowerCase().includes(query.toLowerCase()),
		);
		setFilteredCribbers(filtered);
	};

	const handleSelect = (cribber: string) => {
		onSelect(cribber);
		onClose();
	};

	const handleOutsideClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleOutsideKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	const handleDelete = async (CribberText: string, e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent triggering select when clicking delete
		try {
			const response = await fetch(
				`http://localhost:3001/job//delete-cribber/${CribberText}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to delete cribber: ${response.statusText}`);
			}

			const data = await response.json();
			const updatedCribbers = data.map((item: any) => item.CribberText);
			setCribberList(updatedCribbers);
			setFilteredCribbers(updatedCribbers);
		} catch (error) {
			console.error("Error deleting cribber:", error);
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
			onClick={handleOutsideClick}
			onKeyDown={handleOutsideKeyDown}
			aria-modal="true"
			aria-labelledby="modal-title"
			tabIndex={-1}
		>
			<div className="max-h-[70vh] w-96 overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
				<div className="mb-4 flex items-center justify-between">
					<h2 id="modal-title" className="font-semibold text-lg">
						Select Contact
					</h2>
					<div className="relative mx-4 flex-1">
						<i className="fa-solid fa-magnifying-glass -translate-y-1/2 absolute top-1/2 left-3 transform text-gray-400" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="Search..."
							className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 focus:outline-none"
						aria-label="Close modal"
					>
						<i className="fa-solid fa-xmark text-2xl hover:text-red-600" />
					</button>
				</div>
				{loading ? (
					<div className="text-center">Loading...</div>
				) : (
					<ul className="space-y-2">
						{filteredCribbers.map((cribber) => (
							<div key={cribber} className="flex items-center justify-between">
								<li
									className="w-full cursor-pointer rounded-md bg-gray-100 p-2 hover:bg-blue-200"
									onClick={() => handleSelect(cribber)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleSelect(cribber);
										}
									}}
									aria-selected="false"
								>
									{cribber}
								</li>
								<button
									type="button"
									className="ml-2 rounded-full bg-red-500 px-3 py-1 font-bold text-lg text-white hover:bg-red-600"
									onClick={(e) => handleDelete(cribber, e)}
									aria-label={`Delete ${cribber}`}
								>
									<i className="fa-solid fa-trash-can px-2" />
								</button>
							</div>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default CribberModal;
