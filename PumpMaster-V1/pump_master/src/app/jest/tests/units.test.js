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

describe("Unit Page", () => {
	const mockPush = jest.fn();
	const defaultProps = {
		entityName: "unit",
		entityTable: "Unit",
		getDisplayName: "UnitNumber",
		fetchLink: "unit",
		fields: [
			{
				label: "Unit Number",
				name: "unitNumber",
				required: true,
				value: "",
				columnName: "UnitNumber",
			},
			{
				label: "Pump Type",
				name: "pumpType",
				type: "select",
				required: true,
				value: "",
				columnName: "PumpType",
				selectItems: [
					{ value: "Concrete Pump", label: "Concrete Pump" },
					{ value: "Boom Pump", label: "Boom Pump" },
				],
			},
			{
				label: "Operator",
				name: "operator",
				type: "select",
				required: true,
				value: "",
				columnName: "Operator",
				selectItems: [
					{ value: "Operator1", label: "Operator 1" },
					{ value: "Operator2", label: "Operator 2" },
				],
			},
			{
				label: "Make",
				name: "make",
				required: true,
				value: "",
				columnName: "Make",
			},
			{
				label: "Manufacturer",
				name: "manufacturer",
				required: true,
				value: "",
				columnName: "Manufacturer",
			},
			{
				label: "Serial Number",
				name: "serialNumber",
				required: true,
				value: "",
				columnName: "SerialNumber",
			},
			{
				label: "License Plate#",
				name: "licensePlate",
				required: true,
				value: "",
				columnName: "LicensePlate",
			},
			{
				label: "CVI Expiry Date",
				name: "cviExpiryDate",
				type: "date",
				required: true,
				value: "",
				columnName: "CVIExpiryDate",
			},
			{
				label: "Boom Pipe Changed",
				name: "boomPipeChanged",
				type: "date",
				required: true,
				value: "",
				columnName: "BoomPipeChanged",
			},
			{
				label: "Deck Pipe Changed",
				name: "deckPipeChanged",
				type: "date",
				required: false,
				value: "",
				columnName: "DeckPipeChanged",
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
		],
		defaultRates: [],
	};

	beforeEach(() => {
		useRouter.mockReturnValue({ push: mockPush });
		fetchMock.resetMocks();

		fetchMock.mockResponseOnce(
			JSON.stringify([
				{
					UnitID: 1,
					UnitNumber: "332G",
					Status: 1,
				},
				{
					UnitID: 2,
					UnitNumber: "F150",
					Status: 1,
				},
				{
					UnitID: 3,
					UnitNumber: "Phantom",
					Status: 1,
				},
			]),
		);
	});

	test("renders the 'Add New Unit' button", () => {
		render(<CrudPage {...defaultProps} />);
		const button = screen.getByRole("button", { name: /add new unit/i });
		expect(button).toBeInTheDocument();
	});

	test("fetches and displays unit data", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const unit1 = await screen.findByText("332G");
		const unit2 = await screen.findByText("F150");
		const unit3 = await screen.findByText("Phantom");

		expect(unit1).toBeInTheDocument();
		expect(unit2).toBeInTheDocument();
		expect(unit3).toBeInTheDocument();
	});

	test("displays the unit form when 'Add New Unit' is clicked", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", { name: /add new unit/i });
		fireEvent.click(addButton);

		const formHeading = screen.getByText(/edit unit/i);
		expect(formHeading).toBeInTheDocument();

		const unitNumberField = screen.getByText(/unit number/i);
		const pumpTypeField = screen.getByText(/pump type/i);
		expect(unitNumberField).toBeInTheDocument();
		expect(pumpTypeField).toBeInTheDocument();
	});

	test("handles form submission for adding a new unit", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", { name: /add new unit/i });
		fireEvent.click(addButton);

		const labelUnitNumber = screen.getByText(/unit number/i);
		const unitNumberInput = labelUnitNumber
			.closest("div")
			.querySelector("input");
		fireEvent.change(unitNumberInput, { target: { value: "Hino 14ft deck" } });

		const labelPumpType = screen.getByText(/pump type/i);
		const pumpTypeSelect = labelPumpType.closest("div").querySelector("select");
		fireEvent.change(pumpTypeSelect, { target: { value: "Boom Pump" } });

		const labelOperator = screen.getByText("Operator:");
		const operatorSelect = labelOperator.closest("div").querySelector("select");
		fireEvent.change(operatorSelect, { target: { value: "Operator1" } });

		const labelMake = screen.getByText(/make/i);
		const makeInput = labelMake.closest("div").querySelector("input");
		fireEvent.change(makeInput, { target: { value: "Hino" } });

		const labelManufacturer = screen.getByText(/manufacturer/i);
		const manufacturerInput = labelManufacturer
			.closest("div")
			.querySelector("input");
		fireEvent.change(manufacturerInput, { target: { value: "Toyota" } });

		const labelSerialNumber = screen.getByText(/serial number/i);
		const serialNumberInput = labelSerialNumber
			.closest("div")
			.querySelector("input");
		fireEvent.change(serialNumberInput, { target: { value: "SN12345" } });

		const labelLicensePlate = screen.getByText(/license plate#/i);
		const licensePlateInput = labelLicensePlate
			.closest("div")
			.querySelector("input");
		fireEvent.change(licensePlateInput, { target: { value: "ABC123" } });

		const labelCVIExpiryDate = screen.getByText(/cvi expiry date/i);
		const cviExpiryDateInput = labelCVIExpiryDate
			.closest("div")
			.querySelector("input");
		fireEvent.change(cviExpiryDateInput, { target: { value: "2025-01-01" } });

		const labelBoomPipeChanged = screen.getByText(/boom pipe changed/i);
		const boomPipeChangedInput = labelBoomPipeChanged
			.closest("div")
			.querySelector("input");
		fireEvent.change(boomPipeChangedInput, { target: { value: "2024-12-12" } });

		const labelDeckPipeChanged = screen.getByText(/deck pipe changed/i);
		const deckPipeChangedInput = labelDeckPipeChanged
			.closest("div")
			.querySelector("input");
		fireEvent.change(deckPipeChangedInput, { target: { value: "2024-12-15" } });

		const labelStatus = screen.getByText(/status/i);
		const statusSelect = labelStatus.closest("div").querySelector("select");
		fireEvent.change(statusSelect, { target: { value: "1" } });

		const submitButton = screen.getByRole("button", { name: "Add" });
		fireEvent.click(submitButton);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3001/unit/0?",
			expect.objectContaining({
				method: "POST",
				body: "{\"fields\":\"UnitNumber, PumpType, Operator, Make, Manufacturer, SerialNumber, LicensePlate, CVIExpiryDate, BoomPipeChanged, DeckPipeChanged, Status\",\"values\":\"'Hino 14ft deck', '', '', 'Hino', 'Toyota', 'SN12345', 'ABC123', '2025-01-01', '2024-12-12', '2024-12-15', '1'\",\"defaultValues\":[]}",
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
