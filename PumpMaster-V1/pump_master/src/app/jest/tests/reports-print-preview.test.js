import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PrintPreviewLayout from "@/app/Components/ReportsComponents/PrintPreviewLayout";

describe("PrintPreviewLayout", () => {
	const mockProps = {
		title: "Test Report",
		data: [{ id: 1, name: "Test" }],
		columns: [
			{ header: "ID", accessor: "id" },
			{ header: "Name", accessor: "name" },
		],
		currentPage: 2,
		totalPages: 3,
		zoom: 100,
		pageSettings: {
			size: "letter",
			orientation: "landscape",
			margins: { top: 10, right: 10, bottom: 10, left: 10 },
			dimensions: { width: 279.4, height: 215.9 },
		},
		onPrint: jest.fn(),
		onNextPage: jest.fn(),
		onPrevPage: jest.fn(),
		onZoomIn: jest.fn(),
		onZoomOut: jest.fn(),
		onRefresh: jest.fn(),
		onPageSetupClick: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("handles print command (Ctrl+P)", async () => {
		render(
			<PrintPreviewLayout {...mockProps}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		fireEvent.keyDown(document, { key: "p", ctrlKey: true });
		expect(mockProps.onPrint).toHaveBeenCalledTimes(1);

		// Test Command+P for Mac
		fireEvent.keyDown(document, { key: "p", metaKey: true });
		expect(mockProps.onPrint).toHaveBeenCalledTimes(2);
	});

	it("handles pagination controls", async () => {
		render(
			<PrintPreviewLayout {...mockProps}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		const nextButton = screen.getByTestId("next-page-button");
		const prevButton = screen.getByTestId("prev-page-button");

		expect(nextButton).not.toBeDisabled();
		expect(prevButton).not.toBeDisabled();

		await userEvent.click(nextButton);
		expect(mockProps.onNextPage).toHaveBeenCalledTimes(1);

		await userEvent.click(prevButton);
		expect(mockProps.onPrevPage).toHaveBeenCalledTimes(1);
	});

	it("handles zoom controls", async () => {
		render(
			<PrintPreviewLayout {...mockProps}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		await userEvent.click(screen.getByTestId("zoom-in-button"));
		expect(mockProps.onZoomIn).toHaveBeenCalledTimes(1);

		await userEvent.click(screen.getByTestId("zoom-out-button"));
		expect(mockProps.onZoomOut).toHaveBeenCalledTimes(1);

		// Test zoom dropdown
		const zoomSelect = screen.getByRole("combobox");
		await userEvent.selectOptions(zoomSelect, "150");
		expect(mockProps.onZoomIn).toHaveBeenCalledTimes(2);
	});

	it("displays correct page information", () => {
		render(
			<PrintPreviewLayout {...mockProps}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
	});

	it("applies zoom scale to content", () => {
		const { container } = render(
			<PrintPreviewLayout {...mockProps} zoom={150}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		const content = container.querySelector(".print-preview-content");
		const parentStyle = content.parentElement.style;
		expect(parentStyle.transform).toContain("scale");
		expect(parentStyle.transform).toContain("1.5");
	});

	it("applies page margins from settings", () => {
		const { container } = render(
			<PrintPreviewLayout {...mockProps}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		const content = container.querySelector(".print-preview-content");
		const parentStyle = content.parentElement.style;
		expect(parentStyle.padding).toBe("10mm 10mm 10mm 10mm");
	});

	it("disables navigation buttons at boundaries", () => {
		render(
			<PrintPreviewLayout {...mockProps} currentPage={1} totalPages={1}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		expect(screen.getByTestId("prev-page-button")).toBeDisabled();
		expect(screen.getByTestId("next-page-button")).toBeDisabled();
	});

	it("disables zoom buttons at limits", () => {
		// Test minimum zoom
		const { rerender } = render(
			<PrintPreviewLayout {...mockProps} zoom={25}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		expect(screen.getByTestId("zoom-out-button")).toBeDisabled();
		expect(screen.getByTestId("zoom-in-button")).not.toBeDisabled();

		// Test maximum zoom
		rerender(
			<PrintPreviewLayout {...mockProps} zoom={200}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		expect(screen.getByTestId("zoom-in-button")).toBeDisabled();
		expect(screen.getByTestId("zoom-out-button")).not.toBeDisabled();
	});

	it("renders refresh button when onRefresh is provided", () => {
		render(
			<PrintPreviewLayout {...mockProps}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		const refreshButton = screen.getByRole("button", { name: /refresh/i });
		expect(refreshButton).toBeInTheDocument();
	});

	it("renders page setup button when onPageSetupClick is provided", () => {
		render(
			<PrintPreviewLayout {...mockProps}>
				<div>Content</div>
			</PrintPreviewLayout>,
		);

		const pageSetupButton = screen.getByTestId("page-setup-button");
		expect(pageSetupButton).toBeInTheDocument();
	});
});
