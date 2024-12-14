// React Testing Library provides utilities for testing React components:
// - render: Renders React components into a test DOM
// - screen: Provides methods to query the test DOM (like getByText, getByTestId)
// - fireEvent: Simulates user interactions (clicks, form input, etc.)
// - waitFor: Waits for asynchronous operations to complete
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// Adds custom matchers to Jest for asserting on DOM elements
// Example: expect(element).toBeInTheDocument()
import "@testing-library/jest-dom";
import UnitsClientComponent from "../../(pages)/units/UnitsClientComponent";

// Mock data that simulates the shape of real data we expect from the backend
const mockPumpTypes = [
	{ PumpTypeID: 1, PumpTypeName: "Type A", PumpTypeStatus: 1 },
	{ PumpTypeID: 2, PumpTypeName: "Type B", PumpTypeStatus: 0 },
];

const mockOperators = [
	{ DriverID: 1, DriverName: "John Doe", DriverStatus: 1 },
	{ DriverID: 2, DriverName: "Jane Smith", DriverStatus: 0 },
];

const mockUnits = [
	{ UnitID: 1, UnitNumber: "Unit001", UnitStatus: 1 },
	{ UnitID: 2, UnitNumber: "Unit002", UnitStatus: 0 },
];

// Helper function that prepares the test environment.
// Jest lets us mock the fetch function using jest.fn()
// to return our test data instead of making real API calls
const setupTest = async () => {
	// Create a mock function for global fetch
	// The mock returns different data based on the URL being fetched
	global.fetch = jest.fn((url) => {
		if (url.includes("/units/all")) {
			return Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockUnits),
			});
		}
		if (url.includes("/pump-types")) {
			return Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockPumpTypes),
			});
		}
		if (url.includes("/operators")) {
			return Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockOperators),
			});
		}
		return Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ message: "Success" }),
		});
	});

	// Render the component with our mock data
	const result = render(
		<UnitsClientComponent
			initialUnits={mockUnits}
			initialPumpTypes={mockPumpTypes}
			initialOperators={mockOperators}
		/>,
	);

	// Simulate clicking the "New Unit" button
	// screen.getByText finds elements by their text content
	const newUnitButton = screen.getByText("New Unit");
	// fireEvent simulates user interactions - here, a click
	fireEvent.click(newUnitButton);

	// waitFor is used for async operations - it retries the callback until it succeeds
	// or times out. Here, we're waiting for the form to appear in the DOM
	await waitFor(() => {
		expect(screen.getByTestId("unit-form")).toBeInTheDocument();
	});

	return result;
};

// Jest provides lifecycle hooks that run before/after tests:
// beforeEach runs before each test case
beforeEach(() => {
	// Clear any previous mock function calls
	jest.clearAllMocks();
	// Reset any cached modules between tests
	jest.resetModules();
});

// afterEach runs after each test case
afterEach(() => {
	// Restore all mocks to their original implementation
	jest.restoreAllMocks();
});

// describe is used to group related tests together
// It helps organize tests and can share setup/teardown logic
describe("Unit Number Validation", () => {
	// it (or test) defines a single test case
	// The string describes what the test is checking
	it("should show error when Unit Number is empty", async () => {
		await setupTest();

		// screen.getByTestId finds elements by their data-testid attribute
		// This is preferred over finding by CSS selectors which can change
		const pumpTypeSelect = screen.getByTestId("pump-type-select");
		const operatorSelect = screen.getByTestId("operator-select");
		const serialNumberInput = screen.getByTestId("serial-number-input");
		const licensePlateInput = screen.getByTestId("license-plate-input");

		// fireEvent.change simulates user input in form fields
		fireEvent.change(pumpTypeSelect, { target: { value: "Type A" } });
		fireEvent.change(operatorSelect, { target: { value: "John Doe" } });
		fireEvent.change(serialNumberInput, { target: { value: "12345" } });
		fireEvent.change(licensePlateInput, { target: { value: "ABC123" } });

		// Simulate form submission
		const form = screen.getByTestId("unit-form");
		fireEvent.submit(form);

		// Wait for and test the error message
		// expect is Jest's assertion function
		// toBeInTheDocument and toBe are Jest matchers
		await waitFor(() => {
			const errorElement = screen.getByTestId("unit-number-error");
			expect(errorElement).toBeInTheDocument();
			expect(errorElement.textContent).toBe("Unit Number is required");
		});
	});
});

// Additional test suites follow the same pattern:
// 1. describe blocks group related tests
// 2. it blocks define individual test cases
// 3. Tests typically:
//    - Set up the component
//    - Simulate user actions
//    - Check the results
describe("Pump Type Validation", () => {
	it("should show error when Pump Type is not selected", async () => {
		await setupTest();

		const unitNumberInput = screen.getByTestId("unit-number-input");
		const operatorSelect = screen.getByTestId("operator-select");
		const serialNumberInput = screen.getByTestId("serial-number-input");
		const licensePlateInput = screen.getByTestId("license-plate-input");

		fireEvent.change(unitNumberInput, { target: { value: "Test123" } });
		fireEvent.change(operatorSelect, { target: { value: "John Doe" } });
		fireEvent.change(serialNumberInput, { target: { value: "12345" } });
		fireEvent.change(licensePlateInput, { target: { value: "ABC123" } });

		const form = screen.getByTestId("unit-form");
		fireEvent.submit(form);

		await waitFor(() => {
			const errorElement = screen.getByTestId("pump-type-error");
			expect(errorElement).toBeInTheDocument();
			expect(errorElement.textContent).toBe("Pump Type is required");
		});
	});
});

describe("Operator Validation", () => {
	it("should show error when Operator is not selected", async () => {
		await setupTest();

		const unitNumberInput = screen.getByTestId("unit-number-input");
		const pumpTypeSelect = screen.getByTestId("pump-type-select");
		const serialNumberInput = screen.getByTestId("serial-number-input");
		const licensePlateInput = screen.getByTestId("license-plate-input");

		fireEvent.change(unitNumberInput, { target: { value: "Test123" } });
		fireEvent.change(pumpTypeSelect, { target: { value: "Type A" } });
		fireEvent.change(serialNumberInput, { target: { value: "12345" } });
		fireEvent.change(licensePlateInput, { target: { value: "ABC123" } });

		const form = screen.getByTestId("unit-form");
		fireEvent.submit(form);

		await waitFor(() => {
			const errorElement = screen.getByTestId("operator-error");
			expect(errorElement).toBeInTheDocument();
			expect(errorElement.textContent).toBe("Operator is required");
		});
	});
});

describe("Serial Number Validation", () => {
	it("should show error when Serial Number is empty", async () => {
		await setupTest();

		const unitNumberInput = screen.getByTestId("unit-number-input");
		const pumpTypeSelect = screen.getByTestId("pump-type-select");
		const operatorSelect = screen.getByTestId("operator-select");
		const licensePlateInput = screen.getByTestId("license-plate-input");

		fireEvent.change(unitNumberInput, { target: { value: "Test123" } });
		fireEvent.change(pumpTypeSelect, { target: { value: "Type A" } });
		fireEvent.change(operatorSelect, { target: { value: "John Doe" } });
		fireEvent.change(licensePlateInput, { target: { value: "ABC123" } });

		const form = screen.getByTestId("unit-form");
		fireEvent.submit(form);

		await waitFor(() => {
			const errorElement = screen.getByTestId("serial-number-error");
			expect(errorElement).toBeInTheDocument();
			expect(errorElement.textContent).toBe("Serial Number is required");
		});
	});

	it("should show error when Serial Number exceeds 17 characters", async () => {
		await setupTest();

		const unitNumberInput = screen.getByTestId("unit-number-input");
		const pumpTypeSelect = screen.getByTestId("pump-type-select");
		const operatorSelect = screen.getByTestId("operator-select");
		const serialNumberInput = screen.getByTestId("serial-number-input");
		const licensePlateInput = screen.getByTestId("license-plate-input");

		fireEvent.change(unitNumberInput, { target: { value: "Test123" } });
		fireEvent.change(pumpTypeSelect, { target: { value: "Type A" } });
		fireEvent.change(operatorSelect, { target: { value: "John Doe" } });
		fireEvent.change(serialNumberInput, {
			target: { value: "123456789012345678" },
		});
		fireEvent.change(licensePlateInput, { target: { value: "ABC123" } });

		const form = screen.getByTestId("unit-form");
		fireEvent.submit(form);

		await waitFor(() => {
			const errorElement = screen.getByTestId("serial-number-error");
			expect(errorElement).toBeInTheDocument();
			expect(errorElement.textContent).toBe(
				"Serial Number must not be more than 17 characters",
			);
		});
	});
});

describe("License Plate Validation", () => {
	it("should show error when License Plate is empty", async () => {
		await setupTest();

		const unitNumberInput = screen.getByTestId("unit-number-input");
		const pumpTypeSelect = screen.getByTestId("pump-type-select");
		const operatorSelect = screen.getByTestId("operator-select");
		const serialNumberInput = screen.getByTestId("serial-number-input");

		fireEvent.change(unitNumberInput, { target: { value: "Test123" } });
		fireEvent.change(pumpTypeSelect, { target: { value: "Type A" } });
		fireEvent.change(operatorSelect, { target: { value: "John Doe" } });
		fireEvent.change(serialNumberInput, { target: { value: "12345" } });

		const submitButton = screen.getByTestId("submit-button");
		const licensePlateInput = screen.getByTestId("license-plate-input");

		fireEvent.change(licensePlateInput, { target: { value: "" } });

		fireEvent.click(submitButton);

		// waitFor can take an options object as its second argument
		// here we're setting a longer timeout for this assertion
		await waitFor(
			() => {
				const errorElement = screen.getByTestId("license-plate-error");
				expect(errorElement).toBeInTheDocument();
				expect(errorElement.textContent).toMatch(/license plate.*required/i);
			},
			{
				timeout: 2000,
			},
		);
	});
});

describe("Date Field Validations", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should accept valid date format for CVI Expiry", async () => {
		await setupTest();

		const dateInput = screen.getByTestId("cvi-expiry-date-input");
		fireEvent.change(dateInput, { target: { value: "2024-10-15" } });

		expect(dateInput.value).toBe("2024-10-15");
	});

	it("should accept valid date format for Boom Pipe Changed", async () => {
		await setupTest();

		const dateInput = screen.getByTestId("boom-pipe-changed-input");
		fireEvent.change(dateInput, { target: { value: "2024-10-15" } });

		expect(dateInput.value).toBe("2024-10-15");
	});
});

describe("Status Validation", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should have Status field required", async () => {
		await setupTest();

		const statusSelect = screen.getByTestId("status-select");
		expect(statusSelect).toBeRequired();
	});

	it("should only allow Active/Inactive options", async () => {
		await setupTest();

		const statusSelect = screen.getByTestId("status-select");
		const options = Array.from(statusSelect.options);

		expect(options.length).toBe(2);
		expect(options.map((opt) => opt.value)).toEqual(["1", "0"]);
	});
});
