"use client";
import CrudPage from "../../Components/CrudPage";

const TechnicianPage = () => (
	<CrudPage
		entityName="technician"
		entityTable="Technician"
		getDisplayName="TechnicianFirstName + ' ' + TechnicianLastName"
		fetchLink="technician"
		fields={[
			{
				label: "Last Name",
				name: "technicianLastName",
				required: true,
				value: "",
				columnName: "TechnicianLastName",
			},
			{
				label: "First Name",
				name: "technicianFirstName",
				required: true,
				value: "",
				columnName: "TechnicianFirstName",
			},
			{
				label: "Address",
				name: "technicianAddress",
				required: true,
				value: "",
				columnName: "TechnicianAddress",
			},
			{
				label: "City",
				name: "technicianCity",
				required: true,
				value: "",
				columnName: "TechnicianCity",
			},
			{
				label: "Province",
				name: "technicianProvince",
				required: true,
				value: "",
				columnName: "TechnicianProvince",
			},
			{
				label: "Postal Code",
				name: "technicianPostalCode",
				required: true,
				value: "",
				columnName: "TechnicianPostalCode",
			},
			{
				label: "Phone",
				name: "technicianPhone",
				type: "tel",
				required: true,
				value: "",
				columnName: "TechnicianPhone",
			},
			{
				label: "Email",
				name: "technicianEmail",
				type: "email",
				required: true,
				value: "",
				columnName: "TechnicianEmail",
			},
			{
				label: "Hourly Rate",
				name: "technicianHourlyRate",
				required: true,
				value: "0",
				sign: "$",
				columnName: "TechnicianHourlyRate",
			},
			{
				label: "Status",
				name: "technicianStatus",
				type: "select",
				required: true,
				value: "1",
				columnName: "TechnicianStatus",
				selectItems: [{ 0: "Inactive" }, { 1: "Active" }],
			},
		]}
		defaultRates={[]}
	/>
);

export default TechnicianPage;
