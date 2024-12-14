"use client";

export default function unifiedUI() {
	return (
		// <CURDForm
		// 	entityName={"Technician"}
		// 	selectedID={2}
		// 	fields={[
		// 		{
		// 			label: "Last Name",
		// 			name: "technicianLastName",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianLastName",
		// 		},
		// 		{
		// 			label: "First Name",
		// 			name: "technicianFirstName",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianFirstName",
		// 		},
		// 		{
		// 			label: "Address",
		// 			name: "technicianAddress",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianAddress",
		// 		},
		// 		{
		// 			label: "City",
		// 			name: "technicianCity",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianCity",
		// 		},
		// 		{
		// 			label: "Province",
		// 			name: "technicianProvince",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianProvince",
		// 		},
		// 		{
		// 			label: "Postal Code",
		// 			name: "technicianPostalCode",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianPostalCode",
		// 		},
		// 		{
		// 			label: "Phone",
		// 			name: "technicianPhone",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianPhone",
		// 		},
		// 		{
		// 			label: "Email",
		// 			name: "technicianEmail",
		// 			required: true,
		// 			value: "",
		// 			columnName: "TechnicianEmail",
		// 		},
		// 		{
		// 			label: "Hourly Rate",
		// 			name: "technicianHourlyRate",
		// 			required: true,
		// 			value: 0,
		// 			sign: "$",
		// 			columnName: "TechnicianHourlyRate",
		// 		},
		// 		{
		// 			label: "Status",
		// 			name: "technicianStatus",
		// 			type: "select",
		// 			required: true,
		// 			value: 1,
		// 			columnName: "TechnicianStatus",
		// 			selectItems: [{ 0: "Inactive" }, { 1: "Active" }],
		// 		},
		// 	]}
		// 	fetchLink={"technician"}
		// />
		// <CURDForm
		// 	entityName={"Operator"}
		// 	selectedID={1}
		// 	fields={[
		// 		{
		// 			label: "Last Name",
		// 			name: "driverLastName",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverLastName",
		// 		},
		// 		{
		// 			label: "First Name",
		// 			name: "driverFirstName",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverFirstName",
		// 		},
		// 		{
		// 			label: "Address",
		// 			name: "driverAddress",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverAddress",
		// 		},
		// 		{
		// 			label: "City",
		// 			name: "driverCity",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverCity",
		// 		},
		// 		{
		// 			label: "Province",
		// 			name: "driverProvince",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverProvince",
		// 		},
		// 		{
		// 			label: "Postal Code",
		// 			name: "driverPostalCode",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverPostalCode",
		// 		},
		// 		{
		// 			label: "Driver's License",
		// 			name: "driverLicense",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverLicenceNum",
		// 		},
		// 		{
		// 			label: "Phone",
		// 			name: "driverPhone",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverPhone",
		// 		},
		// 		{
		// 			label: "Email",
		// 			name: "driverEmail",
		// 			required: true,
		// 			value: "",
		// 			columnName: "DriverEmail",
		// 		},
		// 		{
		// 			label: "Status",
		// 			type: "select",
		// 			name: "driverStatus",
		// 			required: true,
		// 			value: 1,
		// 			columnName: "DriverStatus",
		// 			selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
		// 		},
		// 		{
		// 			label: "Message Preference",
		// 			name: "messagePreference",
		// 			type: "radio",
		// 			value: "",
		// 			required: true,
		// 			columnName: "MessagePreference",
		// 			radioItems: [{ S: "SMS" }, { E: "Email" }],
		// 		},
		// 	]}
		// 	fetchLink="operator"
		// />
		// <CURDForm
		// 	entityName={"Supplier"}
		// 	selectedID={1}
		// 	fetchLink={"supplier"}
		// 	fields={[
		// 		{
		// 			name: "supplierCompanyName",
		// 			label: "Company Name",
		// 			value: "",
		// 			columnName: "SupplierCompanyName",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierContactName",
		// 			label: "Contact Name",
		// 			value: "",
		// 			columnName: "SupplierContactName",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierAddress",
		// 			label: "Address",
		// 			value: "",
		// 			columnName: "SupplierAddress",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierCity",
		// 			label: "City",
		// 			value: "",
		// 			columnName: "SupplierCity",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierProvince",
		// 			label: "Province",
		// 			value: "",
		// 			columnName: "SupplierProvince",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierPostalCode",
		// 			label: "Postal Code",
		// 			value: "",
		// 			columnName: "SupplierPostalCode",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierPhone",
		// 			label: "Phone",
		// 			value: "",
		// 			type: "tel",
		// 			pattern: "\\d{10}",
		// 			columnName: "SupplierPhone",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierEmail",
		// 			label: "Email",
		// 			value: "",
		// 			columnName: "SupplierEmail",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "supplierComments",
		// 			label: "Comments",
		// 			type: "textarea",
		// 			value: "",
		// 			columnName: "SupplierComments",
		// 			required: false,
		// 		},
		// 		{
		// 			name: "supplierStatus",
		// 			label: "Status",
		// 			value: "",
		// 			columnName: "SupplierStatus",
		// 			required: true,
		// 			type: "select",
		// 			selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
		// 		},
		// 	]}
		// />
		// <CURDForm
		// 	entityName={"Unit"}
		// 	selectedID={0}
		// 	fields={[
		// 		{
		// 			name: "unitNumber",
		// 			label: "Unit Number",
		// 			value: "",
		// 			columnName: "UnitNumber",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "pumpType",
		// 			label: "Pump Type",
		// 			value: "",
		// 			type: "select",
		// 			foreignEntity: {
		// 				entityName: "PumpType",
		// 				display: "PumpTypeName",
		// 				url: "pumpType",
		// 			},
		// 			columnName: "UnitPumpTypeID",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "operator",
		// 			label: "Operator",
		// 			value: "",
		// 			type: "select",
		// 			foreignEntity: {
		// 				entityName: "Driver",
		// 				display: "DriverFirstName + ' ' + DriverLastName",
		// 				url: "operator",
		// 			},
		// 			columnName: "UnitDriverID",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "make",
		// 			label: "Make",
		// 			value: "",
		// 			columnName: "UnitMake",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "manufacturer",
		// 			label: "Manufacturer",
		// 			value: "",
		// 			columnName: "UnitManufacturer",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "serialNumber",
		// 			label: "Serial Number",
		// 			value: "",
		// 			columnName: "UnitSerialNumber",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "licensePlate",
		// 			label: "License Plate#",
		// 			value: "",
		// 			columnName: "UnitLicensePlate",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "cviExpiryDate",
		// 			label: "CVI Expiry Date",
		// 			value: "",
		// 			type: "datetime",
		// 			columnName: "UnitCVIExpiry",
		// 			required: true,
		// 		},
		// 		{
		// 			name: "boomPipeChanged",
		// 			label: "Boom Pipe Changed",
		// 			value: "",
		// 			type: "datetime",
		// 			columnName: "UnitPipeLastChanged",
		// 			required: true,
		// 		},
		// 		// {
		// 		// 	name: "boomPipeUsed",
		// 		// 	label: "Boom Pipe Used",
		// 		// 	value: "",
		// 		// 	columnName: "UnitPipeLastChanged",
		// 		// 	required: true,
		// 		// },
		// 		{
		// 			name: "deckPipeChanged",
		// 			label: "Deck Pipe Changed",
		// 			value: "",
		// 			type: "date",
		// 			columnName: "DeckPipeLastChanged",
		// 			required: true,
		// 		},
		// 		// {
		// 		// 	name: "deckPipeUsed",
		// 		// 	label: "Deck Pipe Used",
		// 		// 	value: "",
		// 		// 	columnName: "DeckPipeLastChanged",
		// 		// 	required: true,
		// 		// },
		// 		{
		// 			name: "status",
		// 			label: "Status",
		// 			value: "",
		// 			columnName: "UnitStatus",
		// 			required: true,
		// 			type: "select",
		// 			selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
		// 		},
		// 	]}
		// 	fetchLink="unit"
		// />
		<></>
	);
}
