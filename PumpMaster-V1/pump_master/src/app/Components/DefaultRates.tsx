"use client";

import InputField from "@/app/Components/InputField";
import { validateParam } from "../util";

export default function DefaultRates({ viewObject, handleChange, fields }) {
	return (
		<div>
			<h2 className="mb-4 font-semibold text-black text-xl">Default Rates</h2>
			{fields.map((field, index) => (
				<div key={index} className="mb-4">
					<label
						className="block font-medium text-gray-700 text-sm"
						htmlFor={field.name}
					>
						{field.label}:
					</label>
					<InputField
						required
						type="number"
						name={field.name}
						value={viewObject[field.name]}
						pattern={validateParam(field.name)}
						onChange={handleChange}
						sign={
							field.name === "carbonLevy" || field.name === "customerDiscount"
								? "%"
								: "$"
						}
						className="mt-1 block w-full rounded-r-lg border border-gray-300 p-2 text-black"
					/>
				</div>
			))}
		</div>
	);
}
