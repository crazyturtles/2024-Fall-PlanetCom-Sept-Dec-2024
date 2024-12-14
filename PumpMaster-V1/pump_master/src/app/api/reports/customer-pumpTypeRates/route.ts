import { NextResponse } from "next/server";

interface RawPumpRate {
	CustomerCompanyName: string;
	PumpTypeName: string;
	PumpTypeHourlyRate: number;
	PumpTypePourRate: number;
}

interface TransformedPumpRate {
	CustomerCompanyName: string;
	[key: string]: number | string; // For dynamic pump type rate columns
}

function transformPumpRateData(
	data: RawPumpRate[],
	pumpTypes: string[],
): TransformedPumpRate[] {
	// Group data by company
	const companiesMap = new Map<string, TransformedPumpRate>();

	// Initialize map with companies and empty rate structure
	data.forEach((rate) => {
		if (!companiesMap.has(rate.CustomerCompanyName)) {
			const companyData: TransformedPumpRate = {
				CustomerCompanyName: rate.CustomerCompanyName,
			};

			// Initialize all pump type rates to 0
			pumpTypes.forEach((pumpType) => {
				companyData[`${pumpType}_HourlyRate`] = 0;
				companyData[`${pumpType}_PourRate`] = 0;
			});

			companiesMap.set(rate.CustomerCompanyName, companyData);
		}
	});

	// Fill in actual rates
	data.forEach((rate) => {
		const companyData = companiesMap.get(rate.CustomerCompanyName);
		if (companyData) {
			companyData[`${rate.PumpTypeName}_HourlyRate`] = rate.PumpTypeHourlyRate;
			companyData[`${rate.PumpTypeName}_PourRate`] = rate.PumpTypePourRate;
		}
	});

	return Array.from(companiesMap.values());
}

export async function GET() {
	try {
		const response = await fetch(
			"http://localhost:3001/reports/customer-pumpTypeRates",
			{
				headers: {
					"Content-Type": "application/json",
				},
				next: { revalidate: 0 },
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const rawData: RawPumpRate[] = await response.json();

		// Get unique pump types and sort them
		const pumpTypes = Array.from(
			new Set(rawData.map((rate) => rate.PumpTypeName)),
		).sort();

		// Transform data into matrix format
		const transformedData = transformPumpRateData(rawData, pumpTypes);

		return NextResponse.json({
			data: transformedData,
			pumpTypes: pumpTypes,
		});
	} catch (error) {
		console.error("Error fetching customer pump type rates:", error);
		return NextResponse.json(
			{ error: "Failed to fetch customer pump type rates" },
			{ status: 500 },
		);
	}
}
