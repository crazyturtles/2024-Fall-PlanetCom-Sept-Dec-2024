"use client";
import CrudPage from "@/app/Components/CrudPage";

const JobTypePage = () => (
	<CrudPage
		entityName="Job Type"
		entityTable="JobType"
		getDisplayName="JobTypeText"
		fetchLink="jobType"
		fields={[
			{
				name: "jobTypeName",
				label: "Job Type Name",
				value: "",
				columnName: "JobTypeText",
				required: true,
			},
		]}
		defaultRates={[]}
		showFilter={false}
	/>
);

export default JobTypePage;
