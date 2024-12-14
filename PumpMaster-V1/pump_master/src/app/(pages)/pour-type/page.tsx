"use client";
import CrudPage from "../../Components/CrudPage";

const PourTypePage = () => (
	<CrudPage
		entityName="Pour Type"
		entityTable="PourType"
		getDisplayName="PourTypeName"
		fetchLink="pourType"
		fields={[
			{
				name: "pourTypeName",
				label: "Pour Type Name",
				value: "",
				columnName: "PourTypeName",
				required: true,
			},
			{
				name: "comments",
				label: "Comments",
				value: "",
				columnName: "PourTypeComments",
				required: true,
			},
			{
				name: "pourRate",
				label: "Pour Rate",
				value: "",
				type: "$",
				columnName: "PourTypeRate",
				required: true,
				sign: "$",
			},
			{
				name: "status",
				label: "Status",
				type: "select",
				selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
				value: "1",
				columnName: "PourTypeStatus",
				required: true,
			},
		]}
		defaultRates={[]}
	/>
);

export default PourTypePage;
