import { ModalForm } from "@/app/Components/ReportsComponents/ReportsModalComponents/ModalForm";
import type { FormField } from "@/app/Components/ReportsComponents/ReportsModalComponents/modalTypes";
import { useEffect, useState } from "react";
import Modal from "../Modal";

interface CustomerSelectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (customerId: string, customerName: string) => void;
	showUnitSearch?: boolean;
}

interface Customer {
	CustomerID: string;
	CustomerName: string;
}

export default function CustomerSelectModal({
	isOpen,
	onClose,
	onSelect,
	showUnitSearch = false,
}: CustomerSelectModalProps) {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [showCountModal, setShowCountModal] = useState(false);
	const [recordCount, setRecordCount] = useState<number | null>(null);
	const [isCountLoading, setIsCountLoading] = useState(false);

	useEffect(() => {
		const fetchCustomers = async () => {
			if (!isOpen) return;
			try {
				setIsLoading(true);
				const response = await fetch("/api/reports/customers");
				if (!response.ok)
					throw new Error(`Failed to fetch customers: ${response.status}`);

				const data = await response.json();
				setCustomers(data.filter((c: any) => c?.CustomerID && c?.CustomerName));
			} catch (err) {
				setError("Failed to load customers");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCustomers();
	}, [isOpen]);

	useEffect(() => {
		if (showUnitSearch && searchTerm) {
			localStorage.setItem("unitSearchTerm", searchTerm);
		}
	}, [searchTerm, showUnitSearch]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedCustomerId) return;

		const selectedCustomer = customers.find(
			(c) => c.CustomerID.toString() === selectedCustomerId.toString(),
		);

		if (selectedCustomer) {
			if (!searchTerm) {
				localStorage.removeItem("unitSearchTerm");
			}
			onSelect(
				selectedCustomer.CustomerID.toString(),
				selectedCustomer.CustomerName,
			);
		}
	};

	const handleClose = () => {
		if (!searchTerm) {
			localStorage.removeItem("unitSearchTerm");
		}
		onClose();
	};

	const handleCount = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!selectedCustomerId) return;

		try {
			setIsCountLoading(true);
			const response = await fetch(
				`/api/reports/job-history?customerId=${selectedCustomerId}&unitSent=${searchTerm || ""}`,
			);

			if (response.ok) {
				const data = await response.json();
				setRecordCount(data.length);
				setShowCountModal(true);
			}
		} catch (err) {
			setError("Failed to fetch count");
		} finally {
			setIsCountLoading(false);
		}
	};

	const sortedCustomers = customers.sort((a, b) => {
		const [aFirst = "", aLast = ""] = a.CustomerName.split(" ");
		const [bFirst = "", bLast = ""] = b.CustomerName.split(" ");
		return aFirst.localeCompare(bFirst) || aLast.localeCompare(bLast);
	});

	// Base fields that are always included
	const baseFields: FormField[] = [
		{
			id: "customer-select",
			label: "Customer",
			type: "select",
			value: selectedCustomerId,
			onChange: setSelectedCustomerId,
			options: sortedCustomers.map((customer) => ({
				value: customer.CustomerID.toString(),
				label: customer.CustomerName,
			})),
			disabled: isLoading || customers.length === 0,
		},
	];

	// Only add unit search field if showUnitSearch is true
	const fields: FormField[] = showUnitSearch
		? [
				{
					id: "unit-search",
					label: "Search by Unit Sent",
					type: "text",
					value: searchTerm,
					onChange: setSearchTerm,
					disabled: isLoading,
				},
				...baseFields,
			]
		: baseFields;

	return (
		<>
			<ModalForm
				isOpen={isOpen}
				onClose={handleClose}
				title="Select Customer"
				fields={fields}
				onSubmit={handleSubmit}
				isSubmitDisabled={!selectedCustomerId || isLoading}
				submitLabel={isLoading ? "Loading..." : "Preview Report"}
				size="md"
				extraButtons={
					showUnitSearch ? (
						<button
							type="button"
							onClick={handleCount}
							disabled={!selectedCustomerId || isCountLoading}
							className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:bg-gray-400"
						>
							{isCountLoading ? "Loading..." : "Count"}
						</button>
					) : undefined
				}
			/>

			<Modal isOpen={showCountModal} onClose={() => setShowCountModal(false)}>
				<div className="w-96 bg-white p-6">
					<h2 className="mb-4 font-semibold text-gray-900 text-lg">
						Record Count
					</h2>
					<p className="text-gray-900">This will return {recordCount} rows.</p>
					<div className="mt-4 flex justify-end">
						<button
							type="button"
							onClick={() => setShowCountModal(false)}
							className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						>
							Close
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
