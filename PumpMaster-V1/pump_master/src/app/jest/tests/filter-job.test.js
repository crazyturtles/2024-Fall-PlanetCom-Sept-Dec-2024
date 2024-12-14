import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterJob from "../../Components/FilterJob";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
	useSearchParams: jest.fn(),
}));

describe("FilterJob Component", () => {
	let mockOnDateChange;

	beforeEach(() => {
		useRouter.mockReturnValue({
			replace: jest.fn(),
		});

		useSearchParams.mockReturnValue({
			get: jest.fn(() => "2024-12-05"),
		});

		mockOnDateChange = jest.fn();
	});

	test("renders correctly with all expected elements", () => {
		render(<FilterJob onDateChange={mockOnDateChange} />);

		expect(screen.getByTestId("today-button")).toBeInTheDocument();
		expect(screen.getByTestId("previous-day")).toBeInTheDocument();
		expect(screen.getByTestId("next-day")).toBeInTheDocument();

		expect(screen.getByTestId("date-picker")).toBeInTheDocument();
	});

	test("initializes the selected date based on query parameters", () => {
		useSearchParams.mockReturnValue({
			get: jest.fn(() => "2024-12-10"),
		});

		render(<FilterJob onDateChange={mockOnDateChange} />);

		expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
		expect(mockOnDateChange.mock.calls[0][0].toISOString().slice(0, 10)).toBe(
			"2024-12-10",
		);
	});

	test("uses today's date as default when no query parameters are provided", () => {
		useSearchParams.mockReturnValue({
			get: jest.fn(() => null),
		});

		render(<FilterJob onDateChange={mockOnDateChange} />);

		const mockToday = new Date();
		const todayString = mockToday.toISOString().slice(0, 10);

		expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
		expect(mockOnDateChange.mock.calls[0][0].toISOString().slice(0, 10)).toBe(
			todayString,
		);
	});

	test("updates the router query string when the date changes", () => {
		const mockReplace = jest.fn();
		useRouter.mockReturnValue({
			replace: mockReplace,
		});

		render(<FilterJob onDateChange={mockOnDateChange} />);

		const previousDayButton = screen.getByTestId("previous-day");

		fireEvent.click(previousDayButton);

		expect(mockReplace).toHaveBeenCalledWith("?date=2024-12-04");
	});

	test("updates the date when previous or next buttons are clicked", () => {
		render(<FilterJob onDateChange={mockOnDateChange} />);

		const previousDayButton = screen.getByTestId("previous-day");
		const nextDayButton = screen.getByTestId("next-day");

		mockOnDateChange.mockClear();

		fireEvent.click(previousDayButton);
		expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
		expect(mockOnDateChange.mock.calls[0][0].toISOString().slice(0, 10)).toBe(
			"2024-12-04",
		);

		mockOnDateChange.mockClear();

		fireEvent.click(nextDayButton);
		expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
		expect(mockOnDateChange.mock.calls[0][0].toISOString().slice(0, 10)).toBe(
			"2024-12-05",
		);
	});

	test("resets the date to today when the Today button is clicked", () => {
		render(<FilterJob onDateChange={mockOnDateChange} />);

		const todayButton = screen.getByTestId("today-button");

		const mockToday = new Date();
		const normalizedToday = new Date(
			mockToday.getFullYear(),
			mockToday.getMonth(),
			mockToday.getDate(),
		);
		const todayString = normalizedToday.toISOString().slice(0, 10);

		mockOnDateChange.mockClear();

		fireEvent.click(todayButton);

		expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
		expect(
			new Date(mockOnDateChange.mock.calls[0][0]).toISOString().slice(0, 10),
		).toBe(todayString);
	});
});
