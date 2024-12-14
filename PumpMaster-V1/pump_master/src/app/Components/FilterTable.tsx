"use client";

import { useState } from "react";
import "../../../public/css/filters.css";

const Filter = ({
	filterStatus,
	onFilterChange,
	entityName,
	onSearch = (query: string) => {},
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value;
		setSearchQuery(newQuery);
		onSearch(newQuery);
	};

	return (
		<div className="filter">
			<div className="flex flex-row items-center gap-2">
				<div className="flex flex-row">
					<button
						type="button"
						className={`${
							filterStatus === 2
								? "bg-blue-600 font-semibold text-white"
								: "bg-white hover:bg-gray-200"
						}`}
						onClick={() => onFilterChange(2)}
					>
						All
					</button>
					<button
						type="button"
						className={`${
							filterStatus === 1
								? "bg-green-600 font-semibold text-white"
								: "bg-white hover:bg-gray-200"
						}`}
						onClick={() => onFilterChange(1)}
					>
						Active
					</button>
					<button
						type="button"
						className={`${
							filterStatus === 0
								? "bg-red-600 font-semibold text-white"
								: "bg-white hover:bg-gray-200"
						}`}
						onClick={() => onFilterChange(0)}
					>
						Inactive
					</button>
				</div>
				<div className="relative w-full">
					<i className="fa-solid fa-magnifying-glass -translate-y-1/2 absolute top-1/2 left-3 transform text-gray-400" />
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Search..."
						className="w-full rounded-lg border border-gray-300 px-10 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
		</div>
	);
};

export default Filter;
