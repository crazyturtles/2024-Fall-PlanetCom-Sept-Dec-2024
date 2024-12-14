"use client";

import { formatInput, validateParam } from "@/app/util";
import { useEffect, useState } from "react";
import DefaultRates from "../../Components/DefaultRates";
import SmtpTest from "../../api/SmtpTest/SmtpTest";

//import getCompanyInfo from "../../api/PumpMasterBackend/PumpMasterBackend";

const CompanyForm = () => {
	const [companyInfo, setCompanyInfo] = useState({
		companyName: "",
		address: "",
		city: "",
		province: "",
		postalCode: "",
		phone: "",
		website: "",
		email: "",
		defaultRateHr: "0",
		defaultRateM3: "0",
		roadBan75: "55.0",
		roadBan90: "25.0",
		saturdayPour: "65.0",
		washoutRate: "120.0",
		secondaryOp: "85.0",
		onsiteQA: "85.0",
		addlDunnage: "85.0",
		addlDeliveryLine: "85.0",
		flagPerson: "85.0",
		carbonLevy: 5.0,
		smtpServer: "",
		smtpPort: 25,
		smtpTLS: false,
		smtpUsername: "",
		smtpPassword: "",
		emailFrom: "",
	});

	const [smtpValid, setSmtpValid] = useState("");

	const parseCompanyInfo = async () => {
		fetch("http://localhost:3001/company-information", {
			method: "GET",
			//mode: "no-cors",
		})
			.then((res) => res.json())
			.then((json_data) => {
				const companyData = json_data.companyInfo;
				const defaultData = json_data.defaultInfo;
				setCompanyInfo({
					...companyInfo,
					companyName: companyData.CompanyName,
					address: companyData.CompanyAddress,
					city: companyData.CompanyCity,
					province: companyData.CompanyProvince,
					postalCode: companyData.CompanyPostalCode,
					phone: companyData.CompanyPhone,
					website: companyData.CompanyWebsite,
					email: companyData.CompanyEmail,
					defaultRateHr: defaultData["default-hourly-rate"],
					defaultRateM3: defaultData["default-pour-rate"],
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
					smtpServer: companyData.CompanySMTPServer,
					smtpPort: companyData.CompanySMTPPort,
					smtpTLS: companyData.CompanySMTPUseTls,
					smtpUsername: companyData.CompanySMTPUsername,
					smtpPassword: companyData.CompanySMTPPassword,
					emailFrom: companyData.CompanySMTPFromAddress,
				});
			});
	};

	useEffect(() => {
		parseCompanyInfo();
	}, []);

	const handleChange = (e: any) => {
		let { name, value, type } = e.target;
		if (type === "tel") {
			value = formatInput(value);
		}
		setCompanyInfo({
			...companyInfo,
			[name]: value,
		});
		console.log(companyInfo);
	};

	const handleChangeSmtp = (e: any) => {
		const { name, value } = e.target;
		setCompanyInfo({
			...companyInfo,
			[name]: value,
		});
		setSmtpValid("");
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		fetch("http://localhost:3001/company-information", {
			method: "PUT",
			//mode: "no-cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				companysql: `
						CompanyName = \'${companyInfo.companyName}\',\n
						CompanyAddress = \'${companyInfo.address}\',\n
						CompanyCity = \'${companyInfo.city}\',\n 
						CompanyProvince = \'${companyInfo.province}\',\n 
						CompanyPostalCode = \'${companyInfo.postalCode}\',\n 
						CompanyPhone = \'${companyInfo.phone}\',\n 
						CompanyWebsite = \'${companyInfo.website}\',\n 
						CompanyEmail = \'${companyInfo.email}\',\n 
						CompanySMTPServer = \'${companyInfo.smtpServer}\',\n 
						CompanySMTPPort = \'${companyInfo.smtpPort}\',\n 
						CompanySMTPUseTls = \'${companyInfo.smtpTLS}\',\n 
						CompanySMTPUsername = \'${companyInfo.smtpUsername}\',\n 
						CompanySMTPPassword = \'${companyInfo.smtpPassword}\',\n 
						CompanySMTPFromAddress = \'${companyInfo.emailFrom}\'\n 
						`,
				defaultratessql: `
						when \'default-hourly-rate\' then \'${companyInfo.defaultRateHr}\'\n
						when \'default-pour-rate\' then \'${companyInfo.defaultRateM3}\'\n
						when \'default-RoadBan75-rate\' then \'${companyInfo.roadBan75}\'\n
						when \'default-RoadBan90-rate\' then \'${companyInfo.roadBan90}\'\n
						when \'default-SaturdayPour-rate\' then \'${companyInfo.saturdayPour}\'\n
						when \'default-washout-rate\' then \'${companyInfo.washoutRate}\'\n
						when \'default-SecondaryOperator-rate\' then \'${companyInfo.secondaryOp}\'\n
						when \'default-OnsiteQa-rate\' then \'${companyInfo.onsiteQA}\'\n
						when \'default-AdditionalDunnage-rate\' then \'${companyInfo.addlDunnage}\'\n
						when \'default-AdditionalLine-rate\' then \'${companyInfo.addlDeliveryLine}\'\n
						when \'default-FlagPerson-rate\' then \'${companyInfo.flagPerson}\'\n
						when \'default-FuelSurcharge-rate\' then \'${companyInfo.carbonLevy}\'\n
				`,
			}),
		}).then((res) => console.log(res));

		// const res = await getCompanyInfo();
		// console.log(res);
	};

	const handleSMTPTest = () => {
		console.log(companyInfo.smtpTLS);
		setSmtpValid("Validating SMTP...");
		SmtpTest(
			companyInfo.smtpServer,
			companyInfo.smtpPort,
			companyInfo.smtpTLS,
		).then((status) => {
			if (status === "OK") {
				setSmtpValid("SMTP valid");
			} else if (status === "INVALID") {
				setSmtpValid("SMTP Invalid");
			} else {
				setSmtpValid(status);
			}
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-md"
		>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{/* Column 1: Company Default Information */}
				<div>
					<h2 className="mb-4 font-semibold text-black text-xl">
						Company Default Information
					</h2>

					{[
						{ label: "Company Name", name: "companyName", required: true },
						{
							label: "Address",
							name: "address",
							required: true,
							type: "textarea",
						},
						{ label: "City", name: "city", required: true },
						{ label: "Province", name: "province", required: true },
						{ label: "Postal Code", name: "postalCode", required: true },
						{ label: "Phone", name: "phone", required: true, type: "tel" },
						{ label: "Website", name: "website", required: true },
						{ label: "Email", name: "email", required: true, type: "email" },
					].map((field, index) => (
						<div key={index} className="mb-4">
							<label
								className="block font-medium text-gray-700 text-sm"
								htmlFor={field.name}
							>
								{field.label}:{" "}
								{field.required && <span className="text-red-500">*</span>}
							</label>
							{field.type === "textarea" ? (
								<textarea
									name={field.name}
									value={companyInfo[field.name]}
									onChange={handleChange}
									required={field.required}
									className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
								/>
							) : (
								<input
									type={field.type || "text"}
									name={field.name}
									value={
										(field.type === "tel" &&
											formatInput(companyInfo[field.name])) ||
										companyInfo[field.name]
									}
									onChange={handleChange}
									required={field.required}
									pattern={validateParam(field.name)}
									className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
								/>
							)}
						</div>
					))}
				</div>

				{/* Column 2: Default Rates */}
				<DefaultRates
					viewObject={companyInfo}
					handleChange={handleChange}
					fields={[
						{ label: "Default Rate/hr", name: "defaultRateHr" },
						{ label: "Default Rate/m3", name: "defaultRateM3" },
						{ label: "75% Road Ban", name: "roadBan75" },
						{ label: "90% Road Ban", name: "roadBan90" },
						{ label: "Saturday Pour", name: "saturdayPour" },
						{ label: "Washout Rate", name: "washoutRate" },
						{ label: "Secondary Op.", name: "secondaryOp" },
						{ label: "Onsite QA", name: "onsiteQA" },
						{ label: "Add'l Dunnage", name: "addlDunnage" },
						{ label: "Add'l Delivery Line", name: "addlDeliveryLine" },
						{ label: "Flag Person", name: "flagPerson" },
						{ label: "Carbon Levy %", name: "carbonLevy" },
					]}
				/>

				{/* Column 3: Email Server Settings */}
				<div>
					<h2 className="mb-4 font-semibold text-black text-xl">
						Email Server Settings
					</h2>
					{[
						{ label: "SMTP Server", name: "smtpServer", required: true },
						{
							label: "SMTP Port",
							name: "smtpPort",
							type: "number",
							required: true,
						},
						{ label: "SMTP Username", name: "smtpUsername", required: false },
						{
							label: "SMTP Password",
							name: "smtpPassword",
							type: "password",
							required: false,
						},
						{ label: "Email FROM Address", name: "emailFrom", type: "email" },
					].map((field, index) => (
						<div key={index} className="mb-4">
							<label
								className="block font-medium text-gray-700 text-sm"
								htmlFor={field.name}
							>
								{field.label}:
							</label>
							<input
								type={field.type || "text"}
								name={field.name}
								value={companyInfo[field.name]}
								onChange={handleChange}
								pattern={validateParam(field.name)}
								required={field.required}
								className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
							/>
						</div>
					))}
				</div>
			</div>
			{/* SMTP test */}
			<div className="mt-6 flex justify-end">
				{(smtpValid === "SMTP valid" && (
					<div className=" mr-4 px-4 py-2 text-green-500">
						{<p>SMTP valid</p>}
					</div>
				)) || (
					<div className=" mr-4 px-4 py-2 text-red-500">
						<p className="text-green">{smtpValid}</p>
					</div>
				)}

				<button
					type="button"
					onClick={handleSMTPTest}
					className=" rounded-md bg-orange-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
				>
					test SMTP
				</button>
			</div>
			{/* Form Submission */}
			<div className="mt-6 flex justify-end">
				<button
					type="button"
					onClick={parseCompanyInfo}
					className="mr-4 rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
				>
					Save
				</button>
			</div>
		</form>
	);
};

export default CompanyForm;
