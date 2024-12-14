import { render, screen, act, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import JobTable from "../../Components/JobTable";

jest.mock("next/router", () => ({
	useRouter: jest.fn(() => ({
		replace: jest.fn(),
		push: jest.fn(),
	})),
}));

fetchMock.enableMocks();

beforeEach(() => {
	global.fetch = jest.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve({ jobs: mockJobs, pourTypes: [] }),
		}),
	);
});

beforeEach(() => {
	global.fetch = jest.fn(() =>
		Promise.resolve({
			json: () =>
				Promise.resolve({
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
							PourTypes: ["Type A", "Type B", "Type C"],
							CustomerCompanyName: "Customer A",
							SupplierCompanyName: "Supplier A",
							JobSiteAddress: "Site Address",
							JobSiteArea: "Area A",
							JobSitePhone: "123-456-7890",
							SupplierConfirmed: true,
							CustomerConfirmed: true,
							IsTextMessageSent: true,
						},
					],
					pourTypes: [
						{ JobID: 1, PourTypeName: "Type A" },
						{ JobID: 1, PourTypeName: "Type B" },
						{ JobID: 1, PourTypeName: "Type C" },
					],
				}),
		}),
	);
});

afterEach(() => {
	global.fetch.mockClear();
	global.fetch = undefined;
});

jest.mock("../../Components/ContextMenu", () => () => (
	<div data-testid="mock-context-menu" />
));
jest.mock("../../Components/MessageModal", () => () => (
	<div data-testid="mock-message-modal" />
));
jest.mock("../../Components/Modal", () => () => (
	<div data-testid="mock-modal" />
));

describe("JobTable Component", () => {
	const defaultProps = {
		onEdit: jest.fn(),
		entityTable: "JobTable",
		fetchLink: "jobs",
		filterDate: new Date("2024-01-01T00:00:00Z"),
		jobs: [],
	};

	const mockJobs = [
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
			CustomerCompanyName: "Customer A",
			SupplierCompanyName: "Supplier A",
			JobSiteAddress: "Address A",
			JobSiteArea: "Area A",
			JobSitePhone: "123-456-7890",
			SupplierConfirmed: true,
			CustomerConfirmed: true,
			IsTextMessageSent: true,
		},
	];

	test("renders the JobTable component correctly", async () => {
		await act(async () => {
			render(<JobTable {...defaultProps} />);
		});

		expect(screen.getByText("Ticket")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
		expect(screen.getByText("Time")).toBeInTheDocument();
		expect(screen.getByText("Pump")).toBeInTheDocument();
		expect(screen.getByText("Unit")).toBeInTheDocument();
		expect(screen.getByText("Operator")).toBeInTheDocument();
		expect(screen.getByText("Customer")).toBeInTheDocument();
		expect(screen.getByText("Site, Area")).toBeInTheDocument();
	});

	test("renders job rows correctly with pour types", async () => {
		const jobData = [
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
				PourTypes: ["Type A", "Type B", "Type C"],
				CustomerCompanyName: "Customer A",
				SupplierCompanyName: "Supplier A",
				JobSiteAddress: "Site Address",
				JobSiteArea: "Area A",
				JobSitePhone: "123-456-7890",
				SupplierConfirmed: true,
				CustomerConfirmed: true,
				IsTextMessageSent: true,
			},
		];

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						jobs: jobData,
						pourTypes: [
							{ JobID: 1, PourTypeName: "Type A" },
							{ JobID: 1, PourTypeName: "Type B" },
							{ JobID: 1, PourTypeName: "Type C" },
						],
					}),
			}),
		);

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={jobData} />);
		});

		const pourTypesCell = screen.getByTitle("Type A, Type B, Type C");
		expect(pourTypesCell).toBeInTheDocument();

		expect(pourTypesCell).toHaveTextContent("Type A, Type B");
		expect(pourTypesCell).toHaveTextContent("+1 more");

		const textContent = pourTypesCell.textContent || "";
		expect(textContent.includes("Type A")).toBe(true);
		expect(textContent.includes("Type B")).toBe(true);
		expect(textContent.includes("+1 more")).toBe(true);
	});

	test("renders job rows with correct status details", async () => {
		const jobData = [
			{
				JobID: 1,
				JobCompanyJobNum: "1234",
				JobStatus: 10,
				JobStartTime: "2024-01-01T08:00:00Z",
				PumpTypeName: "Pump A",
				UnitNumber: "Unit 1",
				DriverName: "John Doe",
				JobTotalPoured: 50,
				JobColor: "#E6E6FA",
				PourTypes: ["Type A", "Type B"],
				CustomerCompanyName: "Customer A",
				SupplierCompanyName: "Supplier A",
				JobSiteAddress: "Site Address",
				JobSiteArea: "Area A",
				JobSitePhone: "123-456-7890",
				SupplierConfirmed: true,
				CustomerConfirmed: true,
				IsTextMessageSent: true,
			},
			{
				JobID: 2,
				JobCompanyJobNum: "5678",
				JobStatus: 70,
				JobStartTime: "2024-01-01T12:00:00Z",
				PumpTypeName: "Pump B",
				UnitNumber: "Unit 2",
				DriverName: "Jane Smith",
				JobTotalPoured: 30,
				JobColor: "#E57373",
				PourTypes: ["Type C"],
				CustomerCompanyName: "Customer B",
				SupplierCompanyName: "Supplier B",
				JobSiteAddress: "Site Address 2",
				JobSiteArea: "Area B",
				JobSitePhone: "987-654-3210",
				SupplierConfirmed: false,
				CustomerConfirmed: false,
				IsTextMessageSent: false,
			},
		];

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						jobs: jobData,
						pourTypes: [
							{ JobID: 1, PourTypeName: "Type A" },
							{ JobID: 1, PourTypeName: "Type B" },
							{ JobID: 2, PourTypeName: "Type C" },
						],
					}),
			}),
		);

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={jobData} />);
		});

		const rows = screen.getAllByRole("row");
		const firstRow = rows[1];
		const secondRow = rows[2];

		expect(firstRow).toBeInTheDocument();
		expect(secondRow).toBeInTheDocument();

		const firstRowStyle = window.getComputedStyle(firstRow);
		const secondRowStyle = window.getComputedStyle(secondRow);

		expect(firstRowStyle.backgroundColor).toBe("rgb(230, 230, 250)");
		expect(secondRowStyle.backgroundColor).toBe("rgb(229, 115, 115)");
	});

	test("renders job rows with supplier confirmation status correctly", async () => {
		const jobData = [
			{
				JobID: 1,
				JobCompanyJobNum: "1234",
				JobStatus: 10,
				JobStartTime: "2024-01-01T08:00:00Z",
				PumpTypeName: "Pump A",
				UnitNumber: "Unit 1",
				DriverName: "John Doe",
				JobTotalPoured: 50,
				JobColor: "#E6E6FA",
				PourTypes: ["Type A", "Type B"],
				CustomerCompanyName: "Customer A",
				SupplierCompanyName: "Supplier A",
				JobSiteAddress: "Site Address",
				JobSiteArea: "Area A",
				JobSitePhone: "123-456-7890",
				SupplierConfirmed: true,
				CustomerConfirmed: false,
				IsTextMessageSent: false,
			},
			{
				JobID: 2,
				JobCompanyJobNum: "5678",
				JobStatus: 70,
				JobStartTime: "2024-01-01T12:00:00Z",
				PumpTypeName: "Pump B",
				UnitNumber: "Unit 2",
				DriverName: "Jane Smith",
				JobTotalPoured: 30,
				JobColor: "#E57373",
				PourTypes: ["Type C"],
				CustomerCompanyName: "Customer B",
				SupplierCompanyName: "Supplier B",
				JobSiteAddress: "Site Address 2",
				JobSiteArea: "Area B",
				JobSitePhone: "987-654-3210",
				SupplierConfirmed: false,
				CustomerConfirmed: false,
				IsTextMessageSent: false,
			},
		];

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						jobs: jobData,
						pourTypes: [
							{ JobID: 1, PourTypeName: "Type A" },
							{ JobID: 1, PourTypeName: "Type B" },
							{ JobID: 2, PourTypeName: "Type C" },
						],
					}),
			}),
		);

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={jobData} />);
		});

		const rows = screen.getAllByRole("row");
		const firstRow = rows[1];
		const secondRow = rows[2];

		const firstSupplierCell = within(firstRow).getByText("Supplier A");
		expect(firstSupplierCell).toBeInTheDocument();
		expect(firstSupplierCell.querySelector(".fa-check-circle")).toBeTruthy();

		const secondSupplierCell = within(secondRow).getByText("Supplier B");
		expect(secondSupplierCell).toBeInTheDocument();
		expect(secondSupplierCell.querySelector(".fa-check-circle")).toBeFalsy();
	});

	test("renders job rows with text message sent status correctly", async () => {
		const jobData = [
			{
				JobID: 1,
				JobCompanyJobNum: "1234",
				JobStatus: 10,
				JobStartTime: "2024-01-01T08:00:00Z",
				PumpTypeName: "Pump A",
				UnitNumber: "Unit 1",
				DriverName: "John Doe",
				JobTotalPoured: 50,
				JobColor: "#E6E6FA",
				PourTypes: ["Type A", "Type B"],
				CustomerCompanyName: "Customer A",
				SupplierCompanyName: "Supplier A",
				JobSiteAddress: "Site Address",
				JobSiteArea: "Area A",
				JobSitePhone: "123-456-7890",
				SupplierConfirmed: true,
				CustomerConfirmed: false,
				IsTextMessageSent: true,
			},
			{
				JobID: 2,
				JobCompanyJobNum: "5678",
				JobStatus: 70,
				JobStartTime: "2024-01-01T12:00:00Z",
				PumpTypeName: "Pump B",
				UnitNumber: "Unit 2",
				DriverName: "Jane Smith",
				JobTotalPoured: 30,
				JobColor: "#E57373",
				PourTypes: ["Type C"],
				CustomerCompanyName: "Customer B",
				SupplierCompanyName: "Supplier B",
				JobSiteAddress: "Site Address 2",
				JobSiteArea: "Area B",
				JobSitePhone: "987-654-3210",
				SupplierConfirmed: false,
				CustomerConfirmed: false,
				IsTextMessageSent: false,
			},
		];

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						jobs: jobData,
						pourTypes: [
							{ JobID: 1, PourTypeName: "Type A" },
							{ JobID: 1, PourTypeName: "Type B" },
							{ JobID: 2, PourTypeName: "Type C" },
						],
					}),
			}),
		);

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={jobData} />);
		});

		const rows = screen.getAllByRole("row");
		const firstRow = rows[1];
		const secondRow = rows[2];

		const firstOperatorCell = within(firstRow).getByText("John Doe");
		expect(firstOperatorCell).toBeInTheDocument();
		expect(firstOperatorCell.querySelector(".fa-envelope")).toBeTruthy();

		const secondOperatorCell = within(secondRow).getByText("Jane Smith");
		expect(secondOperatorCell).toBeInTheDocument();
		expect(secondOperatorCell.querySelector(".fa-envelope")).toBeFalsy();
	});

	test("updates job list dynamically when filterDate changes", async () => {
		const initialJobs = [
			{
				JobID: 1,
				JobCompanyJobNum: "1234",
				JobStatus: 10,
				JobStartTime: "2024-01-01T08:00:00Z",
				PumpTypeName: "Pump A",
				UnitNumber: "Unit 1",
				DriverName: "John Doe",
				JobTotalPoured: 50,
				JobColor: "#E6E6FA",
				PourTypes: ["Type A", "Type B"],
				CustomerCompanyName: "Customer A",
				SupplierCompanyName: "Supplier A",
				JobSiteAddress: "Site Address",
				JobSiteArea: "Area A",
				JobSitePhone: "123-456-7890",
				SupplierConfirmed: true,
				CustomerConfirmed: true,
				IsTextMessageSent: true,
			},
		];

		const updatedJobs = [
			{
				JobID: 2,
				JobCompanyJobNum: "5678",
				JobStatus: 70,
				JobStartTime: "2024-01-02T12:00:00Z",
				PumpTypeName: "Pump B",
				UnitNumber: "Unit 2",
				DriverName: "Jane Smith",
				JobTotalPoured: 30,
				JobColor: "#E57373",
				PourTypes: ["Type C"],
				CustomerCompanyName: "Customer B",
				SupplierCompanyName: "Supplier B",
				JobSiteAddress: "Site Address 2",
				JobSiteArea: "Area B",
				JobSitePhone: "987-654-3210",
				SupplierConfirmed: false,
				CustomerConfirmed: false,
				IsTextMessageSent: false,
			},
		];

		global.fetch
			.mockImplementationOnce(() =>
				Promise.resolve({
					json: () => Promise.resolve({ jobs: initialJobs, pourTypes: [] }),
				}),
			)
			.mockImplementationOnce(() =>
				Promise.resolve({
					json: () => Promise.resolve({ jobs: updatedJobs, pourTypes: [] }),
				}),
			);

		const { rerender } = render(<JobTable {...defaultProps} />);

		await act(async () => {
			rerender(<JobTable {...defaultProps} />);
		});

		expect(screen.getByText("1234")).toBeInTheDocument();
		expect(screen.queryByText("5678")).not.toBeInTheDocument();

		const newProps = {
			...defaultProps,
			filterDate: new Date("2024-01-02T00:00:00Z"),
		};
		await act(async () => {
			rerender(<JobTable {...newProps} />);
		});

		expect(screen.queryByText("1234")).not.toBeInTheDocument();
		expect(screen.getByText("5678")).toBeInTheDocument();
	});

	test("opens JobForm modal on double-clicking a row", async () => {
		const mockOnEdit = jest.fn();
		const props = { ...defaultProps, onEdit: mockOnEdit, jobs: mockJobs };

		await act(async () => {
			render(<JobTable {...props} />);
		});

		const rows = screen.getAllByRole("row");

		expect(rows).toHaveLength(mockJobs.length + 1);

		await act(async () => {
			fireEvent.doubleClick(rows[1]);
		});

		expect(mockOnEdit).toHaveBeenCalledTimes(1);
		expect(mockOnEdit).toHaveBeenCalledWith(mockJobs[0].JobID);
	});

	test("selects a job row on single click", async () => {
		await act(async () => {
			render(<JobTable {...defaultProps} jobs={mockJobs} />);
		});

		const rows = screen.getAllByRole("row");

		expect(rows).toHaveLength(mockJobs.length + 1);

		await act(async () => {
			fireEvent.click(rows[1]);
		});

		expect(rows[1]).toHaveClass("job-row-selected");

		await act(async () => {
			fireEvent.click(rows[1]);
		});

		expect(rows[1]).not.toHaveClass("job-row-selected");
	});

	test("opens context menu on right-clicking a job row", async () => {
		const mockOnEdit = jest.fn();
		const props = { ...defaultProps, onEdit: mockOnEdit, jobs: mockJobs };

		await act(async () => {
			render(<JobTable {...props} />);
		});

		const rows = screen.getAllByRole("row");

		fireEvent.contextMenu(rows[1]);

		const contextMenu = screen.getByTestId("mock-context-menu");
		expect(contextMenu).toBeInTheDocument();

		expect(rows[1]).toHaveClass("job-row-selected");
	});

	test("updates job status dynamically", async () => {
		const mockJob = {
			JobID: 1,
			JobCompanyJobNum: "1234",
			JobStatus: 10,
			JobStartTime: "2024-01-01T08:00:00Z",
			PumpTypeName: "Pump A",
			UnitNumber: "Unit 1",
			DriverName: "John Doe",
			JobTotalPoured: 50,
			JobColor: "#FFFFFF",
			CustomerCompanyName: "Customer A",
			SupplierCompanyName: "Supplier A",
			JobSiteAddress: "Address A",
			JobSiteArea: "Area A",
			JobSitePhone: "123-456-7890",
			SupplierConfirmed: true,
			CustomerConfirmed: true,
			IsTextMessageSent: true,
		};

		const updatedJob = { ...mockJob, JobStatus: 40 };

		global.fetch.mockResolvedValueOnce({
			json: async () => ({ jobs: [mockJob], pourTypes: [] }),
		});

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={[mockJob]} />);
		});

		expect(screen.getByText("Confirmed")).toBeInTheDocument();

		global.fetch.mockResolvedValueOnce({
			json: async () => ({ jobs: [updatedJob], pourTypes: [] }),
		});

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={[updatedJob]} />);
		});

		expect(screen.getByText("Complete")).toBeInTheDocument();
	});

	test("renders large datasets without crashing", async () => {
		const largeJobs = Array.from({ length: 1000 }, (_, index) => ({
			...mockJobs[0],
			JobID: index + 1,
			JobCompanyJobNum: `Job ${index + 1}`,
		}));

		global.fetch.mockResolvedValueOnce({
			json: async () => ({ jobs: largeJobs, pourTypes: [] }),
		});

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={largeJobs} />);
		});

		const rows = screen.getAllByRole("row");
		expect(rows).toHaveLength(1001);
	});

	test("handles missing fields gracefully", async () => {
		const incompleteJob = {
			JobID: 1,
			JobCompanyJobNum: null,
			JobStatus: null,
		};

		global.fetch.mockResolvedValueOnce({
			json: async () => ({ jobs: [incompleteJob], pourTypes: [] }),
		});

		await act(async () => {
			render(<JobTable {...defaultProps} jobs={[incompleteJob]} />);
		});

		const rows = screen.getAllByRole("row");
		expect(rows).toHaveLength(2);
		expect(screen.getByText("Unknown")).toBeInTheDocument();
	});
});
