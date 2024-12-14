"use client";

import type React from "react";

type InputChangeEvent = React.ChangeEvent<
	HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

interface InputFieldProps {
	required?: boolean;
	type?: string;
	name: string;
	value: string;
	pattern?: string;
	onChange: (e: InputChangeEvent) => void;
	className?: string;
	sign?: string;
	index?: number;
	selectItems?: Record<string, string>[];
	radioItems?: Record<string, string>[];
}

export default function InputField({
	required = false,
	type = "text",
	name,
	value,
	pattern = "[\\s\\S]*",
	onChange,
	className = "",
	sign = "",
	index = -1,
	selectItems = [],
	radioItems = [],
}: InputFieldProps) {
	const commonProps = {
		name,
		value,
		onChange,
		className,
		"data-index": index !== -1 ? index : undefined,
	};

	return (
		<div className="flex">
			{type === "select" ? (
				<select {...commonProps}>
					{selectItems.map((item, i) => (
						<option key={i} value={Object.keys(item)[0]}>
							{Object.values(item)[0]}
						</option>
					))}
				</select>
			) : type === "textarea" ? (
				<textarea {...commonProps} />
			) : type === "radio" ? (
				<div className="flex gap-2">
					{radioItems.map((item, i) => (
						<label key={i} htmlFor={name}>
							<input
								type="radio"
								{...commonProps}
								checked={Object.keys(item)[0] === value}
								value={Object.keys(item)[0]}
							/>
							{Object.values(item)[0]}
						</label>
					))}
				</div>
			) : type === "datetime" ? (
				<input
					{...commonProps}
					type="date"
					value={
						value
							? value.slice(0, 10)
							: (() => {
									const today = new Date();
									return today.toISOString().split("T")[0];
								})()
					}
				/>
			) : (
				<>
					{sign && (
						<span className="mt-1 rounded-l-lg bg-gray-500 p-2 text-gray-100">
							{sign}
						</span>
					)}
					<input
						{...commonProps}
						required={required}
						type={type}
						pattern={pattern}
					/>
				</>
			)}
		</div>
	);
}
