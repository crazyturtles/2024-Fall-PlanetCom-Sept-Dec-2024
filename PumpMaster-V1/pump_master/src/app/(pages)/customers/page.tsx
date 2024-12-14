"use client";
import {} from "@/app/util";
import {} from "react";

import CrudPage from "../../Components/CrudPage";

const CustomerPage = () => (
	<CrudPage
		entityName="Customer"
		entityTable="Customer"
		getDisplayName="CustomerCompanyName"
		fetchLink="customer"
		fields={[
			{
				name: "companyName",
				label: "Company Name",
				value: "",
				columnName: "CustomerCompanyName",
				required: true,
			},
			{
				name: "lastName",
				label: "Last Name",
				value: "",
				columnName: "CustomerLastName",
				required: true,
			},
			{
				name: "firstName",
				label: "First Name",
				value: "",
				columnName: "CustomerFirstName",
				required: true,
			},
			{
				name: "address",
				label: "Address",
				value: "",
				columnName: "CustomerAddress",
				required: true,
			},
			{
				name: "city",
				label: "City",
				value: "",
				columnName: "CustomerCity",
				required: true,
			},
			{
				name: "province",
				label: "Province",
				value: "",
				columnName: "CustomerProvince",
				required: true,
			},
			{
				name: "postalCode",
				label: "Postal Code",
				value: "",
				columnName: "CustomerPostalCode",
				required: true,
			},
			{
				name: "phone",
				label: "Phone",
				value: "",
				type: "tel",
				columnName: "CustomerPhone",
				required: true,
			},
			{
				name: "cell",
				label: "Cell",
				value: "",
				type: "tel",
				columnName: "CustomerCell",
				required: true,
			},
			{
				name: "email",
				label: "Email",
				value: "",
				columnName: "CustomerEmail",
				required: true,
			},
			{
				name: "comments",
				label: "Comments",
				value: "",
				columnName: "CustomerComments",
				required: false,
			},
			{
				name: "status",
				label: "Status",
				type: "select",
				selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
				value: "1",
				columnName: "CustomerStatus",
				required: true,
			},
			{
				name: "simplyID",
				label: "Simply ID",
				value: "",
				columnName: "SimplyID",
				required: true,
			},
			{
				name: "invoiceTerms",
				label: "Invoice Terms",
				value: "",
				columnName: "CustomerInvoiceTerms",
				required: false,
			},
		]}
		defaultRates={[
			"RoadBan75Rate",
			"RoadBan90Rate",
			"SaturdayPourRate",
			"SecondaryOperatorRate",
			"OnsiteQaRate",
			"AdditionalDunnageRate",
			"AdditionalLineRate",
			"FlagPersonRate",
			"FuelSurchargeRate",
			"WashoutRate",
		]}
	/>
);

export default CustomerPage;
