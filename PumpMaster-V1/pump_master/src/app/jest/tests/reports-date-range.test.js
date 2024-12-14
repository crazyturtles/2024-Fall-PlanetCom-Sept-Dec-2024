import { validateDateRange } from "@/app/Components/ReportsComponents/utils/dateUtils";

describe("Date Range Validation", () => {
	test("accepts valid date range", () => {
		expect(validateDateRange("2024-01-01", "2024-01-31")).toBe(true);
	});

	test("rejects end date before start date", () => {
		expect(validateDateRange("2024-01-31", "2024-01-01")).toBe(false);
	});

	test("rejects invalid date formats", () => {
		expect(validateDateRange("invalid", "2024-01-31")).toBe(false);
		expect(validateDateRange("2024-01-01", "invalid")).toBe(false);
	});

	test("handles null values", () => {
		expect(validateDateRange(null, "2024-01-31")).toBe(false);
		expect(validateDateRange("2024-01-01", null)).toBe(false);
		expect(validateDateRange(null, null)).toBe(false);
	});

	test("handles empty strings", () => {
		expect(validateDateRange("", "2024-01-31")).toBe(false);
		expect(validateDateRange("2024-01-01", "")).toBe(false);
		expect(validateDateRange("", "")).toBe(false);
	});
});
