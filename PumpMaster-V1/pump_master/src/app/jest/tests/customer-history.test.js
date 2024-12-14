import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CustomerHistoryModal from "../../Components/CustomerHistory";
import { getJobStatusText } from "../../Components/JobStatus";

describe("CustomerHistoryModal Component", () => {
	const mockCustomerId = 123;

	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("fetches and displays customer history data", async () => {
		const mockHistoryData = [
			{
				JobStatus: 1,
				JobStartTime: "2024-12-12T08:00:00Z",
				PumpTypeName: "Type A",
				UnitNumber: "Unit 1",
				DriverName: "Driver A",
				PourTypeName: "Pour A",
				CustomerCompanyName: "Customer A",
				JobSiteArea: "Area A",
				JobTotalPoured: "1000",
				SupplierCompanyName: "Supplier A",
				JobSitePhone: "123-456-7890",
				JobCompanyJobNum: "12345",
				jobId: 1,
				JobSiteAddress: "123 Street",
				JobID: "1",
			},
		];
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockHistoryData,
		});

		render(<CustomerHistoryModal customerId={mockCustomerId} />);

		await waitFor(() => {
			expect(screen.getByText("Customer A")).toBeInTheDocument();
			expect(screen.getByText("Type A")).toBeInTheDocument();
			expect(screen.getByText("Unit 1")).toBeInTheDocument();
		});

		expect(screen.getByText("Status")).toBeInTheDocument();
		expect(screen.getByText("Time")).toBeInTheDocument();
		expect(screen.getByText("Pump")).toBeInTheDocument();
		expect(screen.getByText("Operator")).toBeInTheDocument();
	});

	test("handles empty customer history data gracefully", async () => {
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [],
		});

		render(<CustomerHistoryModal customerId={mockCustomerId} />);

		await waitFor(() => {
			expect(screen.queryByText("Customer A")).not.toBeInTheDocument();
		});
		expect(screen.getByText("Customer History For")).toBeInTheDocument();
	});

	test("displays properly formatted job site addresses", async () => {
		const mockHistoryData = [
			{
				JobStatus: 2,
				JobStartTime: "2024-12-13T10:00:00Z",
				PumpTypeName: "Type B",
				UnitNumber: "Unit 2",
				DriverName: "Driver B",
				PourTypeName: "Pour B",
				CustomerCompanyName: "Customer B",
				JobSiteArea: "Area B",
				JobTotalPoured: "2000",
				SupplierCompanyName: "Supplier B",
				JobSitePhone: "987-654-3210",
				JobCompanyJobNum: "67890",
				jobId: 2,
				JobSiteAddress: "456 Avenue",
				JobID: "2",
			},
		];
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockHistoryData,
		});

		render(<CustomerHistoryModal customerId={mockCustomerId} />);

		await waitFor(() => {
			expect(screen.getByText("456 Avenue, Area B")).toBeInTheDocument();
		});
	});

	test("displays 'Not Available' for missing job start time", async () => {
		const mockHistoryData = [
			{
				JobStatus: 3,
				JobStartTime: null,
				PumpTypeName: "Type C",
				UnitNumber: "Unit 3",
				DriverName: "Driver C",
				PourTypeName: "Pour C",
				CustomerCompanyName: "Customer C",
				JobSiteArea: "Area C",
				JobTotalPoured: "3000",
				SupplierCompanyName: "Supplier C",
				JobSitePhone: "111-222-3333",
				JobCompanyJobNum: "33333",
				jobId: 3,
				JobSiteAddress: "789 Boulevard",
				JobID: "3",
			},
		];
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockHistoryData,
		});

		render(<CustomerHistoryModal customerId={mockCustomerId} />);

		await waitFor(() => {
			expect(screen.getByText("Not Available")).toBeInTheDocument();
		});
	});

	test("renders correct job status text based on JobStatus value", async () => {
		const mockHistoryData = [
			{
				JobStatus: 4,
				JobStartTime: "2024-12-14T12:00:00Z",
				PumpTypeName: "Type D",
				UnitNumber: "Unit 4",
				DriverName: "Driver D",
				PourTypeName: "Pour D",
				CustomerCompanyName: "Customer D",
				JobSiteArea: "Area D",
				JobTotalPoured: "4000",
				SupplierCompanyName: "Supplier D",
				JobSitePhone: "555-555-5555",
				JobCompanyJobNum: "44444",
				jobId: 4,
				JobSiteAddress: "789 Lane",
				JobID: "4",
			},
		];

		const expectedStatusText = getJobStatusText(4);

		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockHistoryData,
		});

		render(<CustomerHistoryModal customerId={mockCustomerId} />);

		await waitFor(() => {
			expect(screen.getByText(expectedStatusText)).toBeInTheDocument();
		});
	});
});
