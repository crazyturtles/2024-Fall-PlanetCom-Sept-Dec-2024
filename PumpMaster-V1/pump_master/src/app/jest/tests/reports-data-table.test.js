const { render, screen } = require("@testing-library/react");
require("@testing-library/jest-dom");
const { DataTable } = require("@/app/Components/ReportsComponents/DataTable");
const {
	JOB_STATUS,
} = require("@/app/Components/ReportsComponents/reports/jobHistoryConfig");

describe("DataTable", () => {
	const mockColumns = [
		{ header: "Name", accessor: "name", align: "left" },
		{
			header: "Amount",
			accessor: "amount",
			align: "right",
			formatter: (val) => `$${val}`,
		},
		{ header: "Status", accessor: "status", align: "center" },
	];

	const mockData = [
		{ name: "Test 1", amount: 100, status: "Active" },
		{ name: "Test 2", amount: 200, status: "Inactive" },
	];

	test("renders column headers correctly", () => {
		render(<DataTable data={mockData} columns={mockColumns} />);
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Amount")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	test("renders header groups when provided", () => {
		const headerGroups = [
			{ title: "Group 1", colspan: 2 },
			{ title: "Group 2", colspan: 1 },
		];

		render(
			<DataTable
				data={mockData}
				columns={mockColumns}
				headerGroups={headerGroups}
			/>,
		);

		expect(screen.getByText("Group 1")).toBeInTheDocument();
		expect(screen.getByText("Group 2")).toBeInTheDocument();
	});

	test("applies column alignment classes", () => {
		render(<DataTable data={mockData} columns={mockColumns} />);

		const cells = screen.getAllByRole("cell");
		expect(cells[0]).toHaveClass("text-left");
		expect(cells[1]).toHaveClass("text-right");
		expect(cells[2]).toHaveClass("text-center");
	});

	test("formats cell values using formatter function", () => {
		render(<DataTable data={mockData} columns={mockColumns} />);
		expect(screen.getByText("$100")).toBeInTheDocument();
		expect(screen.getByText("$200")).toBeInTheDocument();
	});

	test("handles empty data array", () => {
		render(<DataTable data={[]} columns={mockColumns} />);
		expect(
			screen.getByText("No records found for the report."),
		).toBeInTheDocument();
	});

	test("handles null data values", () => {
		const columnsWithoutFormatters = [
			{ header: "Name", accessor: "name", align: "left" },
			{ header: "Amount", accessor: "amount", align: "right" },
			{ header: "Status", accessor: "status", align: "center" },
		];

		const dataWithNull = [{ name: null, amount: null, status: null }];

		render(
			<DataTable data={dataWithNull} columns={columnsWithoutFormatters} />,
		);
		const cells = screen.getAllByRole("cell");
		cells.forEach((cell) => {
			expect(cell.textContent).toBe("");
		});
	});

	test("applies status-specific styling", () => {
		const statusColumn = {
			header: "Status",
			accessor: "status",
		};

		render(
			<DataTable
				data={[{ status: JOB_STATUS.OPERATOR_CONFIRMED }]}
				columns={[statusColumn]}
			/>,
		);

		const statusCell = screen.getByText(JOB_STATUS.OPERATOR_CONFIRMED);
		expect(statusCell).toHaveClass("bg-green-100", "text-green-700");
	});

	test("handles custom cell renderers", () => {
		const columnsWithRenderer = [
			{
				header: "Custom",
				accessor: (row) => <div data-testid="custom-cell">{row.name}</div>,
			},
		];

		render(
			<DataTable data={[{ name: "Test" }]} columns={columnsWithRenderer} />,
		);

		expect(screen.getByTestId("custom-cell")).toBeInTheDocument();
	});
});
