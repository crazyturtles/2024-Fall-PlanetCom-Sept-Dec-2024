import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ChangeOperator from "../../Components/ChangeOperator";

describe("ChangeOperator Component", () => {
	const mockProps = {
		jobId: 1,
		currentDriverID: null,
		updateJobOperator: jest.fn(),
		onClose: jest.fn(),
	};

	global.fetch = jest.fn(() =>
		Promise.resolve({
			ok: true,
			json: () =>
				Promise.resolve([
					{ id: 1, name: "Operator A" },
					{ id: 2, name: "Operator B" },
				]),
		}),
	);

	test("fetches and displays operators in the dropdown", async () => {
		const mockProps = {
			jobId: 1,
			currentDriverID: null,
			updateJobOperator: jest.fn(),
			onClose: jest.fn(),
		};

		render(<ChangeOperator {...mockProps} />);

		expect(screen.getByText("Loading operators...")).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByText("Operator A")).toBeInTheDocument();
			expect(screen.getByText("Operator B")).toBeInTheDocument();
		});

		global.fetch.mockRestore();
	});

	test("displays the current operator", async () => {
		const mockProps = {
			jobId: 1,
			currentDriverID: 2,
			updateJobOperator: jest.fn(),
			onClose: jest.fn(),
		};

		global.fetch.mockImplementation(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						{ id: 1, name: "Operator A" },
						{ id: 2, name: "Operator B" },
					]),
			}),
		);

		render(<ChangeOperator {...mockProps} />);

		await waitFor(() => {
			expect(
				screen.getByText("Current Operator: Operator B"),
			).toBeInTheDocument();
		});

		global.fetch.mockRestore();
	});

	test("assigns operator successfully and calls updateJobOperator", async () => {
		global.fetch.mockImplementation((url) => {
			if (url.includes("assign-operator")) {
				return Promise.resolve({ ok: true });
			}
			return Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						{ id: 1, name: "Operator A" },
						{ id: 2, name: "Operator B" },
					]),
			});
		});

		render(<ChangeOperator {...mockProps} />);

		await waitFor(() => {
			expect(screen.getByText("Operator A")).toBeInTheDocument();
		});

		const dropdown = screen.getByLabelText("Select Operator:");
		fireEvent.change(dropdown, { target: { value: "1" } });

		const assignButton = screen.getByText("Assign");
		fireEvent.click(assignButton);

		await waitFor(() => {
			expect(mockProps.updateJobOperator).toHaveBeenCalledWith(1, "Operator A");
			expect(mockProps.onClose).toHaveBeenCalled();
		});

		global.fetch.mockRestore();
	});
});
