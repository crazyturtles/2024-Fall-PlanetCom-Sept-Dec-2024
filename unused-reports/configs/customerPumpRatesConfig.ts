import type { Column, HeaderGroup, ReportConfig } from "../types/reportTypes";
import { columnFormatters } from "../utils/formatters";

export interface CustomerPumpTypeRate {
	CustomerCompanyName: string;
	[key: string]: string | number;
}

export interface CustomerPumpTypeRateColumn
	extends Column<CustomerPumpTypeRate> {
	header: string;
	key: string;
	align?: "left" | "right" | "center";
	formatter?: (value: number) => string;
}

function createColumns(pumpTypes: string[]): CustomerPumpTypeRateColumn[] {
	const baseColumn: CustomerPumpTypeRateColumn = {
		header: "Company",
		key: "CustomerCompanyName",
		accessor: "",
	};

	const rateColumns = pumpTypes.flatMap(
		(pumpType): CustomerPumpTypeRateColumn[] => [
			{
				header: "Hourly Rate",
				key: `${pumpType}_HourlyRate`,
				align: "right",
				formatter: columnFormatters.currency,
				accessor: "",
			},
			{
				header: "Pour Rate",
				key: `${pumpType}_PourRate`,
				align: "right",
				formatter: columnFormatters.currency,
				accessor: "",
			},
		],
	);

	return [baseColumn, ...rateColumns];
}

function createHeaderGroups(pumpTypes: string[]): HeaderGroup[] {
	return [
		{ title: "", colspan: 1 },
		...pumpTypes.map((pumpType) => ({
			title: pumpType,
			colspan: 2,
		})),
	];
}

interface PumpRateResponse {
	data: CustomerPumpTypeRate[];
	pumpTypes: string[];
}

export const customerPumpRatesConfig: ReportConfig<CustomerPumpTypeRate> & {
	onDataReceived: (
		response: PumpRateResponse,
	) => Promise<CustomerPumpTypeRate[]>;
} = {
	title: "Customer Pump Type Rates",
	baseEndpoint: "/api/reports/customer-pumpTypeRates",
	columns: [],
	headerGroups: [],
	onDataReceived: async (response: PumpRateResponse) => {
		const { data, pumpTypes } = response;

		customerPumpRatesConfig.columns = createColumns(pumpTypes);
		customerPumpRatesConfig.headerGroups = createHeaderGroups(pumpTypes);

		return data;
	},
};
