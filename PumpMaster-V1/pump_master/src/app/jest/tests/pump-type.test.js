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

describe("Pump Type Page", () => {
	const mockPush = jest.fn();
	const defaultProps = {
		entityName: "pump type",
		entityTable: "PumpType",
		getDisplayName: "PumpTypeName",
		fetchLink: "pumptype",
		fields: [
			{
				label: "Pump Type Name",
				name: "pumpTypeName",
				required: true,
				value: "",
				columnName: "PumpTypeName",
			},
			{
				label: "Comments",
				name: "comments",
				required: true,
				value: "",
				columnName: "Comments",
			},
			{
				label: "Hourly Rate",
				name: "hourlyRate",
				required: true,
				value: "",
				sign: "$",
				columnName: "HourlyRate",
			},
			{
				label: "Pour Rate",
				name: "pourRate",
				required: true,
				value: "",
				sign: "$",
				columnName: "PourRate",
			},
			{
				label: "Washout Rate",
				name: "washoutRate",
				required: true,
				value: "",
				sign: "$",
				columnName: "WashoutRate",
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
					PumpTypeID: 1,
					PumpTypeName: "28m",
					Status: 1,
				},
				{
					PumpTypeID: 2,
					PumpTypeName: "36Z",
					Status: 1,
				},
				{
					PumpTypeID: 3,
					PumpTypeName: "310C Boom Picker",
					Status: 1,
				},
			]),
		);
	});

	test("renders the 'Add New Pump Type' button", () => {
		render(<CrudPage {...defaultProps} />);
		const button = screen.getByRole("button", { name: /add new pump type/i });
		expect(button).toBeInTheDocument();
	});

	test("fetches and displays pump type data", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const pumpType1 = await screen.findByText("28m");
		const pumpType2 = await screen.findByText("36Z");
		const pumpType3 = await screen.findByText("310C Boom Picker");

		expect(pumpType1).toBeInTheDocument();
		expect(pumpType2).toBeInTheDocument();
		expect(pumpType3).toBeInTheDocument();
	});

	test("displays the pump type form when 'Add New Pump Type' is clicked", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", {
			name: /add new pump type/i,
		});
		fireEvent.click(addButton);

		const formHeading = screen.getByText(/edit pump type/i);
		expect(formHeading).toBeInTheDocument();

		const pumpTypeNameField = screen.getByText(/pump type name/i);
		const commentsField = screen.getByText(/comments/i);
		expect(pumpTypeNameField).toBeInTheDocument();
		expect(commentsField).toBeInTheDocument();
	});

	test("handles form submission for adding a new pump type", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", {
			name: /add new pump type/i,
		});
		fireEvent.click(addButton);

		const labelPumpTypeName = screen.getByText(/pump type name/i);
		const pumpTypeNameInput = labelPumpTypeName
			.closest("div")
			.querySelector("input");
		fireEvent.change(pumpTypeNameInput, { target: { value: "42m" } });

		const labelComments = screen.getByText(/comments/i);
		const commentsInput = labelComments.closest("div").querySelector("input");
		fireEvent.change(commentsInput, {
			target: { value: "Large pump for high-rise projects" },
		});

		const labelHourlyRate = screen.getByText(/hourly rate/i);
		const hourlyRateInput = labelHourlyRate
			.closest("div")
			.querySelector("input");
		fireEvent.change(hourlyRateInput, { target: { value: "150" } });

		const labelPourRate = screen.getByText(/pour rate/i);
		const pourRateInput = labelPourRate.closest("div").querySelector("input");
		fireEvent.change(pourRateInput, { target: { value: "200" } });

		const labelWashoutRate = screen.getByText(/washout rate/i);
		const washoutRateInput = labelWashoutRate
			.closest("div")
			.querySelector("input");
		fireEvent.change(washoutRateInput, { target: { value: "50" } });

		const labelStatus = screen.getByText(/status/i);
		const statusSelect = labelStatus.closest("div").querySelector("select");
		fireEvent.change(statusSelect, { target: { value: "1" } });

		const submitButton = screen.getByRole("button", { name: "Add" });
		fireEvent.click(submitButton);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3001/pumptype/0?",
			expect.objectContaining({
				method: "POST",
				body: "{\"fields\":\"PumpTypeName, Comments, HourlyRate, PourRate, WashoutRate, Status\",\"values\":\"'42m', 'Large pump for high-rise projects', '150', '200', '50', '1'\",\"defaultValues\":[]}",
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
