import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import UnitStatus from "../../Components/UnitStatus";

fetchMock.enableMocks();

describe("UnitStatus Component", () => {
	const defaultProps = {
		fetchLink: "unit-status",
		filterDate: new Date("2024-01-01T00:00:00Z"),
	};

	beforeEach(() => {
		fetchMock.resetMocks();

		fetchMock.mockResponses(
			[
				JSON.stringify([
					{ UnitID: 1, UnitNumber: "Unit A" },
					{ UnitID: 2, UnitNumber: "Unit B" },
				]),
				{ status: 200 },
			],
			[
				JSON.stringify({
					jobs: [{ JobUnitID: 1 }, { JobUnitID: 1 }, { JobUnitID: 2 }],
				}),
				{ status: 200 },
			],
		);
	});

	test("renders the Unit Status button", () => {
		render(<UnitStatus {...defaultProps} />);
		const button = screen.getByRole("button", { name: /unit status/i });
		expect(button).toBeInTheDocument();
	});

	test("opens the Unit Availability modal when the button is clicked", async () => {
		render(<UnitStatus {...defaultProps} />);
		fireEvent.click(screen.getByRole("button", { name: /unit status/i }));
		const modalHeading = await screen.findByText(/unit availability/i);
		expect(modalHeading).toBeInTheDocument();
	});

	test("displays loading message while fetching units", async () => {
		await act(async () => {
			render(<UnitStatus {...defaultProps} />);
		});

		fireEvent.click(screen.getByRole("button", { name: /unit status/i }));
		const loadingMessage = await screen.findByText(/loading units/i);
		expect(loadingMessage).toBeInTheDocument();
	});

	test("fetches and renders unit data in the modal", async () => {
		await act(async () => {
			render(<UnitStatus {...defaultProps} />);
		});

		fireEvent.click(screen.getByRole("button", { name: /unit status/i }));

		const modalHeading = await screen.findByText(/unit availability/i);
		expect(modalHeading).toBeInTheDocument();

		const unitA = await screen.findByText("Unit A");
		const unitB = await screen.findByText("Unit B");

		expect(unitA).toBeInTheDocument();
		expect(unitB).toBeInTheDocument();
	});

	test("renders progress bars correctly based on job counts", async () => {
		fetchMock.mockResponses(
			[
				JSON.stringify([
					{ UnitID: 1, UnitNumber: "Unit A" },
					{ UnitID: 2, UnitNumber: "Unit B" },
				]),
				{ status: 200 },
			],
			[
				JSON.stringify({
					jobs: [{ JobUnitID: 1 }, { JobUnitID: 1 }, { JobUnitID: 2 }],
				}),
				{ status: 200 },
			],
		);

		await act(async () => {
			render(<UnitStatus {...defaultProps} />);
		});

		fireEvent.click(screen.getByRole("button", { name: /unit status/i }));

		const modalHeading = await screen.findByText(/unit availability/i);
		expect(modalHeading).toBeInTheDocument();

		const computeExpectedWidth = (count) =>
			`${Math.round((count / 7) * 100 * 100) / 100}%`;

		const unitA = await screen.findByText("Unit A");
		const unitAContainer = unitA?.closest("li");
		expect(unitAContainer).not.toBeNull();

		if (unitAContainer) {
			const unitAProgressBar = unitAContainer.querySelector(".bg-blue-500");
			expect(unitAProgressBar).not.toBeNull();
			if (unitAProgressBar) {
				expect(unitAProgressBar).toHaveStyle(
					`width: ${computeExpectedWidth(2)}`,
				);
			}
		}

		const unitB = await screen.findByText("Unit B");
		const unitBContainer = unitB?.closest("li");
		expect(unitBContainer).not.toBeNull();

		if (unitBContainer) {
			const unitBProgressBar = unitBContainer.querySelector(".bg-blue-500");
			expect(unitBProgressBar).not.toBeNull();
			if (unitBProgressBar) {
				expect(unitBProgressBar).toHaveStyle(
					`width: ${computeExpectedWidth(1)}`,
				);
			}
		}
	});
});
