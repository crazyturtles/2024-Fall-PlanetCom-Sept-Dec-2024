import type { ReportConfig } from "../types/reportTypes";

interface JobDetailsReport {
	Label: string;
	Value: string | null;
}

export const jobDetailsConfig: ReportConfig<JobDetailsReport> = {
	title: "Job Details",
	baseEndpoint: "/api/reports/job-details",
	requiresCustomer: false,
	requiresDateRange: false,
	className: "job-details-table",
	columns: [
		{
			header: "Job Label",
			key: "Label",
			width: "col-40",
			align: "left",
			wrap: "nowrap",
		},
		{
			header: "Job Value",
			key: "Value",
			width: "w-auto",
			align: "left",
		},
	],
	onDataReceived: async (response) => {
		return [
			{ Label: "Assigned Unit:", Value: response.AssignedUnit },
			{ Label: "Assigned Operator:", Value: response.AssignedOperator },
			{ Label: "Ticket No.:", Value: response.TicketNo },
			{ Label: "Customer:", Value: response.Customer },
			{ Label: "Job Date:", Value: response.JobDate },
			{ Label: "Time on Site:", Value: response.TimeOnSite },
			{ Label: "Concrete Onsite:", Value: response.ConcreteOnsite },
			{ Label: "Supplier:", Value: response.Supplier },
			{ Label: "Customer PO:", Value: response.CustomerPO },
			{ Label: "Customer Job No.:", Value: response.CustomerJobNo },
			{ Label: "Site Address:", Value: response.SiteAddress },
			{ Label: "Site Subdiv/Area:", Value: response.SiteSubdivArea },
			{ Label: "Site City/Town:", Value: response.SiteCityTown },
			{ Label: "Site Contact/Phone:", Value: response.SiteContactPhone },
			{ Label: "Map Location:", Value: response.MapLocation },
			{ Label: "Comments:", Value: response.Comments },
			{ Label: "Job Type:", Value: response.JobType },
			{ Label: "Pump Type Req'd:", Value: response.PumpTypeRequired },
			{ Label: "Pour Types:", Value: response.PourTypes },
		];
	},
	printConfig: {
		orientation: "landscape",
		pageSize: "letter",
		margins: {
			top: 0.5,
			right: 0.5,
			bottom: 0.5,
			left: 0.5,
		},
	},
};
