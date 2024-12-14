// Import necessary testing utilities from React Testing Library
import { act, render, screen, waitFor } from "@testing-library/react";
// Import custom jest matchers for asserting on DOM elements
import "@testing-library/jest-dom";
// Import the component we're testing
import UnitsClientComponent from "../../(pages)/units/UnitsClientComponent";

// Mock the global fetch function
global.fetch = jest.fn();

// Describe block groups related tests together
describe("UnitsClientComponent", () => {
	// Before each test, clear any previous mock implementations of fetch
	beforeEach(() => {
		fetch.mockClear();
	});

	// Test case: Check if the component renders without crashing
	it("renders without crashing", async () => {
		// Mock the fetch function to return an empty array
		fetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		});

		// Use act to wrap any code causing updates to your component
		await act(async () => {
			render(
				<UnitsClientComponent
					initialUnits={[]}
					initialPumpTypes={[]}
					initialOperators={[]}
				/>,
			);
		});

		// Assert that the main heading "Units" is rendered
		expect(screen.getByText("Units")).toBeInTheDocument();
	});

	// Test case: Verify that initial units are rendered when provided
	it("renders initial units when provided", async () => {
		// Mock data for initial units
		const mockUnits = [
			{ UnitID: 1, UnitNumber: "Unit1", UnitStatus: 1 },
			{ UnitID: 2, UnitNumber: "Unit2", UnitStatus: 0 },
		];

		// Mock fetch to return an empty array (initial units are passed as props)
		fetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		});

		await act(async () => {
			render(
				<UnitsClientComponent
					initialUnits={mockUnits}
					initialPumpTypes={[]}
					initialOperators={[]}
				/>,
			);
		});

		// Wait for and assert that both mock units are rendered
		await waitFor(() => {
			expect(screen.getByText("Unit1")).toBeInTheDocument();
			expect(screen.getByText("Unit2")).toBeInTheDocument();
		});
	});

	// Test case: Check if "No units found" is displayed when there are no units
	it('displays "No units found" when there are no units', async () => {
		fetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		});

		await act(async () => {
			render(
				<UnitsClientComponent
					initialUnits={[]}
					initialPumpTypes={[]}
					initialOperators={[]}
				/>,
			);
		});

		// Wait for and assert that "No units found" message is displayed
		await waitFor(() => {
			expect(screen.getByText("No units found")).toBeInTheDocument();
		});
	});

	// Test case: Verify that filter buttons are rendered
	it("renders filter buttons", async () => {
		fetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		});

		await act(async () => {
			render(
				<UnitsClientComponent
					initialUnits={[]}
					initialPumpTypes={[]}
					initialOperators={[]}
				/>,
			);
		});

		// Assert that all three filter buttons are present
		expect(screen.getByText("All")).toBeInTheDocument();
		expect(screen.getByText("Active")).toBeInTheDocument();
		expect(screen.getByText("Inactive")).toBeInTheDocument();
	});

	// Test case: Check if "New Unit" button is rendered
	it('renders "New Unit" button', async () => {
		fetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		});

		await act(async () => {
			render(
				<UnitsClientComponent
					initialUnits={[]}
					initialPumpTypes={[]}
					initialOperators={[]}
				/>,
			);
		});

		// Assert that the "New Unit" button is present
		expect(screen.getByText("New Unit")).toBeInTheDocument();
	});
});
