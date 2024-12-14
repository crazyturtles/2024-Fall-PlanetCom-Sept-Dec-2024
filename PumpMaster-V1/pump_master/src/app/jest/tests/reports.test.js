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

describe("ReportPage", () => {
	const mockConfig = {
		title: "Test Report",
		baseEndpoint: "/api/reports/test",
		requiresDateRange: true,
		requiresCustomer: true,
		columns: [
			{ header: "Column1", key: "col1", align: "left" },
			{ header: "Column2", key: "col2", align: "right" },
		],
	};

	const mockData = [{ col1: "Value1", col2: "Value2" }];

	beforeEach(() => {
		fetch.mockReset();
		localStorage.clear();
	});

	describe("Customer Selection", () => {
		it("shows customer modal when requiresCustomer is true", async () => {
			await act(async () => {
				render(<ReportPage config={mockConfig} />);
			});
			expect(screen.getByText("Select Customer")).toBeInTheDocument();
		});

		it("fetches data after customer selection", async () => {
			fetch
				.mockImplementationOnce(() =>
					Promise.resolve({
						ok: true,
						json: () =>
							Promise.resolve([
								{ CustomerID: "1", CustomerName: "Test Customer" },
							]),
					}),
				)
				.mockImplementationOnce(() =>
					Promise.resolve({
						ok: true,
						json: () => Promise.resolve([{ col1: "Value1", col2: "Value2" }]),
					}),
				);

			render(<ReportPage config={mockConfig} />);

			await waitFor(() => {
				expect(screen.getByLabelText("Customer")).not.toBeDisabled();
			});

			await userEvent.selectOptions(screen.getByLabelText("Customer"), "1");
			await userEvent.click(
				screen.getByRole("button", { name: /Preview Report/i }),
			);

			await waitFor(() => {
				expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
			});

			await userEvent.type(screen.getByLabelText("Start Date"), "2024-01-01");
			await userEvent.type(screen.getByLabelText("End Date"), "2024-01-31");
			await userEvent.click(
				screen.getByRole("button", { name: /Preview Report/i }),
			);

			await waitFor(() => {
				expect(fetch).toHaveBeenCalledTimes(2);
				expect(fetch.mock.calls[1][0]).toContain("customerId=1");
			});
		});
	});

	describe("Date Selection", () => {
		beforeEach(() => {
			fetch.mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve([
							{ CustomerID: "1", CustomerName: "Test Customer" },
						]),
				}),
			);
		});

		it("shows date modal when requiresDateRange is true", async () => {
			const configWithoutCustomer = { ...mockConfig, requiresCustomer: false };
			await act(async () => {
				render(<ReportPage config={configWithoutCustomer} />);
			});
			await waitFor(() => {
				expect(screen.getByText("Select Date Range")).toBeInTheDocument();
			});
		});

		it("validates date range selection", async () => {
			const configWithoutCustomer = { ...mockConfig, requiresCustomer: false };
			await act(async () => {
				render(<ReportPage config={configWithoutCustomer} />);
			});

			await waitFor(() => {
				const dateModal = screen.getByText("Select Date Range");
				expect(dateModal).toBeInTheDocument();
			});

			await act(async () => {
				const startDate = screen.getByLabelText("Start Date");
				const endDate = screen.getByLabelText("End Date");
				await userEvent.type(startDate, "2024-01-01");
				await userEvent.type(endDate, "2023-12-31");
			});

			expect(
				screen.getByRole("button", { name: "Preview Report" }),
			).toBeDisabled();
		});

		it("enables preview button with valid date range", async () => {
			const configWithoutCustomer = { ...mockConfig, requiresCustomer: false };
			await act(async () => {
				render(<ReportPage config={configWithoutCustomer} />);
			});

			await waitFor(() => {
				const dateModal = screen.getByText("Select Date Range");
				expect(dateModal).toBeInTheDocument();
			});

			await act(async () => {
				const startDate = screen.getByLabelText("Start Date");
				const endDate = screen.getByLabelText("End Date");
				await userEvent.type(startDate, "2024-01-01");
				await userEvent.type(endDate, "2024-01-31");
			});

			expect(
				screen.getByRole("button", { name: "Preview Report" }),
			).toBeEnabled();
		});
	});

	describe("Data Fetching", () => {
		it("handles successful data fetch", async () => {
			fetch.mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockData),
				}),
			);

			await act(async () => {
				render(
					<ReportPage
						config={{
							...mockConfig,
							requiresCustomer: false,
							requiresDateRange: false,
						}}
					/>,
				);
			});

			await waitFor(
				() => {
					expect(screen.getAllByRole("cell")[0]).toHaveTextContent("Value1");
					expect(screen.getAllByRole("cell")[1]).toHaveTextContent("Value2");
				},
				{ timeout: 3000 },
			);
		});

		it("displays error message on fetch failure", async () => {
			fetch.mockImplementation(() =>
				Promise.reject(new Error("Failed to fetch")),
			);

			await act(async () => {
				render(
					<ReportPage
						config={{
							...mockConfig,
							requiresCustomer: false,
							requiresDateRange: false,
						}}
					/>,
				);
			});

			await waitFor(() => {
				expect(screen.getByText(/Error loading report/i)).toBeInTheDocument();
			});
		});

		it("shows loading state while fetching", async () => {
			let resolvePromise;
			const promise = new Promise((resolve) => {
				resolvePromise = resolve;
			});

			fetch.mockImplementation(() => promise);

			await act(async () => {
				render(
					<ReportPage
						config={{
							...mockConfig,
							requiresCustomer: false,
							requiresDateRange: false,
						}}
					/>,
				);
			});

			expect(screen.getByText("Loading...")).toBeInTheDocument();

			await act(async () => {
				resolvePromise({
					ok: true,
					json: () => Promise.resolve([]),
				});
			});

			await waitFor(() => {
				expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
			});
		});
	});

	describe("Print Preview", () => {
		it("updates zoom level", async () => {
			await act(async () => {
				render(
					<ReportPage
						config={{
							...mockConfig,
							requiresCustomer: false,
							requiresDateRange: false,
						}}
					/>,
				);
			});

			await act(async () => {
				const zoomInButton = screen.getByTestId("zoom-in-button");
				await userEvent.click(zoomInButton);
			});

			const zoomSelect = screen.getByRole("combobox");
			expect(zoomSelect).toHaveValue("125");
		});

		it("handles pagination", async () => {
			const manyRecords = Array.from({ length: 30 }, (_, i) => ({
				col1: `Value${i + 1}`,
				col2: `Value${i + 2}`,
			}));

			fetch.mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(manyRecords),
				}),
			);

			render(
				<ReportPage
					config={{
						...mockConfig,
						requiresCustomer: false,
						requiresDateRange: false,
					}}
				/>,
			);

			await waitFor(() => {
				const nextPageButton = screen.getByTestId("next-page-button");
				expect(nextPageButton).not.toBeDisabled();
			});

			await userEvent.click(screen.getByTestId("next-page-button"));

			await waitFor(() => {
				const pageSpan = screen.getByText((content, element) => {
					return (
						element.tagName.toLowerCase() === "span" &&
						content.includes("Page 2 of 2")
					);
				});
				expect(pageSpan).toBeInTheDocument();
			});
		});
	});

	describe("Unit Search", () => {
		it("stores unit search term in localStorage", async () => {
			await act(async () => {
				render(
					<ReportPage
						config={{
							...mockConfig,
							baseEndpoint: "/api/reports/job-history",
						}}
					/>,
				);
			});

			await waitFor(() => {
				const searchInput = screen.getByLabelText("Search by Unit Sent");
				userEvent.type(searchInput, "UNIT123");
			});

			await waitFor(() => {
				expect(localStorage.getItem("unitSearchTerm")).toBe("UNIT123");
			});
		});
	});

	describe("Page Setup", () => {
		it("opens page setup modal when clicking button", async () => {
			await act(async () => {
				render(
					<ReportPage
						config={{
							...mockConfig,
							requiresCustomer: false,
							requiresDateRange: false,
						}}
					/>,
				);
			});

			await act(async () => {
				const pageSetupButton = screen.getByTestId("page-setup-button");
				await userEvent.click(pageSetupButton);
			});

			const modalTitle = screen.getAllByRole("heading", {
				name: "Page Setup",
			})[0];
			expect(modalTitle).toBeInTheDocument();
		});
	});
});
