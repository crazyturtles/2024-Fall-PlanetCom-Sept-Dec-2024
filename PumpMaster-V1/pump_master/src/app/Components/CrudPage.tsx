"use client";

import CRUDList from "@/app/Components/CRUDList";
import CRUDForm from "@/app/Components/CrudForm";
import { useEffect, useState } from "react";

import "../../../public/css/styles.css";

interface CRUDPageProps<T> {
	entityName: string;
	entityTable: string;
	getDisplayName: string;
	fetchLink: string;
	fields: Array<{
		name: string;
		label: string;
		value: string;
		columnName: string;
		required?: boolean;
		type?: string;
		sign?: string;
		selectItems?: Array<{ [key: string]: string }>;
		radioItems?: Array<{ [key: string]: string }>; // Added this line
		pattern?: string;
		foreignEntity?: {
			entityName: string;
			display: string;
			url: string;
		};
	}>;
	defaultRates: Array<string>;
	showFilter?: boolean;
}

const CrudPage = <T extends { id: number; name: string }>({
	entityName,
	entityTable,
	getDisplayName,
	fetchLink,
	fields,
	defaultRates = Array<string>(),
	showFilter = true,
}: CRUDPageProps<T>) => {
	const [selectedID, setSelectedId] = useState(0);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleRefresh = () => {
		setRefreshTrigger((prev) => {
			return prev + 1;
		});
	};

	useEffect(() => {}, [refreshTrigger]);

	return (
		<div className="flex justify-center bg-white">
			<div className="crud-container w-full max-w-screen-lg">
				<div className="flex rounded-lg bg-white">
					<div className="flex w-1/2 justify-center">
						<div className="w-11/12">
							<CRUDList<T>
								entityTable={entityTable}
								onEdit={setSelectedId}
								display={getDisplayName}
								entityName={entityName}
								fetchLink={fetchLink}
								showFilter={showFilter}
								refreshTrigger={refreshTrigger}
							/>
						</div>
					</div>

					<div className="flex w-1/2 justify-center">
						<CRUDForm
							entityName={entityName}
							selectedID={selectedID}
							fields={fields}
							fetchLink={fetchLink}
							defaultRates={defaultRates}
							onSuccess={handleRefresh}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CrudPage;
