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

describe("Job Type Page", () => {
	const mockPush = jest.fn();
	const defaultProps = {
		entityName: "job type",
		entityTable: "JobType",
		getDisplayName: "JobTypeName",
		fetchLink: "jobtype",
		fields: [
			{
				label: "Job Type Name",
				name: "jobTypeName",
				required: true,
				value: "",
				columnName: "JobTypeName",
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
					JobTypeID: 1,
					JobTypeName: "Commercial",
				},
				{
					JobTypeID: 2,
					JobTypeName: "Concrete Plant",
				},
				{
					JobTypeID: 3,
					JobTypeName: "Cribbing Contractor",
				},
			]),
		);
	});

	test("renders the 'Add New Job Type' button", () => {
		render(<CrudPage {...defaultProps} />);
		const button = screen.getByRole("button", { name: /add new job type/i });
		expect(button).toBeInTheDocument();
	});

	test("fetches and displays job type data", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const jobType1 = await screen.findByText("Commercial");
		const jobType2 = await screen.findByText("Concrete Plant");
		const jobType3 = await screen.findByText("Cribbing Contractor");

		expect(jobType1).toBeInTheDocument();
		expect(jobType2).toBeInTheDocument();
		expect(jobType3).toBeInTheDocument();
	});

	test("displays the job type form when 'Add New Job Type' is clicked", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});

		const addButton = screen.getByRole("button", {
			name: /add new job type/i,
		});
		fireEvent.click(addButton);

		const formHeading = screen.getByText(/edit job type/i);
		expect(formHeading).toBeInTheDocument();

		const jobTypeNameField = screen.getByText(/job type name/i);
		expect(jobTypeNameField).toBeInTheDocument();
	});

	test("handles form submission for adding a new job type", async () => {
		await act(async () => {
			render(<CrudPage {...defaultProps} />);
		});
		const addButton = screen.getByRole("button", {
			name: /add new job type/i,
		});
		fireEvent.click(addButton);

		const labelJobTypeName = screen.getByText(/job type name/i);
		const jobTypeNameInput = labelJobTypeName
			.closest("div")
			.querySelector("input");
		fireEvent.change(jobTypeNameInput, {
			target: { value: "Flatwork Contractor" },
		});

		const submitButton = screen.getByRole("button", { name: "Add" });
		fireEvent.click(submitButton);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3001/jobtype/0?",
			expect.objectContaining({
				method: "POST",
				body: '{"fields":"JobTypeName","values":"\'Flatwork Contractor\'","defaultValues":[]}',
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
