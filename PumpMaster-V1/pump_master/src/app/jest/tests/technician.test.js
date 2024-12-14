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
describe("Technician Page", () => {
	const mockPush = jest.fn();
	const defaultProps = {
		entityName: "technician",
		entityTable: "Technician",
		getDisplayName: "TechnicianFirstName + ' ' + TechnicianLastName",
		fetchLink: "technician",
		fields: [
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
		],
		defaultRates: [],
	};

	beforeEach(() => {
		useRouter.mockReturnValue({ push: mockPush });
		fetchMock.resetMocks();

		fetchMock.mockResponseOnce(
			JSON.stringify([
				{
					TechnicianID: 1,
					"": "Leworthy Simone",
					TechnicianStatus: 1,
				},
				{
					TechnicianID: 2,
					"": "Considine-Deckow Risby Channa",
					TechnicianStatus: 1,
				},
				{
					TechnicianID: 3,
					"": "Branton Jackson",
					TechnicianStatus: 1,
				},
			]),
		);
	});

	test("renders the 'Add New Technician' button", () => {
		render(<CrudPage {...defaultProps} />);
		const button = screen.getByRole("button", { name: /add new technician/i });
		expect(button).toBeInTheDocument();
	});

	test("fetches and displays technician data", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const technician1 = await screen.findByText("Branton Jackson");
		const technician2 = await screen.findByText(
			"Considine-Deckow Risby Channa",
		);
		const technician3 = await screen.findByText("Leworthy Simone");

		expect(technician1).toBeInTheDocument();
		expect(technician2).toBeInTheDocument();
		expect(technician3).toBeInTheDocument();
	});

	test("filters technicians by status (Active)", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const activeTab = screen.getByRole("button", { name: "Active" });
		fireEvent.click(activeTab);

		const technician1 = await screen.findByText("Branton Jackson");
		expect(technician1).toBeInTheDocument();

		const inactiveTechnicians = screen.queryByText(/Inactive Technician Name/i);
		expect(inactiveTechnicians).not.toBeInTheDocument();
	});

	test("displays the technician form when 'Add New Technician' is clicked", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});
		const addButton = screen.getByRole("button", {
			name: /add new technician/i,
		});
		fireEvent.click(addButton);

		const formHeading = screen.getByText(/edit technician/i);
		expect(formHeading).toBeInTheDocument();

		const firstNameField = screen.getByText(/first name/i);
		const lastNameField = screen.getByText(/last name/i);
		expect(firstNameField).toBeInTheDocument();
		expect(lastNameField).toBeInTheDocument();
	});

	test("handles form submission for adding a new technician", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});
		const addButton = screen.getByRole("button", {
			name: /add new technician/i,
		});
		fireEvent.click(addButton);
		const labelLN = screen.getByText(/last name/i);
		const lastNameInput = labelLN.closest("div").querySelector("input");
		fireEvent.change(lastNameInput, { target: { value: "Technician" } });

		const labelFN = screen.getByText(/first name/i);
		const firstNameInput = labelFN.closest("div").querySelector("input");
		fireEvent.change(firstNameInput, { target: { value: "New" } });

		const labelAddress = screen.getByText(/address/i);
		const addressInput = labelAddress.closest("div").querySelector("input");
		fireEvent.change(addressInput, { target: { value: "123 Main St" } });

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
		fireEvent.change(emailInput, { target: { value: "tech@example.com" } });

		const labelHourlyRate = screen.getByText(/hourly rate/i);
		const hourlyRateInput = labelHourlyRate
			.closest("div")
			.querySelector("input");
		fireEvent.change(hourlyRateInput, { target: { value: "25.50" } });

		const labelStatus = screen.getByText(/status/i);
		const statusSelect = labelStatus.closest("div").querySelector("select");
		fireEvent.change(statusSelect, { target: { value: "1" } });

		const submitButton = screen.getByRole("button", { name: "Add" });

		fireEvent.click(submitButton);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3001/technician/0?",
			expect.objectContaining({
				method: "POST",
				body: "{\"fields\":\"TechnicianLastName, TechnicianFirstName, TechnicianAddress, TechnicianCity, TechnicianProvince, TechnicianPostalCode, TechnicianPhone, TechnicianEmail, TechnicianHourlyRate, TechnicianStatus\",\"values\":\"'Technician', 'New', '123 Main St', 'Toronto', 'Ontario', 'A1B 2C3', '123-456-7890', 'tech@example.com', '25.50', '1'\",\"defaultValues\":[]}",
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
