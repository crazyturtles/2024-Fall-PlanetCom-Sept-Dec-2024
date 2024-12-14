"use client";
import CrudPage from "../../Components/CrudPage";

export default function UnitPage() {
	return (
		<CrudPage
			entityName="Unit"
			entityTable="Unit"
			getDisplayName="UnitNumber"
			fetchLink="unit"
			fields={[
				{
					name: "unitNumber",
					label: "Unit Number",
					value: "",
					columnName: "UnitNumber",
					required: true,
				},
				{
					name: "pumpType",
					label: "Pump Type",
					value: "",
					type: "select",
					foreignEntity: {
						entityName: "PumpType",
						display: "PumpTypeName",
						url: "pumpType",
					},
					columnName: "UnitPumpTypeID",
					required: true,
				},
				{
					name: "operator",
					label: "Operator",
					value: "",
					type: "select",
					foreignEntity: {
						entityName: "Driver",
						display: "DriverFirstName + ' ' + DriverLastName",
						url: "operator",
					},
					columnName: "UnitDriverID",
					required: true,
				},
				{
					name: "make",
					label: "Make",
					value: "",
					columnName: "UnitMake",
					required: true,
				},
				{
					name: "manufacturer",
					label: "Manufacturer",
					value: "",
					columnName: "UnitManufacturer",
					required: true,
				},
				{
					name: "serialNumber",
					label: "Serial Number",
					value: "",
					columnName: "UnitSerialNumber",
					required: true,
				},
				{
					name: "licensePlate",
					label: "License Plate#",
					value: "",
					columnName: "UnitLicensePlate",
					required: true,
				},
				{
					name: "cviExpiryDate",
					label: "CVI Expiry Date",
					value: "",
					type: "datetime",
					columnName: "UnitCVIExpiry",
					required: true,
				},
				{
					name: "boomPipeChanged",
					label: "Boom Pipe Changed",
					value: "",
					type: "datetime",
					columnName: "UnitPipeLastChanged",
					required: true,
				},
				// {
				// 	name: "boomPipeUsed",
				// 	label: "Boom Pipe Used",
				// 	value: "",
				// 	columnName: "UnitPipeLastChanged",
				// 	required: true,
				// },
				{
					name: "deckPipeChanged",
					label: "Deck Pipe Changed",
					value: "",
					type: "date",
					columnName: "DeckPipeLastChanged",
					required: true,
				},
				// {
				// 	name: "deckPipeUsed",
				// 	label: "Deck Pipe Used",
				// 	value: "",
				// 	columnName: "DeckPipeLastChanged",
				// 	required: true,
				// },
				{
					name: "status",
					label: "Status",
					value: "1",
					columnName: "UnitStatus",
					required: true,
					type: "select",
					selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
				},
			]}
			defaultRates={[]}
		/>
	);
}
