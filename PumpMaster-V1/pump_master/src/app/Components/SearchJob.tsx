import { useEffect, useState } from "react";
import { getJobStatusText } from "./JobStatus";
import Modal from "./Modal";
import { formatDateTime } from "./ReportsComponents/utils/dateUtils";

interface SearchJobProps {
	fetchLink: string;
	onEdit: (id: number) => void;
}

const SearchJob = ({ fetchLink, onEdit }: SearchJobProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"ticket" | "customer">("ticket");
	const [searchTerm, setSearchTerm] = useState("");
	const [allJobs, setAllJobs] = useState<any[]>([]);
	const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
	const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
	const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [noResultsMessage, setNoResultsMessage] = useState("");

	const toggleModal = async () => {
		setIsModalOpen(!isModalOpen);
		resetForm();
		if (!isModalOpen && allJobs.length === 0) {
			const jobs = await fetchAllJobs();
			setAllJobs(jobs);
		}
	};

	const fetchAllJobs = async () => {
		try {
			const res = await fetch(`http://localhost:3001/${fetchLink}/all`);
			const data = await res.json();
			return Array.isArray(data) ? data : [];
		} catch (error) {
			console.error("Error fetching jobs:", error);
			setAllJobs([]);
			return [];
		}
	};

	useEffect(() => {
		const filtered = allJobs
			.map((job) =>
				activeTab === "ticket" ? job.JobCompanyJobNum : job.CustomerCompanyName,
			)
			.filter(
				(option, index, self) =>
					option?.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
					self.indexOf(option) === index,
			);
		setFilteredOptions(filtered);
		setIsDropdownVisible(filtered.length > 0 && searchTerm !== "");
	}, [searchTerm, activeTab, allJobs]);

	const searchJobs = async () => {
		const queryParam =
			activeTab === "ticket"
				? `ticket=${encodeURIComponent(searchTerm)}`
				: `customer=${encodeURIComponent(searchTerm)}`;

		try {
			const res = await fetch(
				`http://localhost:3001/${fetchLink}/search?${queryParam}`,
			);
			const data = await res.json();
			if (Array.isArray(data) && data.length > 0) {
				setFilteredJobs(data);
				setNoResultsMessage("");
			} else {
				setFilteredJobs([]);
				setNoResultsMessage(`No jobs found with that ${activeTab}.`);
			}
		} catch (error) {
			console.error("Error searching jobs:", error);
			setFilteredJobs([]);
			setNoResultsMessage("Error occurred during the search.");
		}

		setIsDropdownVisible(false);
	};

	const clearResults = () => {
		setFilteredJobs([]);
		setSearchTerm("");
		setNoResultsMessage("");
	};

	const resetForm = () => {
		setSearchTerm("");
		setFilteredJobs([]);
		setFilteredOptions([]);
		setNoResultsMessage("");
	};

	const handleRowClick = (uniqueKey: string) => {
		setSelectedJobKey(uniqueKey === selectedJobKey ? null : uniqueKey);
	};

	const handleRowDoubleClick = (jobId: number) => {
		onEdit(jobId);
	};

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLTableRowElement>,
		jobId: number,
	) => {
		if (event.key === "Enter") {
			onEdit(jobId);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={toggleModal}
				className="flex items-center justify-center rounded-full bg-blue-500 px-5 py-3 font-bold text-sm text-white hover:bg-blue-700"
				aria-label="Search Jobs"
			>
				<i className="fas fa-search" />
				<p className="pl-1">Search</p>
			</button>

			<Modal isOpen={isModalOpen} onClose={toggleModal} fullScreen={true}>
				<div className="mb-4 flex items-center justify-between">
					<div className="tabs flex space-x-4 border-b">
						<button
							type="button"
							className={`px-4 py-2 ${activeTab === "ticket"
								? "border-blue-500 border-b-2 text-blue-500"
								: "text-gray-500"
								}`}
							onClick={() => {
								setActiveTab("ticket");
								resetForm();
							}}
						>
							Search By Ticket#
						</button>
						<button
							type="button"
							className={`px-4 py-2 ${activeTab === "customer"
								? "border-blue-500 border-b-2 text-blue-500"
								: "text-gray-500"
								}`}
							onClick={() => {
								setActiveTab("customer");
								resetForm();
							}}
						>
							Search By Customer
						</button>
					</div>
				</div>

				<div className="search-bar relative mb-4 flex min-h-[275px] flex-col gap-16">
					<div className="relative flex items-center">
						<input
							type="text"
							placeholder={`Search by ${activeTab === "ticket" ? "Ticket#" : "Customer"}`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onFocus={() => setIsDropdownVisible(true)}
							className="w-full rounded border border-gray-300 p-2 pr-10"
						/>
						<button
							type="button"
							onClick={clearResults}
							className="absolute right-2 text-gray-500 hover:text-gray-700"
							aria-label="Clear search"
						>
							<i className="fas fa-eraser fa-lg" />
						</button>
					</div>

					{isDropdownVisible && (
						<ul className="absolute z-20 mt-12 max-h-40 w-full overflow-y-auto rounded border border-gray-300 bg-white">
							{filteredOptions.map((option) => (
								<li
									key={option}
									className="cursor-pointer p-2 hover:bg-gray-200"
								>
									<button
										type="button"
										onClick={() => {
											setSearchTerm(option);
											setIsDropdownVisible(false);
										}}
										className="w-full text-left"
									>
										{option}
									</button>
								</li>
							))}
						</ul>
					)}

					{filteredJobs.length > 0 ? (
						<div className="mt-4 max-h-[50vh] overflow-y-auto">
							<table className="search-job-table w-full table-auto border-collapse">
								<thead className="sticky top-0 z-10 border-t bg-white">
									<tr>
										<th>Status</th>
										<th>Time</th>
										<th>Pump</th>
										<th>Unit</th>
										<th>Operator</th>
										<th>Use</th>
										<th>Customer</th>
										<th>Site, Area</th>
										<th>Amount</th>
										<th>Supplier</th>
										<th>Site Contact</th>
										<th>Ticket#</th>
									</tr>
								</thead>
								<tbody>
									{filteredJobs.map((job, index) => {
										const uniqueKey = `${job.JobID}-${index}`;
										return (
											<tr
												key={uniqueKey}
												data-testid={`job-row-${job.JobID}`}
												onClick={() => handleRowClick(uniqueKey)}
												onDoubleClick={() => handleRowDoubleClick(job.JobID)}
												onKeyDown={(e) => handleKeyDown(e, job.JobID)}
												tabIndex={0}
												className={`search-job-row cursor-pointer ${selectedJobKey === uniqueKey
													? "search-job-row-selected"
													: ""
													}`}
												aria-selected={selectedJobKey === uniqueKey}
											>
												<td>{getJobStatusText(job.JobStatus)}</td>
												<td>{formatDateTime(job.JobStartTime)}</td>
												<td>{job.PumpTypeName}</td>
												<td>{job.UnitNumber}</td>
												<td>{job.DriverName}</td>
												<td>{job.PourTypeName}</td>
												<td>{job.CustomerCompanyName}</td>
												<td>{`${job.JobSiteAddress}, ${job.JobSiteArea}`}</td>
												<td>{job.JobTotalPoured}</td>
												<td>{job.SupplierCompanyName}</td>
												<td>{job.JobSitePhone}</td>
												<td>{job.JobCompanyJobNum}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					) : (
						noResultsMessage && (
							<p className="mt-4 text-center">{noResultsMessage}</p>
						)
					)}
				</div>
				<div className="mt-4 flex justify-center">
					<button
						type="button"
						onClick={searchJobs}
						className="w-1/4 rounded-full bg-blue-600 px-4 py-2 text-white"
						disabled={!searchTerm}
						data-testid="modal-search-button"
					>
						Search
					</button>
				</div>
			</Modal>
		</>
	);
};

export default SearchJob;
