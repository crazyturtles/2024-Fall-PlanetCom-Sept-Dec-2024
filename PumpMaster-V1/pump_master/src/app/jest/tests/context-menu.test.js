import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContextMenu from "../../Components/ContextMenu";
import { useRouter } from "next/navigation";
import fetchMock from "jest-fetch-mock";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

describe("ContextMenu Component", () => {
	const mockPush = jest.fn();
	const mockProps = {
		contextMenuPosition: { x: 100, y: 200 },
		closeContextMenu: jest.fn(),
		openModal: jest.fn(),
		closeModal: jest.fn(),
		handleWashing: jest.fn(),
		handleComplete: jest.fn(),
		handleReset: jest.fn(),
		handleCancel: jest.fn(),
		updateJobStartDate: jest.fn(),
		jobId: 1,
		currentDriverID: 101,
		updateJobOperator: jest.fn(),
		updateJobUnit: jest.fn(),
		handleConfirm: jest.fn(),
		handleOperatorConfirm: jest.fn(),
		handleJobConfirm: jest.fn(),
		handleSendMessage: jest.fn(),
		onMessageStatusChange: jest.fn(),
	};

	beforeEach(() => {
		useRouter.mockReturnValue({ push: mockPush });
		fetchMock.resetMocks();
	});

	test("renders the context menu at the correct position", () => {
		render(<ContextMenu {...mockProps} />);

		const contextMenu = screen.getByTestId("main-context-menu");
		expect(contextMenu).toBeInTheDocument();
		expect(contextMenu).toHaveStyle({
			top: "205px",
			left: "100px",
		});
	});

	test("calls handleReset when the Reset Job button is clicked", () => {
		render(<ContextMenu {...mockProps} />);

		const resetButton = screen.getByText("Reset Job");
		fireEvent.click(resetButton);

		expect(mockProps.handleReset).toHaveBeenCalledWith(1);
	});

	test("calls handleComplete when the Complete Job button is clicked", () => {
		render(<ContextMenu {...mockProps} />);

		const completeJobButton = screen.getByText("Complete Job");
		fireEvent.click(completeJobButton);

		expect(mockProps.handleComplete).toHaveBeenCalledWith(1);
	});

	test("calls handleWashing when the Washing button is clicked", () => {
		render(<ContextMenu {...mockProps} />);

		const washingButton = screen.getByText("Washing");
		fireEvent.click(washingButton);

		expect(mockProps.handleWashing).toHaveBeenCalledWith(1);
	});

	test("calls handleCancel when the Cancel Job button is clicked", () => {
		render(<ContextMenu {...mockProps} />);

		const cancelButton = screen.getByText("Cancel Job");
		fireEvent.click(cancelButton);

		expect(mockProps.handleCancel).toHaveBeenCalledWith(1);
	});

	test("calls closeContextMenu when clicking outside the context menu", () => {
		render(<ContextMenu {...mockProps} />);

		const contextMenu = screen.getByTestId("main-context-menu");
		expect(contextMenu).toBeInTheDocument();

		fireEvent.mouseDown(document.body);

		expect(mockProps.closeContextMenu).toHaveBeenCalled();
	});

	test("renders the submenu on hover of the Confirm button", async () => {
		render(<ContextMenu {...mockProps} />);

		const confirmButton = screen.getByText("Confirm");
		fireEvent.mouseEnter(confirmButton);

		await waitFor(() => {
			expect(screen.getByText("Supplier")).toBeInTheDocument();
		});

		expect(screen.getByText("Customer")).toBeInTheDocument();
		expect(screen.getByText("Operator")).toBeInTheDocument();
		expect(screen.getByText("Job")).toBeInTheDocument();
	});

	test("calls handleConfirm for Supplier", async () => {
		render(<ContextMenu {...mockProps} />);

		const confirmButton = screen.getByText("Confirm");
		fireEvent.mouseEnter(confirmButton);

		await waitFor(() => {
			const supplierButton = screen.getByText("Supplier");
			fireEvent.click(supplierButton);
		});

		expect(mockProps.handleConfirm).toHaveBeenCalledWith("Supplier", 1);
		expect(mockProps.closeContextMenu).toHaveBeenCalled();
	});

	test("calls handleConfirm for Customer", async () => {
		render(<ContextMenu {...mockProps} />);

		const confirmButton = screen.getByText("Confirm");
		fireEvent.mouseEnter(confirmButton);

		await waitFor(() => {
			const customerButton = screen.getByText("Customer");
			fireEvent.click(customerButton);
		});

		expect(mockProps.handleConfirm).toHaveBeenCalledWith("Customer", 1);
		expect(mockProps.closeContextMenu).toHaveBeenCalled();
	});

	test("calls handleOperatorConfirm for Operator", async () => {
		render(<ContextMenu {...mockProps} />);

		const confirmButton = screen.getByText("Confirm");
		fireEvent.mouseEnter(confirmButton);

		await waitFor(() => {
			const operatorButton = screen.getByText("Operator");
			fireEvent.click(operatorButton);
		});

		expect(mockProps.handleOperatorConfirm).toHaveBeenCalledWith(1);
		expect(mockProps.closeContextMenu).toHaveBeenCalled();
	});

	test("calls handleJobConfirm for Job", async () => {
		render(<ContextMenu {...mockProps} />);

		const confirmButton = screen.getByText("Confirm");
		fireEvent.mouseEnter(confirmButton);

		await waitFor(() => {
			const jobButton = screen.getByText("Job");
			fireEvent.click(jobButton);
		});

		expect(mockProps.handleJobConfirm).toHaveBeenCalledWith(1);
		expect(mockProps.closeContextMenu).toHaveBeenCalled();
	});

	test("displays the Assign Job to Unit submenu and assigns a unit correctly", async () => {
		const mockUnits = [
			{ id: 1, number: "Unit 1" },
			{ id: 2, number: "Unit 2" },
		];

		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockUnits),
			}),
		);

		render(<ContextMenu {...mockProps} />);

		const assignUnitButton = screen.getByText("Assign Job To Unit");
		fireEvent.mouseEnter(assignUnitButton);

		await waitFor(() => {
			expect(screen.getByText("Unit 1")).toBeInTheDocument();
			expect(screen.getByText("Unit 2")).toBeInTheDocument();
		});

		const unit1Button = screen.getByText("Unit 1");
		fireEvent.click(unit1Button);

		await waitFor(() => {
			expect(mockProps.updateJobUnit).toHaveBeenCalledWith(1, "Unit 1");
		});

		expect(mockProps.closeContextMenu).toHaveBeenCalled();

		global.fetch.mockRestore();
	});
});
