import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UseCustomerSelectReturn {
	isModalOpen: boolean;
	selectedCustomerId: string | null;
	selectedCustomerName: string | null;
	showReport: boolean;
	handleModalClose: () => void;
	handleCustomerSelect: (customerId: string, customerName: string) => void;
	showUnitSearch: boolean;
}

export function useCustomerSelect(
	requiresCustomer = false,
	showUnitSearch = false,
): UseCustomerSelectReturn {
	const [isModalOpen, setIsModalOpen] = useState(requiresCustomer);
	const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
		null,
	);
	const [selectedCustomerName, setSelectedCustomerName] = useState<
		string | null
	>(null);
	const [showReport, setShowReport] = useState(!requiresCustomer);
	const router = useRouter();

	const handleModalClose = useCallback(() => {
		setIsModalOpen(false);
		router.push("/");
	}, [router]);

	const handleCustomerSelect = useCallback(
		(customerId: string, customerName: string) => {
			setSelectedCustomerId(customerId);
			setSelectedCustomerName(customerName);
			setIsModalOpen(false);
			setShowReport(true);
		},
		[],
	);

	return {
		isModalOpen,
		selectedCustomerId,
		selectedCustomerName,
		showReport,
		handleModalClose,
		handleCustomerSelect,
		showUnitSearch,
	};
}
