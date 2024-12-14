"use client";

import CrudPage from "@/app/Components/CrudPage";
import {} from "react";
import {} from "../../bll/OperatorService";

interface Operator {
	driverID: number;
	driverLastName: string;
	driverFirstName: string;
	driverAddress: string;
	driverCity: string;
	driverProvince: string;
	driverPostalCode: string;
	driverPhone: string;
	driverCell: string;
	driverEmail: string;
	driverLicenceNum: string;
	driverTextMsgNum: string;
	driverStatus: number;
	messagePreference: string;
}

const OperatorPage = () => (
	<CrudPage
		entityName="Operators" // Adjusted to align with backend
		entityTable="Driver" // Adjusted to align with backend table
		getDisplayName="DriverFirstName +  ' ' + DriverLastName" // Backend-compatible display field
		fetchLink="operator"
		fields={[
			{
				name: "driverLastName",
				label: "Last Name",
				value: "",
				columnName: "DriverLastName",
				required: true,
			},
			{
				name: "driverFirstName",
				label: "First Name",
				value: "",
				columnName: "DriverFirstName",
				required: true,
			},
			{
				name: "driverAddress",
				label: "Address",
				value: "",
				columnName: "DriverAddress",
				required: true,
			},
			{
				name: "driverCity",
				label: "City",
				value: "",
				columnName: "DriverCity",
				required: true,
			},
			{
				name: "driverProvince",
				label: "Province",
				value: "",
				columnName: "DriverProvince",
				required: true,
			},
			{
				name: "driverPostalCode",
				label: "Postal Code",
				value: "",
				columnName: "DriverPostalCode",
				required: true,
			},
			{
				name: "driverPhone",
				label: "Phone",
				value: "",
				columnName: "DriverPhone",
				type: "tel",
				pattern: "\\d{10}",
				required: true,
			},
			{
				name: "driverCell",
				label: "Cell",
				value: "",
				columnName: "DriverCell",
				type: "tel",
				required: false,
			},
			{
				name: "driverEmail",
				label: "Email",
				value: "",
				columnName: "DriverEmail",
				required: true,
			},
			{
				name: "driverLicenceNum",
				label: "Licence Number",
				value: "",
				columnName: "DriverLicenceNum",
				required: true,
			},
			{
				name: "driverTextMsgNum",
				label: "Text Message Number",
				value: "",
				columnName: "DriverTextMsgNum",
				required: false,
			},
			{
				name: "driverStatus",
				label: "Status",
				value: "1",
				columnName: "DriverStatus",
				required: true,
				type: "select",
				selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
			},
			{
				name: "messagePreference",
				label: "Message Preference",
				value: "",
				columnName: "MessagePreference",
				required: true,
				type: "radio",
				radioItems: [{ E: "Email" }, { S: "SMS" }],
			},
		]}
		defaultRates={[]}
	/>
);

export default OperatorPage;
