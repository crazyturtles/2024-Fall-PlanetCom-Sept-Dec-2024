import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import JobCRUD from "../../Components/JobCRUD";

fetchMock.enableMocks();

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		replace: jest.fn(),
	})),
	useSearchParams: jest.fn(() => ({
		get: jest.fn(() => "2024-01-01"),
	})),
}));

describe("JobCRUD Component", () => {
	const defaultProps = {
		entityName: "Job",
		entityTable: "JobTable",
		fetchLink: "jobs",
		onOpenForm: jest.fn(),
	};

	beforeEach(() => {
		fetchMock.resetMocks();

		fetchMock.mockIf(/^http:\/\/localhost:3001\/jobs\?date=2024-01-01$/, () =>
			Promise.resolve(
				JSON.stringify({
					jobs: [],
					pourTypes: [],
				}),
			),
		);
	});

	test("renders the JobCRUD component correctly", async () => {
		await act(async () => {
			render(<JobCRUD {...defaultProps} />);
		});

		expect(screen.getByTestId("dashboard-heading")).toHaveTextContent(
			"Job Dashboard",
		);

		expect(
			screen.getByRole("button", { name: /Monday, January 1, 2024/i }),
		).toBeInTheDocument();
	});

	test("displays the selected date in ISO format for testing", async () => {
		await act(async () => {
			render(<JobCRUD {...defaultProps} />);
		});

		const selectedDate = new Date("2024-01-01T00:00:00Z");
		const offsetDate = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000);
		const expectedDate = offsetDate.toISOString();

		expect(screen.getByTestId("selected-date")).toHaveTextContent(expectedDate);
	});

	test("toggles the time counter visibility", async () => {
		await act(async () => {
			render(<JobCRUD {...defaultProps} />);
		});

		const timeButton = screen.getByTestId("toggle-time-counter");
		fireEvent.click(timeButton);

		expect(screen.getByText("Current Time:")).toBeInTheDocument();

		fireEvent.click(timeButton);
		expect(screen.queryByText("Current Time:")).not.toBeInTheDocument();
	});

	test("handles empty jobs response gracefully", async () => {
		await act(async () => {
			render(<JobCRUD {...defaultProps} />);
		});

		expect(
			await screen.findByText("No jobs found for this date."),
		).toBeInTheDocument();
	});

	test("fetchJobs function handles data properly", async () => {
		fetchMock.mockIf(/^http:\/\/localhost:3001\/jobs\?date=2024-01-01$/, () =>
			Promise.resolve(
				JSON.stringify({
					jobs: [
						{
							JobID: 1,
							JobCompanyJobNum: "1234",
							JobStatus: 10,
							JobStartTime: "2024-01-01T08:00:00Z",
							PumpTypeName: "Pump A",
							UnitNumber: "Unit 1",
							DriverName: "John Doe",
							JobTotalPoured: 50,
							JobColor: "#FFFFFF",
							PourTypes: ["Type A", "Type B"],
						},
					],
					pourTypes: [
						{ JobID: 1, PourTypeName: "Type A" },
						{ JobID: 1, PourTypeName: "Type B" },
					],
				}),
			),
		);

		await act(async () => {
			render(<JobCRUD {...defaultProps} />);
		});

		expect(await screen.findByText("1234")).toBeInTheDocument();

		expect(screen.getByText("Type A, Type B")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});
});
