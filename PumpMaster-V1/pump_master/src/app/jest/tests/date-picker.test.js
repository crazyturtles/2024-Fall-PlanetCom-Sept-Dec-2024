import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DatePicker from "../../Components/DatePicker";

describe("DatePicker Component", () => {
	let mockOnDateChange;

	beforeEach(() => {
		mockOnDateChange = jest.fn();
	});

	test("renders the date picker button correctly", () => {
		const localDate = new Date(Date.UTC(2024, 11, 5));
		const adjustedDate = new Date(
			localDate.toLocaleString("en-US", { timeZone: "UTC" }),
		);

		render(<DatePicker selectedDate={adjustedDate} onDateChange={jest.fn()} />);

		const datePickerButton = screen.getByTestId("date-picker-button");
		expect(datePickerButton).toBeInTheDocument();
		expect(datePickerButton).toHaveTextContent("05-12-2024");
	});

	test("toggles the date picker popup when the button is clicked", async () => {
		render(
			<DatePicker
				selectedDate={new Date(2024, 11, 5)}
				onDateChange={jest.fn()}
			/>,
		);

		const datePickerButton = screen.getByTestId("date-picker-button");

		expect(screen.queryByText(/Select Year/i)).not.toBeInTheDocument();

		fireEvent.click(datePickerButton);

		const toggleYearButton = await screen.findByText(/December 2024/i);
		fireEvent.click(toggleYearButton);

		await waitFor(() => {
			expect(screen.getByText(/Select Year/i)).toBeInTheDocument();
		});

		fireEvent.click(datePickerButton);

		await waitFor(() => {
			expect(screen.queryByText(/Select Year/i)).not.toBeInTheDocument();
		});
	});

	test("selects a specific year", async () => {
		render(
			<DatePicker
				selectedDate={new Date(2024, 11, 5)}
				onDateChange={mockOnDateChange}
			/>,
		);

		const datePickerButton = screen.getByTestId("date-picker-button");
		fireEvent.click(datePickerButton);

		const toggleYearButton = await screen.findByText(/December 2024/i);
		fireEvent.click(toggleYearButton);

		const yearButton = await screen.findByText("2025");
		fireEvent.click(yearButton);

		expect(await screen.findByText(/Jan/i)).toBeInTheDocument();
	});

	test("selects a specific month", async () => {
		render(
			<DatePicker
				selectedDate={new Date(2024, 11, 5)}
				onDateChange={mockOnDateChange}
			/>,
		);

		const datePickerButton = screen.getByTestId("date-picker-button");
		fireEvent.click(datePickerButton);

		const toggleYearButton = await screen.findByText(/December 2024/i);
		fireEvent.click(toggleYearButton);

		const yearButton = await screen.findByText("2025");
		fireEvent.click(yearButton);

		const monthButton = await screen.findByText(/Mar/i);
		fireEvent.click(monthButton);

		expect(await screen.findByText("1")).toBeInTheDocument();
	});

	test("selects a specific month", async () => {
		render(
			<DatePicker
				selectedDate={new Date(2024, 11, 5)}
				onDateChange={mockOnDateChange}
			/>,
		);

		const datePickerButton = screen.getByTestId("date-picker-button");
		fireEvent.click(datePickerButton);

		const toggleYearButton = await screen.findByText(/December 2024/i);
		fireEvent.click(toggleYearButton);

		const yearButton = await screen.findByText("2025");
		fireEvent.click(yearButton);

		const monthButton = await screen.findByText(/Mar/i);
		fireEvent.click(monthButton);

		expect(await screen.findByText("1")).toBeInTheDocument();
	});

	test("selects a specific day", async () => {
		render(
			<DatePicker
				selectedDate={new Date(2024, 11, 5)}
				onDateChange={mockOnDateChange}
			/>,
		);

		const datePickerButton = screen.getByTestId("date-picker-button");
		fireEvent.click(datePickerButton);

		const dayButton = await screen.findByText("15");
		fireEvent.click(dayButton);

		expect(mockOnDateChange).toHaveBeenCalledWith(new Date(2024, 11, 15));
	});

	test("closes the popup when clicking outside", async () => {
		render(
			<DatePicker
				selectedDate={new Date(2024, 11, 5)}
				onDateChange={mockOnDateChange}
			/>,
		);

		const datePickerButton = screen.getByTestId("date-picker-button");
		fireEvent.click(datePickerButton);

		await waitFor(() => {
			expect(screen.getByText(/December 2024/i)).toBeInTheDocument();
		});

		fireEvent.mouseDown(document.body);
		fireEvent.click(document.body);

		await waitFor(() => {
			expect(screen.queryByText(/December 2024/i)).not.toBeInTheDocument();
		});
	});
});
