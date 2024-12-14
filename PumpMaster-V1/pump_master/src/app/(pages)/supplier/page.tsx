"use client";

import {} from "react";
import CRUDPage from "../../Components/CrudPage";

const SupplierPage = () => (
	<CRUDPage
		entityName="supplier"
		entityTable="Supplier"
		getDisplayName="SupplierCompanyName"
		fetchLink="supplier"
		fields={[
			{
				name: "supplierCompanyName",
				label: "Company Name",
				value: "",
				columnName: "SupplierCompanyName",
				required: true,
			},
			{
				name: "supplierContactName",
				label: "Contact Name",
				value: "",
				columnName: "SupplierContactName",
				required: true,
			},
			{
				name: "supplierAddress",
				label: "Address",
				value: "",
				columnName: "SupplierAddress",
				required: true,
			},
			{
				name: "supplierCity",
				label: "City",
				value: "",
				columnName: "SupplierCity",
				required: true,
			},
			{
				name: "supplierProvince",
				label: "Province",
				value: "",
				columnName: "SupplierProvince",
				required: true,
			},
			{
				name: "supplierPostalCode",
				label: "Postal Code",
				value: "",
				columnName: "SupplierPostalCode",
				required: true,
			},
			{
				name: "supplierPhone",
				label: "Phone",
				value: "",
				type: "tel",
				pattern: "\\d{10}",
				columnName: "SupplierPhone",
				required: true,
			},
			{
				name: "supplierEmail",
				label: "Email",
				value: "",
				columnName: "SupplierEmail",
				required: true,
			},
			{
				name: "supplierComments",
				label: "Comments",
				type: "textarea",
				value: "",
				columnName: "SupplierComments",
				required: false,
			},
			{
				name: "supplierStatus",
				label: "Status",
				value: "1",
				columnName: "SupplierStatus",
				required: true,
				type: "select",
				selectItems: [{ 1: "Active" }, { 0: "Inactive" }],
			},
		]}
		defaultRates={[]}
	/>
);
export default SupplierPage;
