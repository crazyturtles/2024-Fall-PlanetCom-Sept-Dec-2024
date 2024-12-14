import React from "react";
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from "@testing-library/react";
import SearchJob from "../../Components/SearchJob";

jest.mock("../../Components/Modal", () => ({ isOpen, onClose, children }) => {
	return isOpen ? (
		<div data-testid="modal">
			<button data-testid="close-modal" onClick={onClose} type="button">
				Close Modal
			</button>
			{children}
		</div>
	) : null;
});

jest.mock("../../Components/JobStatus", () => ({
	getJobStatusText: (status) => `Status: ${status}`,
}));

jest.mock("../../Components/ReportsComponents/utils/dateUtils", () => ({
	formatDateTime: (date) => `Formatted: ${date}`,
}));

const mockFetch = jest.fn();
const originalConsoleError = console.error;

beforeEach(() => {
	global.fetch = mockFetch;
	console.error = jest.fn();
});

afterEach(() => {
	jest.clearAllMocks();
	console.error = originalConsoleError;
});

describe("SearchJob Component", () => {
	const fetchLink = "jobs";
	const mockOnEdit = jest.fn();

	test("renders the search button", () => {
		render(<SearchJob fetchLink={fetchLink} onEdit={mockOnEdit} />);
		expect(screen.getByText(/search/i)).toBeInTheDocument();
	});

	test("opens and closes the modal", async () => {
		render(<SearchJob fetchLink={fetchLink} onEdit={mockOnEdit} />);

		const searchButton = screen.getByText(/search/i);
		fireEvent.click(searchButton);
		expect(screen.getByTestId("modal")).toBeInTheDocument();

		const closeModalButton = screen.getByTestId("close-modal");
		fireEvent.click(closeModalButton);
		await waitFor(() => {
			expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
		});
	});

	test("filters options based on search term", async () => {
		const jobs = [
			{ JobID: 1, JobCompanyJobNum: "1234", CustomerCompanyName: "Customer A" },
			{ JobID: 2, JobCompanyJobNum: "5678", CustomerCompanyName: "Customer B" },
		];
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValue(jobs),
		});

		render(<SearchJob fetchLink={fetchLink} onEdit={mockOnEdit} />);
		fireEvent.click(screen.getByText(/search/i));
		await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

		const searchInput = screen.getByPlaceholderText(/search by ticket#/i);
		fireEvent.change(searchInput, { target: { value: "123" } });

		await waitFor(() => {
			expect(screen.getByText("1234")).toBeInTheDocument();
			expect(screen.queryByText("5678")).not.toBeInTheDocument();
		});
	});

	test("displays filtered jobs on search", async () => {
		const filteredJobs = [
			{
				JobID: 1,
				JobCompanyJobNum: "1234",
				CustomerCompanyName: "Customer A",
				JobStatus: "Active",
				JobStartTime: "2024-01-01T00:00:00Z",
			},
		];
		mockFetch
			.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue(filteredJobs),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue(filteredJobs),
			});

		render(<SearchJob fetchLink={fetchLink} onEdit={mockOnEdit} />);

		await act(async () => {
			fireEvent.click(screen.getByText(/search/i));
		});

		const searchInput = screen.getByPlaceholderText(/search by ticket#/i);
		fireEvent.change(searchInput, { target: { value: "1234" } });

		const modalSearchButton = screen.getByTestId("modal-search-button");
		fireEvent.click(modalSearchButton);

		expect(mockFetch).toHaveBeenCalledWith(
			"http://localhost:3001/jobs/search?ticket=1234",
		);

		await waitFor(() => {
			expect(screen.getByText(/status: active/i)).toBeInTheDocument();
			expect(
				screen.getByText(/formatted: 2024-01-01t00:00:00z/i),
			).toBeInTheDocument();
			expect(screen.getByText("1234")).toBeInTheDocument();
		});
	});

	test("opens job edit modal on double-clicking a row", async () => {
		const jobs = [
			{ JobID: 1, JobCompanyJobNum: "1234", CustomerCompanyName: "Customer A" },
			{ JobID: 2, JobCompanyJobNum: "5678", CustomerCompanyName: "Customer B" },
		];

		mockFetch
			.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue(jobs),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue(jobs),
			});

		render(<SearchJob fetchLink="jobs" onEdit={mockOnEdit} />);

		fireEvent.click(screen.getByText(/search/i));
		await waitFor(() =>
			expect(screen.getByTestId("modal")).toBeInTheDocument(),
		);

		await act(async () => {
			fireEvent.change(screen.getByPlaceholderText(/search by ticket#/i), {
				target: { value: "123" },
			});
			fireEvent.click(screen.getByTestId("modal-search-button"));
		});

		const rows = await screen.findAllByTestId((_, element) =>
			element?.getAttribute("data-testid")?.startsWith("job-row-"),
		);
		expect(rows).toHaveLength(jobs.length);

		fireEvent.doubleClick(rows[0]);
		expect(mockOnEdit).toHaveBeenCalledWith(jobs[0].JobID);
	});

	test("displays no jobs found message on empty search results", async () => {
		const jobs = [];
		mockFetch
			.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue(jobs),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue(jobs),
			});

		render(<SearchJob fetchLink={fetchLink} onEdit={mockOnEdit} />);

		fireEvent.click(screen.getByText(/search/i));
		await waitFor(() =>
			expect(screen.getByTestId("modal")).toBeInTheDocument(),
		);

		await act(async () => {
			fireEvent.change(screen.getByPlaceholderText(/search by ticket#/i), {
				target: { value: "9999" },
			});
			fireEvent.click(screen.getByTestId("modal-search-button"));
		});

		await waitFor(() => {
			expect(
				screen.getByText((content, element) =>
					content.startsWith("No jobs found with that ticket"),
				),
			).toBeInTheDocument();
		});

		const rows = screen.queryAllByTestId((_, element) =>
			element?.getAttribute("data-testid")?.startsWith("job-row-"),
		);
		expect(rows).toHaveLength(0);
	});
});
