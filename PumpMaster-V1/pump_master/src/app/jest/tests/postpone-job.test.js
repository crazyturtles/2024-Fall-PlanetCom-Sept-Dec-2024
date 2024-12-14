import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostponeJob from "../../Components/PostponeJob";

describe("PostponeJob Component", () => {
	const mockProps = {
		jobId: 1,
		initialDate: new Date("2023-12-15"),
		updateJobStartDate: jest.fn(),
		onClose: jest.fn(),
	};

	test("renders correctly with initial values", () => {
		render(<PostponeJob {...mockProps} />);

		expect(screen.getByText("Postpone Job")).toBeInTheDocument();

		expect(screen.getByText("Current Date: 2023-12-15")).toBeInTheDocument();

		const dateInput = screen.getByLabelText("Select New Date:");
		expect(dateInput).toHaveValue("2023-12-15");

		expect(screen.getByText("Postpone")).toBeInTheDocument();
	});

	test("updates the selected date when the input changes", () => {
		const mockProps = {
			jobId: 1,
			initialDate: new Date("2023-12-15"),
			updateJobStartDate: jest.fn(),
			onClose: jest.fn(),
		};

		render(<PostponeJob {...mockProps} />);

		const dateInput = screen.getByLabelText("Select New Date:");

		fireEvent.change(dateInput, { target: { value: "2023-12-20" } });

		expect(screen.getByText("Postpone to: 2023-12-20")).toBeInTheDocument();
	});

	test("calls updateJobStartDate and onClose when postponing the job", async () => {
		const mockProps = {
			jobId: 1,
			initialDate: new Date("2023-12-15"),
			updateJobStartDate: jest.fn(),
			onClose: jest.fn(),
		};

		global.fetch = jest.fn(() =>
			Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
		);

		render(<PostponeJob {...mockProps} />);

		const postponeButton = screen.getByText("Postpone");

		fireEvent.click(postponeButton);

		expect(screen.getByText("Postponing...")).toBeInTheDocument();

		await waitFor(() => {
			expect(mockProps.updateJobStartDate).toHaveBeenCalledWith(
				1,
				new Date("2023-12-15"),
			);
			expect(mockProps.onClose).toHaveBeenCalled();
		});

		global.fetch.mockRestore();
	});
});
