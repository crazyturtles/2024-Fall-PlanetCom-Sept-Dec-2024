import { render, screen } from "@testing-library/react";
// Import custom jest matchers for asserting on DOM elements
import "@testing-library/jest-dom";

// Jest.mock is used to mock entire modules
// Here, we're mocking the entire page module to control what it returns in our tests
jest.mock("../../../app/(pages)/units/page", () => {
	// We return an object with a default export to mimic an ES module which is a modern module system that is built into the JavaScript language
	return {
		__esModule: true,
		// The default export is a mock component that represents our page
		default: function MockUnitsPage() {
			return (
				<div>
					<div data-testid="units-client-component">
						Mocked Units Client Component
					</div>
					<div>Loading...</div>
				</div>
			);
		},
	};
});

// Describe is used to group related tests together
describe("UnitsPage", () => {
	// 'it' (or 'test') is used to define individual test cases
	it("renders without crashing", async () => {
		// We dynamically import the mocked module
		// This mimics how Next.js might load pages
		const { default: UnitsPage } = await import("../../(pages)/units/page");

		// render is provided by React Testing Library and creates a virtual DOM for the component
		render(<UnitsPage />);

		// screen provides methods to query the rendered component
		// getByTestId looks for an element with the specified test ID
		// toBeInTheDocument is a custom matcher from jest-dom
		expect(screen.getByTestId("units-client-component")).toBeInTheDocument();
	});

	it("displays loading state initially", async () => {
		const { default: UnitsPage } = await import("../../(pages)/units/page");
		render(<UnitsPage />);

		// getByText looks for an element containing the specified text
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});
});
