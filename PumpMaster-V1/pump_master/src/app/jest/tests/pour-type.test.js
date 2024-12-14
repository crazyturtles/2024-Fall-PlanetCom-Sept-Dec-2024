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

describe("Pour Type Page", () => {
	const mockPush = jest.fn();
	const defaultProps = {
		entityName: "pour type",
		entityTable: "PourType",
		getDisplayName: "PourTypeName",
		fetchLink: "pourtype",
		fields: [
			{
				label: "Pour Type Name",
				name: "pourTypeName",
				required: true,
				value: "",
				columnName: "PourTypeName",
			},
			{
				label: "Comments",
				name: "pourComments",
				required: true,
				value: "",
				columnName: "PourComments",
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
				label: "Status",
				name: "pourStatus",
				type: "select",
				required: true,
				value: "1",
				columnName: "PourStatus",
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
				{ PourTypeID: 1, PourTypeName: "Abutment", PourTypeStatus: 1 },
				{ PourTypeID: 2, PourTypeName: "Block Fill", PourTypeStatus: 1 },
				{ PourTypeID: 2, PourTypeName: "Deck Piles", PourTypeStatus: 1 },
			]),
		);
	});

	test("renders the 'Add New Pour Type' button", () => {
		render(<CrudPage {...defaultProps} />);
		const button = screen.getByRole("button", { name: /add new pour type/i });
		expect(button).toBeInTheDocument();
	});

	test("fetches and displays pour type data", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const pourType1 = await screen.findByText("Abutment");
		const pourType2 = await screen.findByText("Block Fill");
		const pourType3 = await screen.findByText("Deck Piles");

		expect(pourType1).toBeInTheDocument();
		expect(pourType2).toBeInTheDocument();
		expect(pourType3).toBeInTheDocument();
	});

	test("displays the pour type form when 'Add New Pour Type' is clicked", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", {
			name: /add new pour type/i,
		});
		fireEvent.click(addButton);

		const formHeading = screen.getByText(/edit pour type/i);
		expect(formHeading).toBeInTheDocument();

		const pourTypeNameField = screen.getByText(/pour type name/i);
		const commentsField = screen.getByText(/comments/i);
		expect(pourTypeNameField).toBeInTheDocument();
		expect(commentsField).toBeInTheDocument();
	});

	test("handles form submission for adding a new pour type", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", {
			name: /add new pour type/i,
		});
		fireEvent.click(addButton);

		const labelPourTypeName = screen.getByText(/pour type name/i);
		const pourTypeNameInput = labelPourTypeName
			.closest("div")
			.querySelector("input");
		fireEvent.change(pourTypeNameInput, { target: { value: "Columns" } });

		const labelComments = screen.getByText(/comments/i);
		const commentsInput = labelComments.closest("div").querySelector("input");
		fireEvent.change(commentsInput, { target: { value: "Column pour" } });

		const labelPourRate = screen.getByText(/pour rate/i);
		const pourRateInput = labelPourRate.closest("div").querySelector("input");
		fireEvent.change(pourRateInput, { target: { value: "75" } });

		const labelStatus = screen.getByText(/status/i);
		const statusSelect = labelStatus.closest("div").querySelector("select");
		fireEvent.change(statusSelect, { target: { value: "1" } });

		const submitButton = screen.getByRole("button", { name: "Add" });
		fireEvent.click(submitButton);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3001/pourtype/0?",
			expect.objectContaining({
				method: "POST",
				body: '{"fields":"PourTypeName, PourComments, PourRate, PourStatus","values":"\'Columns\', \'Column pour\', \'75\', \'1\'","defaultValues":[]}',
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
