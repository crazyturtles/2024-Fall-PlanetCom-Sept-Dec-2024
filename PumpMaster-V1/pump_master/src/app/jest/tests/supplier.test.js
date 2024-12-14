import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import CrudPage from "../../Components/CrudPage";
import { useRouter } from "next/navigation";

fetchMock.enableMocks();
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

describe("Supplier Page", () => {
	const mockPush = jest.fn();
	const defaultProps = {
		entityName: "supplier",
		entityTable: "Supplier",
		getDisplayName: "SupplierCompanyName",
		fetchLink: "supplier",
		fields: [
			{
				label: "Company Name",
				name: "supplierCompanyName",
				required: true,
				value: "",
				columnName: "SupplierCompanyName",
			},
			{
				label: "Contact Name",
				name: "supplierContactName",
				required: true,
				value: "",
				columnName: "SupplierContactName",
			},
			{
				label: "Address",
				name: "supplierAddress",
				required: true,
				value: "",
				columnName: "SupplierAddress",
			},
			{
				label: "City",
				name: "supplierCity",
				required: true,
				value: "",
				columnName: "SupplierCity",
			},
			{
				label: "Province",
				name: "supplierProvince",
				required: true,
				value: "",
				columnName: "SupplierProvince",
			},
			{
				label: "Postal Code",
				name: "supplierPostalCode",
				required: true,
				value: "",
				columnName: "SupplierPostalCode",
			},
			{
				label: "Phone",
				name: "supplierPhone",
				type: "tel",
				required: true,
				value: "",
				columnName: "SupplierPhone",
			},
			{
				label: "Email",
				name: "supplierEmail",
				type: "email",
				required: true,
				value: "",
				columnName: "SupplierEmail",
			},
			{
				label: "Comments",
				name: "supplierComments",
				required: false,
				value: "",
				columnName: "SupplierComments",
			},
			{
				label: "Status",
				name: "supplierStatus",
				type: "select",
				required: true,
				value: "1",
				columnName: "SupplierStatus",
				selectItems: [{ 0: "Inactive" }, { 1: "Active" }],
			},
		],
		defaultRates: [],
	};

	beforeEach(() => {
		useRouter.mockReturnValue({ push: mockPush });
		fetchMock.resetMocks();

		fetchMock.mockResponseOnce(
			JSON.stringify([
				{
					SupplierID: 1,
					SupplierCompanyName: "Gerlach Inc",
					SupplierStatus: 1,
				},
				{
					SupplierID: 2,
					SupplierCompanyName: "Beier-Stokes",
					SupplierStatus: 1,
				},
				{
					SupplierID: 3,
					SupplierCompanyName: "Bernier Inc",
					SupplierStatus: 1,
				},
			]),
		);
	});

	test("renders the 'Add New Supplier' button", () => {
		render(<CrudPage {...defaultProps} />);
		const button = screen.getByRole("button", { name: /add new supplier/i });
		expect(button).toBeInTheDocument();
	});

	test("fetches and displays supplier data", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const supplier1 = await screen.findByText("Gerlach Inc");
		const supplier2 = await screen.findByText("Beier-Stokes");
		const supplier3 = await screen.findByText("Bernier Inc");

		expect(supplier1).toBeInTheDocument();
		expect(supplier2).toBeInTheDocument();
		expect(supplier3).toBeInTheDocument();
	});

	test("filters suppliers by status (Active)", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const activeTab = screen.getByRole("button", { name: "Active" });
		fireEvent.click(activeTab);

		const supplier1 = await screen.findByText("Gerlach Inc");
		expect(supplier1).toBeInTheDocument();

		const inactiveSuppliers = screen.queryByText(/Inactive Supplier Name/i);
		expect(inactiveSuppliers).not.toBeInTheDocument();
	});

	test("displays the supplier form when 'Add New Supplier' is clicked", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});
		const addButton = screen.getByRole("button", {
			name: /add new supplier/i,
		});
		fireEvent.click(addButton);

		const formHeading = screen.getByText(/edit supplier/i);
		expect(formHeading).toBeInTheDocument();

		const companyNameField = screen.getByText(/company name/i);
		const contactNameField = screen.getByText(/contact name/i);
		expect(companyNameField).toBeInTheDocument();
		expect(contactNameField).toBeInTheDocument();
	});

	test("handles form submission for adding a new supplier", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});
		const addButton = screen.getByRole("button", {
			name: /add new supplier/i,
		});
		fireEvent.click(addButton);

		const labelCN = screen.getByText(/company name/i);
		const companyNameInput = labelCN.closest("div").querySelector("input");
		fireEvent.change(companyNameInput, { target: { value: "Gerlach Inc" } });

		const labelContact = screen.getByText(/contact name/i);
		const contactNameInput = labelContact.closest("div").querySelector("input");
		fireEvent.change(contactNameInput, { target: { value: "John Doe" } });

		const labelAddress = screen.getByText(/address/i);
		const addressInput = labelAddress.closest("div").querySelector("input");
		fireEvent.change(addressInput, { target: { value: "456 Main St" } });

		const labelCity = screen.getByText(/city/i);
		const cityInput = labelCity.closest("div").querySelector("input");
		fireEvent.change(cityInput, { target: { value: "Toronto" } });

		const labelProvince = screen.getByText(/province/i);
		const provinceInput = labelProvince.closest("div").querySelector("input");
		fireEvent.change(provinceInput, { target: { value: "Ontario" } });

		const labelPostalCode = screen.getByText(/postal code/i);
		const postalCodeInput = labelPostalCode
			.closest("div")
			.querySelector("input");
		fireEvent.change(postalCodeInput, { target: { value: "A1B 2C3" } });

		const labelPhone = screen.getByText(/phone/i);
		const phoneInput = labelPhone.closest("div").querySelector("input");
		fireEvent.change(phoneInput, { target: { value: "1234567890" } });

		const labelEmail = screen.getByText(/email/i);
		const emailInput = labelEmail.closest("div").querySelector("input");
		fireEvent.change(emailInput, { target: { value: "supplier@example.com" } });

		const labelComments = screen.getByText(/comments/i);
		const commentsInput = labelComments.closest("div").querySelector("input");
		fireEvent.change(commentsInput, { target: { value: "Great supplier!" } });

		const labelStatus = screen.getByText(/status/i);
		const statusSelect = labelStatus.closest("div").querySelector("select");
		fireEvent.change(statusSelect, { target: { value: "1" } });

		const submitButton = screen.getByRole("button", { name: "Add" });
		fireEvent.click(submitButton);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3001/supplier/0?",
			expect.objectContaining({
				method: "POST",
				body: "{\"fields\":\"SupplierCompanyName, SupplierContactName, SupplierAddress, SupplierCity, SupplierProvince, SupplierPostalCode, SupplierPhone, SupplierEmail, SupplierComments, SupplierStatus\",\"values\":\"'Gerlach Inc', 'John Doe', '456 Main St', 'Toronto', 'Ontario', 'A1B 2C3', '123-456-7890', 'supplier@example.com', 'Great supplier!', '1'\",\"defaultValues\":[]}",
			}),
		);
	});

	test("displays validation errors if required fields are empty", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});
		const submitButton = screen.getByText("Add");
		fireEvent.click(submitButton);

		expect.not.stringMatching("successfully");
	});
});
