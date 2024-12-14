"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { type KeyboardEvent, useEffect, useState } from "react";
import ChangeOperator from "./ChangeOperator";
import CustomerHistoryModal from "./CustomerHistory";
import JobForm from "./JobForm";
import PostponeJob from "./PostponeJob";

interface ContextMenuProps {
	contextMenuPosition: { x: number; y: number } | null;
	closeContextMenu: () => void;
	openModal: (content: React.ReactNode) => void;
	closeModal: () => void;
	handleWashing: (jobId: number) => void;
	handleComplete: (jobId: number) => void;
	handleReset: (jobId: number) => void;
	handleCancel: (jobId: number) => void;
	updateJobStartDate: (jobId: number, newStartDate: Date) => void;
	jobId: number | null;
	currentDriverID?;
	onMessageStatusChange: (jobId: number, isTextMessageSent: boolean) => void;
	updateJobOperator: (jobId: number, newOperatorName: string) => void;
	updateJobUnit: (jobId: number, newUnitNumber: string) => void;
	handleConfirm: (
		type: "Supplier" | "Customer",
		jobId: number,
	) => Promise<void>;
	handleOperatorConfirm: (jobId: number) => void;
	handleJobConfirm: (jobId: number) => void;
	handleSendMessage: (jobDriverID: number) => void;
}

const ContextMenu: FC<ContextMenuProps> = ({
	contextMenuPosition,
	closeContextMenu,
	openModal,
	closeModal,
	handleWashing,
	handleComplete,
	handleReset,
	updateJobStartDate,
	jobId,
	currentDriverID,
	updateJobOperator,
	updateJobUnit,
	handleConfirm,
	handleOperatorConfirm,
	handleJobConfirm,
	handleCancel,
	handleSendMessage,
	onMessageStatusChange,
}) => {
	const [units, setUnits] = useState<{ id: number; number: string }[]>([]);
	const [showUnitMenu, setShowUnitMenu] = useState(false);
	const [loadingUnits, setLoadingUnits] = useState(false);
	const [showConfirmMenu, setShowConfirmMenu] = useState(false);
	const [isBottomHalf, setIsBottomHalf] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (showUnitMenu) {
			const fetchUnits = async () => {
				try {
					setLoadingUnits(true);
					const response = await fetch("http://localhost:3001/job/units");
					if (!response.ok) throw new Error("Failed to fetch units");
					const data = await response.json();
					setUnits(data);
				} catch (error) {
					console.error("Error fetching units:", error);
				} finally {
					setLoadingUnits(false);
				}
			};
			fetchUnits();
		}
	}, [showUnitMenu]);

	useEffect(() => {
		if (contextMenuPosition) {
			const windowHeight = window.innerHeight;
			setIsBottomHalf(contextMenuPosition.y > windowHeight / 2);
		}
	}, [contextMenuPosition]);

	useEffect(() => {
		if (contextMenuPosition) {
			setShowUnitMenu(false);
		}
	}, [contextMenuPosition]);

	const assignUnitToJob = async (unitId: number, unitNumber: string) => {
		if (!jobId) return;
		try {
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/assign-unit`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ unitId }),
				},
			);

			if (!response.ok) throw new Error("Failed to assign unit");
			updateJobUnit(jobId, unitNumber);
		} catch (error) {
			console.error("Error assigning unit:", error);
		}
	};

	const handleCloseContextMenu = () => {
		closeContextMenu();
		setShowUnitMenu(false);
		setShowConfirmMenu(false);
	};

	const handleKeyDown = (
		e: KeyboardEvent<HTMLButtonElement>,
		action: () => void,
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		}
	};

	const handleOpenPostponeJobModal = async () => {
		if (!jobId) return;

		try {
			const response = await fetch(`http://localhost:3001/job/${jobId}`);
			if (!response.ok) throw new Error("Failed to fetch job details");

			const jobData = await response.json();
			const initialDate = new Date(jobData.JobStartDate);

			openModal(
				<PostponeJob
					jobId={jobId}
					initialDate={initialDate}
					updateJobStartDate={updateJobStartDate}
					onClose={closeModal}
				/>,
			);
		} catch (error) {
			console.error("Error fetching job details:", error);
		}
	};

	const handleOpenChangeOperatorModal = () => {
		if (!jobId) {
			console.error("Job ID is missing.");
			return;
		}

		openModal(
			<ChangeOperator
				jobId={jobId}
				currentDriverID={currentDriverID || null}
				updateJobOperator={updateJobOperator}
				onClose={closeModal}
			/>,
		);
	};

	const handleEditJob = async () => {
		if (!jobId) return;
		openModal(<JobForm jobId={jobId} onClose={closeContextMenu} />);
	};

	const handleNewJob = async () => {
		jobId = 0;
		openModal(<JobForm jobId={jobId} onClose={closeContextMenu} />);
	};

	const handleNewTemplateJob = async () => {
		if (!jobId) return;

		try {
			const response = await fetch(`http://localhost:3001/job/${jobId}`);
			if (!response.ok) throw new Error("Failed to fetch job data");

			const jobData = await response.json();
			const newTemplateJobData = { ...jobData };
			console.log("newTemplateJobData: ", newTemplateJobData);

			if (!newTemplateJobData || Object.keys(newTemplateJobData).length === 0) {
				throw new Error("No data found for the provided job ID.");
			}

			openModal(
				<JobForm
					jobId={0}
					initialData={newTemplateJobData}
					onClose={closeContextMenu}
				/>,
			);
		} catch (error) {
			console.error("Error creating new template job:", error);
		}
	};

	const openCustomerHistory = async () => {
		if (!jobId) {
			console.error("Job ID is missing.");
			return;
		}

		try {
			console.log("Fetching CustomerID for Job ID:", jobId);
			const response = await fetch(
				`http://localhost:3001/job/customerJob/${jobId}`,
			);
			if (!response.ok) {
				throw new Error("Failed to fetch CustomerID");
			}
			const jobData = await response.json();
			const customerId = jobData[0]?.JobCustomerID;
			if (!customerId) {
				console.error("Customer ID not found for the provided Job ID.");
				return;
			}

			openModal(<CustomerHistoryModal customerId={customerId} />);
		} catch (error) {
			console.error("Error fetching customer history:", error);
		}
	};

	const handleClearMessage = async (jobId: number) => {
		try {
			const response = await fetch(
				`http://localhost:3001/job/${jobId}/update-message-status`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ isTextMessageSent: false }),
				},
			);

			if (!response.ok) {
				throw new Error(
					`Failed to update message status: ${response.statusText}`,
				);
			}

			onMessageStatusChange(jobId, false);
		} catch (error) {
			console.error("Error clearing message status:", error);
		}
	};

	if (!contextMenuPosition || jobId === null) return null;

	return (
		<ul
			className={`context-menu ${isBottomHalf ? "bottom-half" : ""}`}
			data-testid="main-context-menu"
			style={{
				top: isBottomHalf
					? contextMenuPosition.y - 5
					: contextMenuPosition.y + 5,
				left: contextMenuPosition.x,
			}}
			onClick={handleCloseContextMenu}
			onKeyDown={handleCloseContextMenu}
			onKeyUp={handleCloseContextMenu}
			role="menu"
		>
			<li className="context-menu-item">
				<button
					onClick={handleNewJob}
					onKeyDown={(e) => handleKeyDown(e, handleNewJob)}
					onKeyUp={(e) => handleKeyDown(e, handleNewJob)}
					className="w-full text-left"
					type="button"
				>
					New Job
				</button>
			</li>
			<li className="context-menu-item border-b">
				<button
					onClick={handleNewTemplateJob}
					onKeyDown={(e) => handleKeyDown(e, handleNewTemplateJob)}
					onKeyUp={(e) => handleKeyDown(e, handleNewTemplateJob)}
					className="w-full text-left"
					type="button"
				>
					New Job from Template
				</button>
			</li>
			<li className="context-menu-item">
				<button
					onClick={handleEditJob}
					onKeyDown={(e) => handleKeyDown(e, handleEditJob)}
					onKeyUp={(e) => handleKeyDown(e, handleEditJob)}
					className="w-full text-left"
					type="button"
				>
					Edit Job
				</button>
			</li>
			<li className="context-menu-item border-b">
				<button
					onClick={() => jobId && handleReset(jobId)}
					onKeyDown={(e) => handleKeyDown(e, () => jobId && handleReset(jobId))}
					onKeyUp={(e) => handleKeyDown(e, () => jobId && handleReset(jobId))}
					className="w-full text-left"
					type="button"
				>
					Reset Job
				</button>
			</li>
			<li className="context-menu-item">
				<button
					onClick={handleOpenPostponeJobModal}
					onKeyDown={(e) => handleKeyDown(e, handleOpenPostponeJobModal)}
					onKeyUp={(e) => handleKeyDown(e, handleOpenPostponeJobModal)}
					className="w-full text-left"
					type="button"
				>
					Postpone Job
				</button>
			</li>
			<li className="context-menu-item border-b">
				<button
					onClick={() => jobId && handleCancel(jobId)}
					onKeyDown={(e) =>
						handleKeyDown(e, () => jobId && handleCancel(jobId))
					}
					onKeyUp={(e) => handleKeyDown(e, () => jobId && handleCancel(jobId))}
					className="w-full text-left"
					type="button"
				>
					Cancel Job
				</button>
			</li>

			<li
				className="context-menu-item flex justify-between"
				onMouseEnter={() => setShowUnitMenu(true)}
				onMouseLeave={() => setShowUnitMenu(false)}
			>
				<button
					className="flex w-full justify-between text-left"
					type="button"
					onClick={() => setShowUnitMenu(true)}
					onKeyDown={(e) => handleKeyDown(e, () => setShowUnitMenu(true))}
					onKeyUp={(e) => handleKeyDown(e, () => setShowUnitMenu(true))}
				>
					Assign Job To Unit
					<ChevronRight className="inline-block self-center" size={13} />
				</button>
				{showUnitMenu && (
					<ul className="context-menu-submenu" role="menu" data-testid="assign-unit-menu">
						{loadingUnits ? (
							<li className="context-menu-submenu-item">
								<button className="w-full text-left" type="button" disabled>
									Loading...
								</button>
							</li>
						) : (
							units.map((unit) => (
								<li key={unit.id} className="context-menu-submenu-item" data-testid={`unit-button-${unit.id}`}>
									<button
										onClick={() => assignUnitToJob(unit.id, unit.number)}
										onKeyDown={(e) =>
											handleKeyDown(e, () =>
												assignUnitToJob(unit.id, unit.number),
											)
										}
										onKeyUp={(e) =>
											handleKeyDown(e, () =>
												assignUnitToJob(unit.id, unit.number),
											)
										}
										className="w-full text-left"
										type="button"
									>
										{unit.number}
									</button>
								</li>
							))
						)}
					</ul>
				)}
			</li>

			<li
				className="context-menu-item flex justify-between"
				onMouseEnter={() => setShowConfirmMenu(true)}
				onMouseLeave={() => setShowConfirmMenu(false)}
			>
				<button
					className="flex w-full justify-between text-left"
					type="button"
					onClick={() => setShowConfirmMenu(true)}
					onKeyDown={(e) => handleKeyDown(e, () => setShowConfirmMenu(true))}
					onKeyUp={(e) => handleKeyDown(e, () => setShowConfirmMenu(true))}
				>
					Confirm
					<ChevronRight className="inline-block self-center" size={13} />
				</button>
				{showConfirmMenu && (
					<ul className="context-menu-submenu" role="menu">
						<li className="context-menu-submenu-item">
							<button
								onClick={() => {
									jobId && handleConfirm("Supplier", jobId);
									handleCloseContextMenu();
								}}
								onKeyDown={(e) =>
									handleKeyDown(e, () => {
										jobId && handleConfirm("Supplier", jobId);
										handleCloseContextMenu();
									})
								}
								onKeyUp={(e) =>
									handleKeyDown(e, () => {
										jobId && handleConfirm("Supplier", jobId);
										handleCloseContextMenu();
									})
								}
								className="w-full text-left"
								type="button"
							>
								Supplier
							</button>
						</li>
						<li className="context-menu-submenu-item">
							<button
								onClick={() => {
									jobId && handleConfirm("Customer", jobId);
									handleCloseContextMenu();
								}}
								onKeyDown={(e) =>
									handleKeyDown(e, () => {
										jobId && handleConfirm("Customer", jobId);
										handleCloseContextMenu();
									})
								}
								onKeyUp={(e) =>
									handleKeyDown(e, () => {
										jobId && handleConfirm("Customer", jobId);
										handleCloseContextMenu();
									})
								}
								className="w-full text-left"
								type="button"
							>
								Customer
							</button>
						</li>
						<li className="context-menu-submenu-item">
							<button
								onClick={() => {
									jobId && handleOperatorConfirm(jobId);
									handleCloseContextMenu();
								}}
								onKeyDown={(e) =>
									handleKeyDown(e, () => {
										jobId && handleOperatorConfirm(jobId);
										handleCloseContextMenu();
									})
								}
								onKeyUp={(e) =>
									handleKeyDown(e, () => {
										jobId && handleOperatorConfirm(jobId);
										handleCloseContextMenu();
									})
								}
								className="w-full text-left"
								type="button"
							>
								Operator
							</button>
						</li>
						<li className="context-menu-submenu-item">
							<button
								onClick={() => {
									jobId && handleJobConfirm(jobId);
									handleCloseContextMenu();
								}}
								onKeyDown={(e) =>
									handleKeyDown(e, () => {
										jobId && handleJobConfirm(jobId);
										handleCloseContextMenu();
									})
								}
								onKeyUp={(e) =>
									handleKeyDown(e, () => {
										jobId && handleJobConfirm(jobId);
										handleCloseContextMenu();
									})
								}
								className="w-full text-left"
								type="button"
							>
								Job
							</button>
						</li>
					</ul>
				)}
			</li>

			<li className="context-menu-item">
				<button
					onClick={() => jobId && handleWashing(jobId)}
					onKeyDown={(e) =>
						handleKeyDown(e, () => jobId && handleWashing(jobId))
					}
					onKeyUp={(e) => handleKeyDown(e, () => jobId && handleWashing(jobId))}
					className="w-full text-left"
					type="button"
				>
					Washing
				</button>
			</li>
			<li className="context-menu-item">
				<button
					onClick={() => jobId && handleComplete(jobId)}
					onKeyDown={(e) =>
						handleKeyDown(e, () => jobId && handleComplete(jobId))
					}
					onKeyUp={(e) =>
						handleKeyDown(e, () => jobId && handleComplete(jobId))
					}
					className="w-full text-left"
					type="button"
				>
					Complete Job
				</button>
			</li>
			<li className="context-menu-item">
				<button
					onClick={handleOpenChangeOperatorModal}
					onKeyDown={(e) => handleKeyDown(e, handleOpenChangeOperatorModal)}
					onKeyUp={(e) => handleKeyDown(e, handleOpenChangeOperatorModal)}
					className="w-full text-left"
					type="button"
				>
					Change Operator
				</button>
			</li>
			<li className="context-menu-item">
				<button
					onClick={() => currentDriverID && handleSendMessage(currentDriverID)}
					onKeyDown={(e) =>
						handleKeyDown(
							e,
							() => currentDriverID && handleSendMessage(currentDriverID),
						)
					}
					onKeyUp={(e) =>
						handleKeyDown(
							e,
							() => currentDriverID && handleSendMessage(currentDriverID),
						)
					}
					className="w-full text-left"
					type="button"
				>
					Send Message
				</button>
			</li>
			<li className="context-menu-item">
				<button
					className="w-full text-left"
					type="button"
					onClick={() => {
						if (jobId) {
							handleClearMessage(jobId);
						}
					}}
					onKeyDown={(e) => handleKeyDown(e, () => { })}
					onKeyUp={(e) => handleKeyDown(e, () => { })}
				>
					Clear Message Icon
				</button>
			</li>
			<li className="context-menu-item border-b">
				<button
					onClick={() => router.push(`/reports/job-details/${jobId}`)}
					onKeyDown={(e) =>
						handleKeyDown(e, () => router.push(`/reports/job-details/${jobId}`))
					}
					onKeyUp={(e) =>
						handleKeyDown(e, () => router.push(`/reports/job-details/${jobId}`))
					}
					className="w-full text-left"
					type="button"
				>
					Print
				</button>
			</li>
			<li className="context-menu-item">
				<button
					onClick={openCustomerHistory}
					onKeyDown={(e) => handleKeyDown(e, openCustomerHistory)}
					onKeyUp={(e) => handleKeyDown(e, openCustomerHistory)}
					className="w-full text-left"
					type="button"
				>
					Customer History
				</button>
			</li>
			<li className="context-menu-item">
				<button
					onClick={handleCloseContextMenu}
					onKeyDown={(e) => handleKeyDown(e, handleCloseContextMenu)}
					onKeyUp={(e) => handleKeyDown(e, handleCloseContextMenu)}
					className="w-full text-left"
					type="button"
				>
					Cancel
				</button>
			</li>
		</ul>
	);
};

export default ContextMenu;
