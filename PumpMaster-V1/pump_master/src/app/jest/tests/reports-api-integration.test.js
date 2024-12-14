import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ReportPage } from "@/app/Components/ReportsComponents/ReportPage";

jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: jest.fn(),
	}),
}));

global.fetch = jest.fn();

describe("API Integration", () => {
	const mockConfig = {
		title: "Test Report",
		baseEndpoint: "/api/reports/test",
		requiresDateRange: true,
		requiresCustomer: true,
		columns: [
			{ header: "Column1", key: "col1" },
			{ header: "Column2", key: "col2" },
		],
	};

	beforeEach(() => {
		fetch.mockReset();
	});

	const selectCustomerAndDates = async () => {
		await act(async () => {
			await userEvent.selectOptions(screen.getByRole("combobox"), "1");
			await userEvent.click(screen.getByText("Preview Report"));
		});

		await act(async () => {
			const dateRange = screen.getByLabelText("Quick Select");
			await userEvent.selectOptions(dateRange, "custom");
			const startDate = screen.getByLabelText("Start Date");
			const endDate = screen.getByLabelText("End Date");
			await userEvent.type(startDate, "2024-01-01");
			await userEvent.type(endDate, "2024-01-31");
			await userEvent.click(screen.getByText("Preview Report"));
		});
	};

	it("constructs correct API URL with parameters", async () => {
		fetch
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve([{ CustomerID: "1", CustomerName: "Test Customer" }]),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve([]),
			});

		await act(async () => {
			render(
				<ReportPage
					config={{
						...mockConfig,
						additionalParams: {
							param1: "value1",
							param2: "value2",
						},
					}}
				/>,
			);
		});

		await selectCustomerAndDates();

		expect(fetch).toHaveBeenCalledWith(
			expect.stringMatching(
				/\/api\/reports\/test.*customerId=1.*startDate=2024-01-01.*endDate=2024-01-31/,
			),
		);
	});

	it("handles 404 response", async () => {
		fetch
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve([{ CustomerID: "1", CustomerName: "Test Customer" }]),
			})
			.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

		await act(async () => {
			render(<ReportPage config={mockConfig} />);
		});

		await selectCustomerAndDates();

		await waitFor(() => {
			expect(screen.getByText("Error loading report")).toBeInTheDocument();
		});
	});

	it("handles network error", async () => {
		fetch
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve([{ CustomerID: "1", CustomerName: "Test Customer" }]),
			})
			.mockRejectedValueOnce(new Error("Network error"));

		await act(async () => {
			render(<ReportPage config={mockConfig} />);
		});

		await selectCustomerAndDates();

		await waitFor(() => {
			expect(screen.getByText("Error loading report")).toBeInTheDocument();
		});
	});

	it("processes custom data transformations", async () => {
		fetch
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve([{ CustomerID: "1", CustomerName: "Test Customer" }]),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve([{ col1: "raw1", col2: "raw2" }]),
			});

		const customConfig = {
			...mockConfig,
			onDataReceived: async (data) => {
				return data.map((item) => ({
					col1: item.col1.toUpperCase(),
					col2: item.col2.toUpperCase(),
				}));
			},
		};

		await act(async () => {
			render(<ReportPage config={customConfig} />);
		});

		await selectCustomerAndDates();

		await waitFor(() => {
			const tableCells = screen.getAllByRole("cell");
			expect(tableCells[0]).toHaveTextContent("RAW1");
			expect(tableCells[1]).toHaveTextContent("RAW2");
		});
	});
});
