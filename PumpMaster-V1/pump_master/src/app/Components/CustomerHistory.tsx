import { useEffect, useState } from "react";
import { getJobStatusText } from "./JobStatus";

type CustomerHistory = {
	JobStatus: number;
	JobStartTime: string;
	PumpTypeName: string;
	UnitNumber: string;
	DriverName: string;
	PourTypeName: string;
	CustomerCompanyName: string;
	JobSiteArea: string;
	JobTotalPoured: string;
	SupplierCompanyName: string;
	JobSitePhone: string;
	JobCompanyJobNum: string;
	jobId: number;
	JobSiteAddress: string;
	JobID: string;
};

const CustomerHistoryModal = ({ customerId }: { customerId: number }) => {
	const [customerHistoryData, setCustomerHistoryData] = useState<
		CustomerHistory[]
	>([]);
	const [jobStatus, setJobStatus] = useState("");
	const [jobStartTime, setJobStartTime] = useState("");
	const [jobPumpType, setJobPumpType] = useState("");
	const [jobUnit, setJobUnit] = useState("");
	const [jobDriver, setJobDriver] = useState("");
	const [jobPourType, setJobPourType] = useState("");
	const [customerCompanyName, setCustomerCompanyName] = useState("");
	const [jobSiteArea, setJobSiteArea] = useState("");
	const [jobTotalPoured, setJobTotalPoured] = useState("");
	const [supplierCompanyName, setSupplierCompanyName] = useState("");
	const [JobSitePhone, setJobSitePhone] = useState("");
	const [JobCompanyJobNum, setJobCompanyJobNum] = useState("");
	const [selectedJobID, setSelectedJobID] = useState<number | null>(null);
	const [showJobForm, setShowJobForm] = useState(false);
	const [jobSiteAddress, setJobSiteAddress] = useState("");

	useEffect(() => {
		const fetchCustomerHistory = async () => {
			try {
				const response = await fetch(
					`http://localhost:3001/job/customerHistory/${customerId}`,
				);
				if (!response.ok) {
					throw new Error(
						`Failed to fetch customer history: ${response.statusText}`,
					);
				}
				const data: CustomerHistory[] = await response.json();
				setCustomerHistoryData(data);

				if (data.length > 0) {
					const latestHistory = data[0];
					setJobStatus(latestHistory.JobStatus.toString());
					setJobStartTime(latestHistory.JobStartTime);
					setJobPumpType(latestHistory.PumpTypeName);
					setJobUnit(latestHistory.UnitNumber);
					setJobDriver(latestHistory.DriverName);
					setJobPourType(latestHistory.PourTypeName);
					setCustomerCompanyName(latestHistory.CustomerCompanyName);
					setJobSiteArea(latestHistory.JobSiteArea);
					setJobTotalPoured(latestHistory.JobTotalPoured);
					setSupplierCompanyName(latestHistory.SupplierCompanyName);
					setJobSitePhone(latestHistory.JobSitePhone);
					setJobCompanyJobNum(latestHistory.JobCompanyJobNum);
					setJobSiteAddress(latestHistory.JobSiteAddress);
				}
			} catch (error) {
				console.error("Error fetching customer history:", error);
				setCustomerHistoryData([]);
			}
		};

		if (customerId) {
			fetchCustomerHistory();
		}
	}, [customerId]);

	const openJobForm = (jobId: number) => {
		console.log("job crud Job ID: ", jobId);
		setSelectedJobID(jobId);
		setShowJobForm(true);
	};

	const closeJobForm = () => {
		setShowJobForm(false);
		setSelectedJobID(null);
	};

	return (
		<div>
			<h1 className="font-bold text-2xl">
				Customer History For {customerCompanyName}
			</h1>
			<div className="mt-4 max-h-[60vh] overflow-y-auto">
				<table className="search-job-table w-full table-auto border-collapse">
					<thead>
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
						{customerHistoryData.map((history) => (
							<tr
								key={`${history.JobID}-${history.JobCompanyJobNum || "default"}`}
							>
								<td>{getJobStatusText(history.JobStatus)}</td>
								<td>{history.JobStartTime || "Not Available"}</td>
								<td>{history.PumpTypeName}</td>
								<td>{history.UnitNumber || "Not Assigned"}</td>
								<td>{history.DriverName || "Not Assigned"}</td>
								<td>{history.PourTypeName}</td>
								<td>{history.CustomerCompanyName}</td>
								<td>
									{history.JobSiteAddress + ", " + history.JobSiteArea || "N/A"}
								</td>
								<td>{history.JobTotalPoured || "0"}</td>
								<td>{history.SupplierCompanyName}</td>
								<td>{history.JobSitePhone}</td>
								<td>{history.JobCompanyJobNum || "N/A"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CustomerHistoryModal;
