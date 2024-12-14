"use client";
import JobForm from "@/app/Components/JobForm";
import Modal from "@/app/Components/Modal";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavBar from "./NavBar";

interface PumpMasterLayoutProps {
	children: React.ReactNode;
}

export default function PumpMasterLayout({ children }: PumpMasterLayoutProps) {
	const [jobID, setJobID] = useState<number | null>(null);
	const [showJobForm, setShowJobForm] = useState(false);
	const pathname = usePathname();

	const openJobForm = (jobId: number) => {
		setJobID(jobId);
		setShowJobForm(true);
	};

	const closeJobForm = () => {
		setShowJobForm(false);
		setJobID(null);
	};

	return (
		<>
			{pathname !== "/login" && (
				<NavBar openJobForm={() => openJobForm(0)} OnAdd={() => {}} />
			)}
			{children}
			<footer className="flex items-center justify-center bg-white p-4 text-gray-600 text-xs">
				<p>
					© 2024 PumpMasterV3. Developed for 1st Call Concrete Pumping Ltd. by
					PlanetCom Inc. All rights reserved.
				</p>
			</footer>
			<Modal isOpen={showJobForm} onClose={closeJobForm}>
				{showJobForm && jobID !== null && (
					<JobForm jobId={jobID} onClose={closeJobForm} />
				)}
			</Modal>
		</>
	);
}
