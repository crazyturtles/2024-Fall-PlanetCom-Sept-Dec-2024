import { useEffect, useRef, useState } from "react";
import "../../../public/css/jobs.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MessageModal from "@/app/Components/MessageModal";
import React from "react";
import ContextMenu from "./ContextMenu";
import Modal from "./Modal";

interface JobTableProps {
	onEdit: (id: number) => void;
	entityTable: string;
	fetchLink: string;
	filterDate: Date | null;
	jobs: Job[];
}

interface Job {
	JobID: number;
	JobCompanyJobNum: string;
	JobStatus: number;
	JobStartTime: string;
	JobPumpTypeID: number;
	JobUnitID: number;
	JobDriverID: number;
	JobTypeID: number;
	JobCustomerID: number;
	JobSiteAddress: string;
	JobSiteArea: string;
	JobSitePhone: string;
	CustomerCompanyName: string;
	SupplierCompanyName: string;
	PourTypes?: string[];
	DriverName: string;
	UnitNumber: string;
	PumpTypeName: string;
	JobTotalPoured: number;
	JobColor: string;
	JobStatusDateTime?: string | null;
	SupplierConfirmed: boolean;
	CustomerConfirmed: boolean;
	IsTextMessageSent: boolean;
}

interface PourType {
	JobID: number;
	PourTypeName: string;
}

const formatTime = (dateTime: string) => {
	const date = new Date(dateTime);
	const hours = date.getUTCHours().toString().padStart(2, "0");
	const minutes = date.getUTCMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};

const getJobStatusDetails = (status: number, jobColor: string | null) => {
	switch (status) {
		case 0:
			return {
				label: "Pending",
				icon: "fas fa-hourglass-start",
				color: "#CCFDCC",
			};
		case 10:
			return {
				label: "Confirmed",
				icon: "fas fa-check-circle",
				color: jobColor,
			};
		case 20:
			return {
				label: "Scheduled",
				icon: "fas fa-calendar-check",
				color: jobColor,
				// #FDFD96
			};
		case 25:
			return {
				label: "Operator Confirmed",
				icon: "fas fa-user-check",
				color:
					"linear-gradient(-90deg, #F3CCFF, #F9E4FF, #F9E4FF, #F9E4FF, #FFFFFF)",
			};
		case 30:
			return {
				label: "Washing",
				icon: "fas fa-hands-wash",
				color:
					"linear-gradient(90deg, #A3CFFF, #D0EFFF, #D0EFFF, #D0EFFF, #FFF)",
			};
		case 40:
			return {
				label: "Complete",
				icon: "fas fa-flag-checkered",
				color: "linear-gradient(-90deg, #3eb489, #90EE90)",
			};
		case 60:
			return {
				label: "Postponed",
				icon: "fas fa-calendar-times",
				color: "#F8D7DA",
			};
		case 70:
			return {
				label: "Cancelled",
				icon: "fas fa-ban",
				color: "#E57373",
			};
		case 80:
			return {
				label: "Ready For Invoicing",
				icon: "fas fa-file-invoice",
				color: "#F4C2C2)",
			};
		case 90:
			return {
				label: "Invoiced",
				icon: "fas fa-dollar",
				color: "#D8D9D9",
			};
		case 100:
			return {
				label: "Not For Invoicing",
				icon: "fas fa-file-excel",
				color: "#F5F5F5",
			};
		default:
			return {
				label: "Unknown",
				icon: "fas fa-question-circle",
				color: "#E2E3E5",
			};
	}
};

const JobTable = ({ onEdit, fetchLink, filterDate }: JobTableProps) => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState(false);
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);
	const tableRef = useRef<HTMLDivElement>(null);
	const [modalContent, setModalContent] = useState<React.ReactNode | null>(
		null,
	);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
	const [selectedJobDriverID, setSelectedJobDriverID] = useState<number | null>(
		null,
	);

	const fetchJobs = async () => {
		if (!filterDate) return;
		setJobs([]);
		setLoading(true);

		const dateString = filterDate.toISOString().split("T")[0];
		const url = `http://localhost:3001/${fetchLink}?date=${dateString}`;

		try {
			const res = await fetch(url);
			const { jobs, pourTypes } = await res.json();

			const jobsWithPourTypes = jobs.map((job: Job) => {
				const relatedPourTypes = pourTypes
					.filter((pt: PourType) => pt.JobID === job.JobID)
					.map((pt) => pt.PourTypeName);
				return { ...job, PourTypes: relatedPourTypes };
			});

			setJobs(jobsWithPourTypes);
		} catch (error) {
			console.error("Error fetching jobs:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs();
	}, [filterDate]);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const openModal = (content: React.ReactNode) => {
		setModalContent(
			React.cloneElement(content as React.ReactElement<any>, {
				onClose: closeModal,
			}),
		);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalContent(null);
	};

	const closeContextMenu = () => {
		setContextMenuPosition(null);
	};

	const handleRowClick = (uniqueKey: string) => {
		setSelectedJobKey(uniqueKey === selectedJobKey ? null : uniqueKey);
		closeContextMenu();
	};

	const handleRowDoubleClick = (jobId: number) => {
		onEdit(jobId);
	};

	const handleRowRightClick = (event: React.MouseEvent, uniqueKey: string) => {
		event.preventDefault();
		setSelectedJobKey(uniqueKey);
		setContextMenuPosition({ x: event.clientX, y: event.clientY });
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
			setSelectedJobKey(null);
			closeContextMenu();
		}
	};

	const updateJobOperator = (jobId: number, newOperatorName: string) => {
		setJobs((prevJobs) =>
			prevJobs.map((job) =>
				job.JobID === jobId ? { ...job, DriverName: newOperatorName } : job,
			),
		);
	};

	const updateJobStartDate = (jobId: number, newStartDate: Date | null) => {
		if (!newStartDate) return;

		const newStartDateStr = newStartDate.toISOString().split("T")[0];
		const filterDateStr = filterDate?.toISOString().split("T")[0];

		setJobs((prevJobs) => {
			const updatedJobs = prevJobs.map((job) =>
				job.JobID === jobId
					? { ...job, JobStartTime: newStartDate.toISOString(), JobStatus: 60 }
					: job,
			);

			if (newStartDateStr !== filterDateStr) {
				return updatedJobs.filter((job) => job.JobID !== jobId);
			}

			return updatedJobs;
		});
	};

	const handleReset = async (jobId: number) => {
		try {
			console.log("handleReset called for JobID:", jobId);
			const response = await fetch(`http://localhost:3001/job/${jobId}/reset`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: 0,
				}),
			});

			console.log("Payload sent to server:", { status: 0 });
			if (!response.ok) {
				throw new Error(`Failed to update job status: ${response.statusText}`);
			}
			const data = await response.json();
			console.log("Response from server:", data);

			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.JobID === jobId
						? {
							...job,
							JobStatus: 0,
						}
						: job,
				),
			);
		} catch (error) {
			console.error("Error resetting job status:", error);
		}
	};

	const handleWashing = async (jobId: number) => {
		try {
			console.log("handleWashing called for JobID:", jobId);
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/washing`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						status: 30,
					}),
				},
			);

			console.log("Payload sent to server:", { status: 30 });
			if (!response.ok) {
				throw new Error(`Failed to update job status: ${response.statusText}`);
			}
			const data = await response.json();
			console.log("Response from server:", data);

			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.JobID === jobId
						? {
							...job,
							JobStatus: 30,
							JobStatusDateTime: new Date().toISOString(),
						}
						: job,
				),
			);
		} catch (error) {
			console.error("Error updating job status:", error);
		}
	};

	const handleComplete = async (jobId: number) => {
		try {
			console.log("handleComplete called for JobID:", jobId);
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/complete`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						status: 40,
					}),
				},
			);

			console.log("Payload sent to server:", { status: 40 });
			if (!response.ok) {
				throw new Error(`Failed to update job status: ${response.statusText}`);
			}
			const data = await response.json();
			console.log("Response from server:", data);

			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.JobID === jobId
						? {
							...job,
							JobStatus: 40,
							JobStatusDateTime: new Date().toISOString(),
						}
						: job,
				),
			);
		} catch (error) {
			console.error("Error updating job status to complete:", error);
		}
	};

	const handleCancel = async (jobId: number) => {
		if (!jobId) return;

		const userConfirmed = confirm("Are you sure you'd like to cancel the job?");
		if (!userConfirmed) return;

		try {
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/cancel`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (!response.ok) throw new Error("Failed to cancel job");

			const data = await response.json();
			console.log("Cancel response:", data);
			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.JobID === jobId
						? {
							...job,
							JobStatus: 70,
							JobStatusDateTime: new Date().toISOString(),
						}
						: job,
				),
			);
		} catch (error) {
			console.error("Error cancelling job:", error);
			alert("Failed to cancel the job.");
		}
	};

	const handleConfirm = async (
		type: "Supplier" | "Customer",
		jobId: number,
	) => {
		if (!jobId) {
			alert("No job selected.");
			return;
		}

		const endpoint =
			type === "Supplier" ? "confirm-supplier" : "confirm-customer";

		try {
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/${endpoint}`,
				{ method: "PATCH" },
			);

			if (response.ok) {
				const message = `${type} confirmed successfully.`;
				alert(message);

				setJobs((prevJobs) =>
					prevJobs.map((job) =>
						job.JobID === jobId
							? {
								...job,
								[`${type}Confirmed`]: true,
							}
							: job,
					),
				);
			} else {
				const error = await response.json();
				alert(error.message);
			}
		} catch (err) {
			console.error(`Error confirming ${type}:`, err);
			alert(`Failed to confirm ${type.toLowerCase()}.`);
		}
	};

	const handleOperatorConfirm = async (jobId: number) => {
		try {
			console.log("handleOperatorConfirm called for JobID:", jobId);
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/operator-confirm`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to update job status: ${response.statusText}`);
			}
			const data = await response.json();
			console.log("Response from server:", data);

			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.JobID === jobId
						? {
							...job,
							JobStatus: 25,
							JobStatusDateTime: new Date().toISOString(),
						}
						: job,
				),
			);
		} catch (error) {
			console.error("Error confirming operator:", error);
		}
	};

	const handleJobConfirm = async (jobId: number) => {
		if (!jobId) return;

		try {
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/confirm-job`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to confirm job: ${response.statusText}`);
			}

			const data: { JobID: number; JobColor: string } = await response.json();

			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.JobID === jobId
						? {
							...job,
							JobStatus: 10,
							JobColor: data.JobColor,
							JobStatusDateTime: new Date().toISOString(),
						}
						: job,
				),
			);
		} catch (error) {
			console.error("Error confirming job:", error);
		}
	};

	const updateJobUnit = (jobId: number, newUnitNumber: string) => {
		setJobs((prevJobs) =>
			prevJobs.map((job) =>
				job.JobID === jobId
					? { ...job, UnitNumber: newUnitNumber, JobStatus: 20 }
					: job,
			),
		);
	};

	const handleSendMessage = (jobDriverID: number | null) => {
		if (!jobDriverID) {
			console.error("DriverID or JobID are missing!");
			return;
		}

		console.log("Opening MessageModal for DriverID:", jobDriverID);
		setSelectedJobDriverID(jobDriverID);
		setIsMessageModalOpen(true);
	};

	const handleMessageSent = async (jobId, status) => {
		console.log(
			"handleMessageSent called with JobID:",
			jobId,
			"Status:",
			status,
		);

		try {
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/update-message-status`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ isTextMessageSent: status }),
				},
			);

			if (!response.ok) {
				throw new Error(
					`Failed to update message status: ${response.statusText}`,
				);
			}

			console.log("Message status updated successfully");
			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.JobID === jobId ? { ...job, IsTextMessageSent: status } : job,
				),
			);
		} catch (error) {
			console.error("Error updating message status:", error);
		}
	};

	const handleMessageStatusChange = (
		jobId: number,
		isTextMessageSent: boolean,
	) => {
		// Update the `jobs` state in JobTable
		setJobs((prevJobs) =>
			prevJobs.map((job) =>
				job.JobID === jobId
					? { ...job, IsTextMessageSent: isTextMessageSent }
					: job,
			),
		);
	};

	return (
		<div className="table-container text-black" ref={tableRef}>
			<table className="job-table">
				<thead>
					<tr>
						<th>Ticket</th>
						<th>Status</th>
						<th className="w-3">Time</th>
						<th>Pump</th>
						<th>Unit</th>
						<th>Operator</th>
						<th>Use</th>
						<th>Customer</th>
						<th>Site, Area</th>
						<th>Pour</th>
						<th>Supplier</th>
						<th>Site Contact</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan={12} className="text-center">
								Loading jobs...
							</td>
						</tr>
					) : jobs.length === 0 ? (
						<tr>
							<td colSpan={12} className="text-center">
								No jobs found for this date.
							</td>
						</tr>
					) : (
						jobs.map((job, index) => {
							const { label, icon, color } = getJobStatusDetails(
								job.JobStatus,
								job.JobColor,
							);

							const uniqueKey = `${job.JobID}-${index}`;
							const isSelected = selectedJobKey === uniqueKey;

							const rowStyle = {
								cursor: "pointer",
								background: color || "transparent", // Default to transparent if color is null
							};


							const formattedTime =
								job.JobStatus !== 10 &&
								job.JobStatusDateTime &&
								new Date(job.JobStatusDateTime).toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								});

							return (
								// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
								<tr
									key={uniqueKey}
									onClick={() => handleRowClick(uniqueKey)}
									onDoubleClick={() => handleRowDoubleClick(job.JobID)}
									onContextMenu={(e) => handleRowRightClick(e, uniqueKey)}
									className={`job-row ${isSelected ? "job-row-selected" : ""}`}
									style={rowStyle}
								>
									<td title={job.JobCompanyJobNum}>{job.JobCompanyJobNum}</td>
									<td title={`${label}`}>
										<div className="status-container">
											<div>
												<i className={`${icon} status-icon mr-2`} />
												<span className="status-label">{label}</span>
											</div>
											{job.JobStatus !== 10 && job.JobStatusDateTime && (
												<span className="status-time">- {formattedTime}</span>
											)}
										</div>
									</td>

									<td title={formatTime(job.JobStartTime)}>
										{formatTime(job.JobStartTime)}
									</td>
									<td title={job.PumpTypeName}>{job.PumpTypeName}</td>
									<td title={job.UnitNumber}>{job.UnitNumber}</td>
									<td title={job.DriverName}>
										{job.IsTextMessageSent && (
											<i className="fas fa-envelope mr-2 text-black" />
										)}
										{job.DriverName}
									</td>

									<td
										className="pour-types-cell"
										title={job.PourTypes?.join(", ") || ""}
									>
										{job.PourTypes && job.PourTypes.length > 0 && (
											<>
												{job.PourTypes.slice(0, 2).join(", ")}
												{job.PourTypes.length > 2 &&
													` +${job.PourTypes.length - 2} more`}
											</>
										)}
									</td>

									<td className="customer-cell" title={job.CustomerCompanyName}>
										{job.CustomerConfirmed && (
											<i className="fas fa-check-circle mr-2" />
										)}
										{job.CustomerCompanyName}
									</td>

									<td
										className="site-area-cell"
										title={`${job.JobSiteAddress}, ${job.JobSiteArea}`}
									>
										{`${job.JobSiteAddress}, ${job.JobSiteArea}`}
									</td>
									<td title={`${job.JobTotalPoured} m³`}>
										{job.JobTotalPoured} m³
									</td>
									<td className="supplier-cell" title={job.SupplierCompanyName}>
										{job.SupplierConfirmed && (
											<i className="fas fa-check-circle mr-2" />
										)}
										{job.SupplierCompanyName}
									</td>

									<td title={job.JobSitePhone}>{job.JobSitePhone}</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>

			<ContextMenu
				contextMenuPosition={contextMenuPosition}
				closeContextMenu={() => setContextMenuPosition(null)}
				openModal={openModal}
				closeModal={(): void => {
					throw new Error("Function not implemented.");
				}}
				handleWashing={handleWashing}
				handleComplete={handleComplete}
				handleReset={handleReset}
				handleCancel={handleCancel}
				updateJobStartDate={updateJobStartDate}
				jobId={
					selectedJobKey
						? Number.parseInt(selectedJobKey.split("-")[0], 10)
						: null
				}
				currentDriverID={
					selectedJobKey
						? jobs.find(
							(job) => job.JobID === Number(selectedJobKey.split("-")[0]),
						)?.JobDriverID
						: null
				}
				onMessageStatusChange={handleMessageStatusChange}
				updateJobOperator={updateJobOperator}
				updateJobUnit={updateJobUnit}
				handleConfirm={handleConfirm}
				handleOperatorConfirm={handleOperatorConfirm}
				handleJobConfirm={handleJobConfirm}
				handleSendMessage={handleSendMessage}
			/>
			<MessageModal
				isOpen={isMessageModalOpen}
				onClose={() => setIsMessageModalOpen(false)}
				JobDriverID={selectedJobDriverID}
				JobID={
					selectedJobKey
						? Number.parseInt(selectedJobKey.split("-")[0], 10)
						: null
				}
				onMessageSent={(jobId, status) => handleMessageSent(jobId, status)}
			/>

			<Modal isOpen={isModalOpen} onClose={closeModal}>
				{modalContent}
			</Modal>
		</div>
	);
};

export default JobTable;