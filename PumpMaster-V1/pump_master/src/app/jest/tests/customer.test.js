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

describe("Customer Page", () => {
	const mockPush = jest.fn();
	const defaultProps = {
		entityName: "customer",
		entityTable: "Customer",
		getDisplayName: "CompanyName",
		fetchLink: "customer",
		fields: [
			{
				label: "Company Name",
				name: "companyName",
				required: true,
				value: "",
				columnName: "CompanyName",
			},
			{
				label: "Last Name",
				name: "lastName",
				required: true,
				value: "",
				columnName: "LastName",
			},
			{
				label: "First Name",
				name: "firstName",
				required: true,
				value: "",
				columnName: "FirstName",
			},
			{
				label: "Address",
				name: "address",
				required: true,
				value: "",
				columnName: "Address",
			},
			{
				label: "City",
				name: "city",
				required: true,
				value: "",
				columnName: "City",
			},
			{
				label: "Province",
				name: "province",
				required: true,
				value: "",
				columnName: "Province",
			},
			{
				label: "Postal Code",
				name: "postalCode",
				required: true,
				value: "",
				columnName: "PostalCode",
			},
			{
				label: "Phone",
				name: "phone",
				required: true,
				value: "",
				columnName: "Phone",
			},
			{
				label: "Cell",
				name: "cell",
				required: true,
				value: "",
				columnName: "Cell",
			},
			{
				label: "Email",
				name: "email",
				required: true,
				value: "",
				columnName: "Email",
			},
			{
				label: "Comments",
				name: "comments",
				required: false,
				value: "",
				columnName: "Comments",
			},
			{
				label: "Status",
				name: "status",
				type: "select",
				required: true,
				value: "1",
				columnName: "Status",
				selectItems: [{ 0: "Inactive" }, { 1: "Active" }],
			},
			{
				label: "Simply ID",
				name: "simplyId",
				required: true,
				value: "",
				columnName: "SimplyID",
			},
			{
				label: "Invoice Terms",
				name: "invoiceTerms",
				required: false,
				value: "",
				columnName: "InvoiceTerms",
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
					CustomerID: 1,
					CompanyName: "Abshire-Toy",
					Status: 1,
				},
				{
					CustomerID: 2,
					CompanyName: "Bailey LLC",
					Status: 1,
				},
				{
					CustomerID: 3,
					CompanyName: "Bayer Inc",
					Status: 1,
				},
			]),
		);
	});

	test("renders the 'Add New Customer' button", () => {
		render(<CrudPage {...defaultProps} />);
		const button = screen.getByRole("button", { name: /add new customer/i });
		expect(button).toBeInTheDocument();
	});

	test("fetches and displays customer data", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const customer1 = await screen.findByText("Abshire-Toy");
		const customer2 = await screen.findByText("Bailey LLC");
		const customer3 = await screen.findByText("Bayer Inc");

		expect(customer1).toBeInTheDocument();
		expect(customer2).toBeInTheDocument();
		expect(customer3).toBeInTheDocument();
	});

	test("displays the customer form when 'Add New Customer' is clicked", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", { name: /add new customer/i });
		fireEvent.click(addButton);

		const formHeading = screen.getByText(/edit customer/i);
		expect(formHeading).toBeInTheDocument();

		const companyNameField = screen.getByText(/company name/i);
		const lastNameField = screen.getByText(/last name/i);
		expect(companyNameField).toBeInTheDocument();
		expect(lastNameField).toBeInTheDocument();
	});

	test("handles form submission for adding a new customer", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", { name: /add new customer/i });
		fireEvent.click(addButton);

		const labelCompanyName = screen.getByText(/company name/i);
		const companyNameInput = labelCompanyName
			.closest("div")
			.querySelector("input");
		fireEvent.change(companyNameInput, {
			target: { value: "Anderson-Hackett" },
		});

		const labelLastName = screen.getByText(/last name/i);
		const lastNameInput = labelLastName.closest("div").querySelector("input");
		fireEvent.change(lastNameInput, { target: { value: "Hackett" } });

		const labelFirstName = screen.getByText(/first name/i);
		const firstNameInput = labelFirstName.closest("div").querySelector("input");
		fireEvent.change(firstNameInput, { target: { value: "John" } });

		const labelAddress = screen.getByText(/address/i);
		const addressInput = labelAddress.closest("div").querySelector("input");
		fireEvent.change(addressInput, { target: { value: "123 Elm St" } });

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
		fireEvent.change(postalCodeInput, { target: { value: "M1A 1A1" } });

		const labelPhone = screen.getByText(/phone/i);
		const phoneInput = labelPhone.closest("div").querySelector("input");
		fireEvent.change(phoneInput, { target: { value: "1234567890" } });

		const labelCell = screen.getByText(/cell/i);
		const cellInput = labelCell.closest("div").querySelector("input");
		fireEvent.change(cellInput, { target: { value: "0987654321" } });

		const labelEmail = screen.getByText(/email/i);
		const emailInput = labelEmail.closest("div").querySelector("input");
		fireEvent.change(emailInput, {
			target: { value: "john.hackett@example.com" },
		});

		const labelComments = screen.getByText(/comments/i);
		const commentsInput = labelComments.closest("div").querySelector("input");
		fireEvent.change(commentsInput, { target: { value: "VIP Customer" } });

		const labelStatus = screen.getByText(/status/i);
		const statusSelect = labelStatus.closest("div").querySelector("select");
		fireEvent.change(statusSelect, { target: { value: "1" } });

		const labelSimplyID = screen.getByText(/simply id/i);
		const simplyIDInput = labelSimplyID.closest("div").querySelector("input");
		fireEvent.change(simplyIDInput, { target: { value: "CUST12345" } });

		const labelInvoiceTerms = screen.getByText(/invoice terms/i);
		const invoiceTermsInput = labelInvoiceTerms
			.closest("div")
			.querySelector("input");
		fireEvent.change(invoiceTermsInput, { target: { value: "Net 30" } });

		const submitButton = screen.getByRole("button", { name: "Add" });
		fireEvent.click(submitButton);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3001/customer/0?",
			expect.objectContaining({
				method: "POST",
				body: "{\"fields\":\"CompanyName, LastName, FirstName, Address, City, Province, PostalCode, Phone, Cell, Email, Comments, Status, SimplyID, InvoiceTerms\",\"values\":\"'Anderson-Hackett', 'Hackett', 'John', '123 Elm St', 'Toronto', 'Ontario', 'M1A 1A1', '1234567890', '0987654321', 'john.hackett@example.com', 'VIP Customer', '1', 'CUST12345', 'Net 30'\",\"defaultValues\":[]}",
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
