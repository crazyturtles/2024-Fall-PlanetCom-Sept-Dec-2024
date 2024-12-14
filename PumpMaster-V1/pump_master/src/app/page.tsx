"use client";

import { useEffect, useState } from "react";
import JobBoard from "./Components/JobBoard";
import "../../public/css/styles.css";
import AnimatedConstruction from "./Components/AnimatedConstruction";
import JobForm from "./Components/JobForm";
import Modal from "./Components/Modal";

export default function Home() {
	const [jobID, setJobID] = useState<number | null>(null);
	const [showJobForm, setShowJobForm] = useState(false);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchPermissionLevel = async () => {
		try {
			const response = await fetch("http://localhost:3001/auth/permission", {
				method: "GET",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Failed to fetch permission level");
			}
			const data = await response.json();
			if (data.permissionLevel >= 3) {
				setIsAuthorized(true);
			}
		} catch (error) {
			console.error("Error fetching permission level:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPermissionLevel();
	}, []);

	const openJobForm = (jobId: number) => {
		setJobID(jobId);
		setShowJobForm(true);
	};

	const closeJobForm = () => {
		setShowJobForm(false);
		setJobID(null);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col bg-white font-sans">
			<div>
				<main className="main-content-container">
					{isAuthorized ? (
						<JobBoard onOpenForm={openJobForm} />
					) : (
						<AnimatedConstruction />
					)}
				</main>

				<Modal isOpen={showJobForm} onClose={closeJobForm}>
					{showJobForm && jobID !== null && (
						<JobForm jobId={jobID} onClose={closeJobForm} />
					)}
				</Modal>
			</div>
		</div>
	);
}
