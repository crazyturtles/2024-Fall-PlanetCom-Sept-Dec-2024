"use client";

import Filter from "@/app/Components/FilterTable";
import { useEffect, useState } from "react";
import "../../../public/css/lists.css";

interface CRUDListProps<T> {
	onEdit: (id: number) => void;
	entityName: string;
	entityTable: string;
	fetchLink: string;
	display: string;
	showFilter?: boolean;
	refreshTrigger?: number;
}

const CRUDList = <T extends { id: string | number; name: string }>({
	onEdit,
	entityName,
	entityTable,
	fetchLink,
	display,
	showFilter = true,
	refreshTrigger,
}: CRUDListProps<T>) => {
	const [items, setItems] = useState([]);
	const [filterStatus, setFilterStatus] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);

	const populateList = async () => {
		try {
			const res = await fetch(
				`http://localhost:3001/${fetchLink}/0?` +
					`${new URLSearchParams({
						fields: `${entityTable}ID, ${display} ${
							entityTable !== "JobType" ? "," + entityTable + "Status" : ""
						}`,
					})}`,
				{
					method: "GET",
				},
			);
			const json_data = await res.json();
			const data = Object.keys(json_data).length === 0 ? [] : json_data;
			setItems(data);
			setFilteredItems(data);
		} catch (err) {
			console.error("Error fetching data:", err);
			setItems([]);
			setFilteredItems([]);
		}
	};

	useEffect(() => {
		populateList();
	}, [filterStatus, refreshTrigger]);

	const getItemId = (item: any) => {
		const idKey = `${entityTable}ID`;
		return item[idKey] || item.id || Object.values(item)[0];
	};

	const getItemStatus = (item: any) => {
		const statusKey = `${entityTable}Status`;
		return item[statusKey] !== undefined
			? item[statusKey]
			: Object.values(item)[2];
	};

	const getItemDisplay = (item: any) => {
		return item[display] || Object.values(item)[1];
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (!query.trim()) {
			setFilteredItems(items);
			return;
		}

		const filtered = items.filter((item) => {
			const displayValue = getItemDisplay(item).toString().toLowerCase();
			return displayValue.includes(query.toLowerCase());
		});

		setFilteredItems(filtered);
	};

	return (
		<div className="list">
			{entityTable === "JobType" ? (
				<div
					className="list-header"
					style={{
						display: "grid",
						gridTemplateColumns: "auto 300px",
						alignItems: "center",
					}}
				>
					<h2 className="font-semibold text-2xl">{entityName}</h2>
					<div className="relative">
						<i className="fa-solid fa-magnifying-glass -translate-y-1/2 absolute top-1/2 left-3 transform text-gray-400" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="Search..."
							className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>
			) : (
				<div className="list-header">
					<h2 className="font-semibold text-2xl">{entityName}</h2>
					<Filter
						filterStatus={filterStatus}
						onFilterChange={setFilterStatus}
						entityName={entityName}
						onSearch={handleSearch}
					/>
				</div>
			)}

			{!filteredItems || filteredItems.length === 0 ? (
				<p>No {entityName} available.</p>
			) : (
				<div className="list-container">
					<ul>
						{filteredItems
							.filter(
								(item) =>
									entityTable === "JobType" ||
									filterStatus === 2 ||
									getItemStatus(item) === filterStatus,
							)
							.sort((a, b) =>
								getItemDisplay(a)
									.toString()
									.localeCompare(getItemDisplay(b).toString()),
							)
							.map((item, index) => (
								<li
									key={index}
									className="list-item"
									onClick={() => onEdit(Number(item[`${entityTable}ID`]))}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											onEdit(Number(item[`${entityTable}ID`]));
										}
									}}
								>
									<div>
										<p>{getItemDisplay(item)}</p>
									</div>
								</li>
							))}
					</ul>
				</div>
			)}

			<div className="list-footer">
				<button
					type="button"
					onClick={() => onEdit(0)}
					className="list-button bg-green-600"
				>
					Add New {entityName}
				</button>
			</div>
		</div>
	);
};

export default CRUDList;
