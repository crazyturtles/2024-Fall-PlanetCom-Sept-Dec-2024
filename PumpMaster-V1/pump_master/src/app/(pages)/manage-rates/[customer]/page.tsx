"use client";

import { stringToRegex, validateObject, validateParam } from "@/app/util";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DefaultRates from "../../../Components/DefaultRates";
import InputField from "../../../Components/InputField";

interface PourTypeRate {
	PourTypeID: string;
	PourTypeName: string;
	FlatRate: string;
}

interface PumpTypeRate {
	PumpTypeID: string;
	PumpTypeName: string;
	HourlyRate: string;
	PourRate: string;
}

type InputChangeEvent = React.ChangeEvent<
	HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export default function Page({ params }: { params: { customer: number } }) {
	const CustomerID = params.customer;
	const router = useRouter();
	const [customerRates, setCustomerRates] = useState({
		customerName: "",
		customerDiscount: "",
		roadBan75: "",
		roadBan90: "",
		saturdayPour: "",
		washoutRate: "",
		secondaryOp: "",
		onsiteQA: "",
		addlDunnage: "",
		addlDeliveryLine: "",
		flagPerson: "",
		carbonLevy: "",
	});

	const [pourTypeRate, setPourTypeRate] = useState<PourTypeRate[]>([]);
	const [pumpTypeRate, setPumpTypeRate] = useState<PumpTypeRate[]>([]);

	const parseRates = useCallback(async () => {
		const response = await fetch(
			`http://localhost:3001/manage-rates/${CustomerID}`,
		);
		const json_data = await response.json();

		const customerratedata = validateObject(json_data.customerRateInfo, (p) =>
			stringToRegex(validateParam(p)).test(json_data.customerRateInfo[p]),
		)[0];

		setCustomerRates((prev) => ({
			...prev,
			customerName: `${customerratedata.CustomerFirstName} ${customerratedata.CustomerLastName}`,
			customerDiscount: customerratedata.Discount,
			roadBan75: customerratedata.RoadBan75Rate,
			roadBan90: customerratedata.RoadBan90Rate,
			saturdayPour: customerratedata.SaturdayPourRate,
			washoutRate: customerratedata.WashoutRate,
			secondaryOp: customerratedata.SecondaryOperatorRate,
			onsiteQA: customerratedata.OnsiteQaRate,
			addlDunnage: customerratedata.AdditionalDunnageRate,
			addlDeliveryLine: customerratedata.AdditionalLineRate,
			flagPerson: customerratedata.FlagPersonRate,
			carbonLevy: customerratedata.FuelSurchargeRate,
		}));

		setPourTypeRate(json_data.pourRateInfo);
		setPumpTypeRate(json_data.pumpRateInfo);
	}, [CustomerID]);

	useEffect(() => {
		void parseRates();
	}, [parseRates]);

	const handleChangeDefaultRates = (e: InputChangeEvent) => {
		const { name, value } = e.target;
		setCustomerRates({
			...customerRates,
			[name]: value,
		});
	};

	const handleChangePourType = (e: InputChangeEvent) => {
		const { name, value } = e.target;
		const index = Number.parseInt(e.target.dataset.index || "0", 10);
		const newList = [...pourTypeRate];
		newList[index] = {
			...newList[index],
			[name]: value,
		};
		setPourTypeRate(newList);
	};

	const handleChangePumpType = (e: InputChangeEvent) => {
		const { name, value } = e.target;
		const index = Number.parseInt(e.target.dataset.index || "0", 10);
		const newList = [...pumpTypeRate];
		newList[index] = {
			...newList[index],
			[name]: value,
		};
		setPumpTypeRate(newList);
	};

	const handleSave = async () => {
		await fetch(`http://localhost:3001/manage-rates/${CustomerID}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				customerratessql: `
          Discount = ${customerRates.customerDiscount},
          RoadBan75Rate =  ${customerRates.roadBan75},
          RoadBan90Rate = ${customerRates.roadBan90},
          SaturdayPourRate = ${customerRates.saturdayPour},
          WashoutRate = ${customerRates.washoutRate},
          SecondaryOperatorRate = ${customerRates.secondaryOp},
          OnsiteQaRate = ${customerRates.onsiteQA},
          AdditionalDunnageRate = ${customerRates.addlDunnage},
          AdditionalLineRate = ${customerRates.addlDeliveryLine},
          FlagPersonRate = ${customerRates.flagPerson},
          FuelSurchargeRate = ${customerRates.carbonLevy}
        `,
				pourTypeRateStringArgs: pourTypeRate
					.map(
						(record) => `when '${record.PourTypeID}' then '${record.FlatRate}'`,
					)
					.join("\n"),
				pumpTypeRateStringArgsHourlyRate: pumpTypeRate
					.map(
						(record) =>
							`when '${record.PumpTypeID}' then '${record.HourlyRate}'`,
					)
					.join("\n"),
				pumpTypeRateStringArgsPourRate: pumpTypeRate
					.map(
						(record) => `when '${record.PumpTypeID}' then '${record.PourRate}'`,
					)
					.join("\n"),
			}),
		});
	};

	const handleLoadDefaults = async () => {
		const response = await fetch("http://localhost:3001/company-information?");
		const json_data = await response.json();

		validateObject(json_data.companyInfo, (p) =>
			stringToRegex(validateParam(p)).test(json_data.companyInfo[p]),
		);

		const defaultData = json_data.defaultInfo;
		setCustomerRates({
			...customerRates,
			roadBan75: defaultData["default-RoadBan75-rate"],
			roadBan90: defaultData["default-RoadBan90-rate"],
			saturdayPour: defaultData["default-SaturdayPour-rate"],
			washoutRate: defaultData["default-washout-rate"],
			secondaryOp: defaultData["default-SecondaryOperator-rate"],
			onsiteQA: defaultData["default-OnsiteQa-rate"],
			addlDunnage: defaultData["default-AdditionalDunnage-rate"],
			addlDeliveryLine: defaultData["default-AdditionalLine-rate"],
			flagPerson: defaultData["default-FlagPerson-rate"],
			carbonLevy: defaultData["default-FuelSurcharge-rate"],
		});
	};

	return (
		<>
			<div className="flex bg-white text-black">
				<div className="m-10 w-1/2">
					<h1 className="mb-4 font-semibold text-black text-xl">
						Manage Rates for {customerRates.customerName}
					</h1>

					<div className="my-8 border-2 border-gray-300">
						<h2 className="mb-4 font-semibold text-black text-l">
							Flat Rates for Pour Types:
						</h2>
						<div className="h-96 overflow-x-auto">
							<table className="min-w-full border border-gray-300">
								<thead className="sticky top-0">
									<tr className="border-b bg-gray-100">
										<th className="px-4 py-2 text-left">Pour Type</th>
										<th className="px-4 py-2 text-left">Flat Rate</th>
									</tr>
								</thead>
								<tbody>
									{pourTypeRate.map((row, rowIndex) => (
										<tr key={row.PourTypeID} className="border-b">
											<td>{row.PourTypeName}</td>
											<td>
												<InputField
													type="number"
													name="FlatRate"
													value={row.FlatRate}
													index={rowIndex}
													onChange={handleChangePourType}
													sign="$"
													pattern={validateParam("FlatRate")}
													className="w-full rounded-md border border-gray-300 p-2"
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="my-8 border-2 border-gray-300">
						<h2 className="mb-4 font-semibold text-black text-l">
							Hourly Pour Rates by Unit
						</h2>
						<div className="h-96 overflow-x-auto">
							<table className="min-w-full border border-gray-300">
								<thead className="sticky top-0 h-full">
									<tr className="border-b bg-gray-100">
										<th className="px-4 py-2 text-left">Pump Type</th>
										<th className="px-4 py-2 text-left">Hourly Rate</th>
										<th className="px-4 py-2 text-left">Pour Rate</th>
									</tr>
								</thead>
								<tbody>
									{pumpTypeRate.map((row, rowIndex) => (
										<tr key={row.PumpTypeID} className="border-b">
											<td>{row.PumpTypeName}</td>
											<td>
												<InputField
													type="number"
													name="HourlyRate"
													value={row.HourlyRate}
													index={rowIndex}
													onChange={handleChangePumpType}
													sign="$"
													pattern={validateParam("HourlyRate")}
													className="w-full rounded-md border border-gray-300 p-2"
												/>
											</td>
											<td>
												<InputField
													type="number"
													name="PourRate"
													value={row.PourRate}
													index={rowIndex}
													onChange={handleChangePumpType}
													sign="$"
													pattern={validateParam("PourRate")}
													className="w-full rounded-md border border-gray-300 p-2"
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="m-10 w-1/2">
					<div className="grid grid-cols-1 gap-6 bg-white">
						<DefaultRates
							viewObject={customerRates}
							handleChange={handleChangeDefaultRates}
							fields={[
								{ label: "Customer Discount", name: "customerDiscount" },
								{ label: "75% Road Ban", name: "roadBan75" },
								{ label: "90% Road Ban", name: "roadBan90" },
								{ label: "Saturday Pour Rate", name: "saturdayPour" },
								{ label: "Washout Rate", name: "washoutRate" },
								{ label: "Secondary Op.", name: "secondaryOp" },
								{ label: "Onsite QA", name: "onsiteQA" },
								{ label: "Add'l Dunnage", name: "addlDunnage" },
								{ label: "Add'l Delivery Line", name: "addlDeliveryLine" },
								{ label: "Flag Person", name: "flagPerson" },
								{ label: "Carbon Levy %", name: "carbonLevy" },
							]}
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-end bg-white p-6">
				<button
					type="button"
					onClick={handleLoadDefaults}
					className="mr-4 rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-purple-700"
				>
					load defaults
				</button>
				<button
					type="button"
					onClick={router.back}
					className="mr-4 rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={handleSave}
					className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
				>
					Save
				</button>
			</div>
		</>
	);
}
