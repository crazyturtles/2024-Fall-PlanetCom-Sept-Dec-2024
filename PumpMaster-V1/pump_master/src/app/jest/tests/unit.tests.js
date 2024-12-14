import { render, screen } from "@testing-library/react";
import Page from "../../(pages)/units/page";

jest.mock("../../(pages)/units/UnitsClientComponent.tsx", () => {
	return function MockUnitsClientComponent() {
		return (
			<div data-testid="units-client-component">
				Mocked UnitsClientComponent
			</div>
		);
	};
});

describe("Units Page", () => {
	it("renders correctly", async () => {
		// Test for: page renders correctly
		render(await Page());
		expect(screen.getByTestId("units-client-component")).toBeInTheDocument();
	});
});
