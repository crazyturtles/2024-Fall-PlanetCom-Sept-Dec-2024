"use client";
import CrudPage from "../../Components/CrudPage";

const PumpTypePage = () => (
	<CrudPage
		entityName="Pump Type"
		entityTable="PumpType"
		getDisplayName="PumpTypeName"
		fetchLink="pumpType"
		fields={[
			{
				name: "pumpTypeName",
				label: "Pump Type Name",
				value: "",
				columnName: "PumpTypeName",
				required: true,
			},
			{
				name: "comments",
				label: "Comments",
				value: "",
				columnName: "PumpTypeComments",
				required: true,
			},
			{
				name: "hourlyRate",
				label: "Hourly Rate",
				value: "",
				columnName: "PumpTypeHourlyRate",
				required: true,
				sign: "$",
			},
			{
				name: "pourRate",
				label: "Pour Rate",
				value: "",
				columnName: "PumpTypePourRate",
				required: true,
				sign: "$",
			},
			{
				name: "washoutRate",
				label: "Washout Rate",
				value: "",
				columnName: "PumpTypeWashoutRate",
				required: true,
				sign: "$",
			},
			{
				name: "status",
				label: "Status",
				type: "select",
				selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
				value: "1",
				columnName: "PumpTypeStatus",
				required: true,
			},
		]}
		defaultRates={[]}
	/>
);

export default PumpTypePage;
