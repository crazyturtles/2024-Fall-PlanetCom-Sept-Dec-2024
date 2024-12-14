"use client";

import InputField from "@/app/Components/InputField";
import { formatInput, validateParam } from "@/app/util";
import { Suspense, useEffect, useState } from "react";
import "../../../public/css/form.css";
import MessageModal from "@/app/Components/MessageModal";
import SuccessDialog from "@/app/Components/SuccessDialog";
import { useRouter } from "next/navigation";

interface ForeignEntity {
	entityName: string;
	display: string;
	url: string;
}

interface Field {
	name: string;
	label: string;
	value: string;
	columnName: string;
	required?: boolean;
	type?: string;
	sign?: string;
	selectItems?: Array<Record<string, string>>;
	radioItems?: Array<Record<string, string>>;
	pattern?: string;
	foreignEntity?: ForeignEntity;
}

interface CRUDFormProps {
	entityName: string;
	selectedID: number;
	fields: Field[];
	fetchLink: string;
	defaultRates?: string[];
	children?: React.ReactNode;
	onSuccess?: () => void;
}

export default function CRUDForm({
	entityName,
	selectedID,
	fields,
	fetchLink,
	defaultRates = [],
	children,
	onSuccess,
}: CRUDFormProps) {
	const defaultViewModel = () => {
		return fields.reduce<Record<string, string>>((viewModel, field) => {
			if (field.name === "status" && field.value === "") {
				viewModel[field.name] = "1";
			} else {
				viewModel[field.name] = field.value;
			}
			return viewModel;
		}, {});
	};

	const router = useRouter();
	const [viewModel, setViewModel] = useState<Record<string, string>>(
		defaultViewModel(),
	);
	const [foreignEntityList, setForeignEntityList] = useState<
		Record<string, Record<string, string>[]>
	>({});
	const [isLoaded, setIsLoaded] = useState(false);
	const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

	const populateForm = () => {
		const newViewModel = (json_data: Record<string, any>) => {
			return fields.reduce<Record<string, string>>(
				(res, field) => {
					res[field.name] = json_data[field.columnName];
					return res;
				},
				{ ...viewModel },
			);
		};
		if (selectedID !== 0) {
			try {
				fetch(
					`http://localhost:3001/${fetchLink}/${selectedID}?` +
						`${new URLSearchParams({
							fields: `${fields
								.map((field) => `${field.columnName}, `)
								.join("")
								.slice(0, -2)}`,
						})}`,
					{
						method: "GET",
					},
				)
					.then((res) => res.json())
					.then((json_data) => {
						setViewModel(newViewModel(json_data[0]));
					});
			} catch (err) {
				console.log(err);
			}
		}
	};

	const populateForeignKeys = async () => {
		const newForeignEntityList = async (
			json_data: Record<string, any>[],
			field: Field,
			lastForeignEntityList: Record<string, Record<string, string>[]>,
		) => {
			if (!field.foreignEntity) return lastForeignEntityList;

			const entityName = field.foreignEntity.entityName;
			return {
				...lastForeignEntityList,
				[entityName]: json_data.map((record) => ({
					[Object.values(record)[0]]: Object.values(record)[1],
				})),
			};
		};

		for await (const field of fields.filter((field) => field.foreignEntity)) {
			try {
				if (!field.foreignEntity) continue;
				const res = await fetch(
					`http://localhost:3001/${field.foreignEntity.url}/0?` +
						`${new URLSearchParams({
							fields: `${field.foreignEntity.entityName}ID, ${field.foreignEntity.display}`,
						})}`,
					{
						method: "GET",
					},
				);
				const json_data = await res.json();
				setForeignEntityList(
					await newForeignEntityList(json_data, field, foreignEntityList),
				);
			} catch (err) {
				console.log(err);
			}
		}
	};

	useEffect(() => {
		if (selectedID === 0) {
			setViewModel(defaultViewModel());
		}
		populateForeignKeys().then(() => setIsLoaded(true));
		populateForm();
	}, [selectedID]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		let { name, value, type } = e.target;
		if (type === "tel") {
			value = formatInput(value);
		}
		setViewModel({
			...viewModel,
			[name]: value,
		});
	};

	const handleCancel = () => {
		router.back();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`http://localhost:3001/${fetchLink}/${selectedID}?`,
				{
					method: selectedID === 0 ? "POST" : "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						fields: `${fields
							.map((field) => `${field.columnName}, `)
							.join("")
							.slice(0, -2)}`,
						values: `${fields
							.map((field) => {
								return typeof viewModel[field.name] === "string"
									? `\'${viewModel[field.name]}\', `
									: `${viewModel[field.name]}, `;
							})
							.join("")
							.slice(0, -2)}`,
						defaultValues: defaultRates,
					}),
				},
			);

			if (response.ok) {
				setIsSuccessDialogOpen(true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleCloseSuccessDialog = () => {
		setIsSuccessDialogOpen(false);
		setViewModel(defaultViewModel());
		onSuccess?.();
	};

	return (
		<>
			{(isLoaded && (
				<form onSubmit={handleSubmit} className="form-container w-11/12">
					<div>
						<h2 className="form-title">Edit {entityName}</h2>
						{fields.map((field, index) => (
							<div key={index} className="form-field">
								<label className="form-label" htmlFor={field.name}>
									{field.label}:{" "}
									{field.required && <span className="form-required">*</span>}
								</label>
								<InputField
									type={field.type}
									name={field.name}
									value={
										(field.type === "tel" &&
											formatInput(viewModel[field.name])) ||
										viewModel[field.name]
									}
									onChange={handleChange}
									required={field.required}
									sign={field.sign}
									selectItems={
										field.selectItems ||
										(field.foreignEntity &&
											foreignEntityList[field.foreignEntity.entityName])
									}
									radioItems={field.radioItems}
									pattern={
										field.pattern ? field.pattern : validateParam(field.name)
									}
									className="input-field"
								/>
							</div>
						))}
					</div>
					{children}
					<div className="button-group">
						{entityName === "Operators" && (
							<button
								type="button"
								onClick={() => setIsMessageModalOpen(true)}
								className="button-submit bg-purple-600"
							>
								Send Message
							</button>
						)}
						<button type="submit" className="button-submit bg-blue-600">
							{selectedID === 0 ? "Add" : "Save"}
						</button>
						{selectedID !== 0 && entityName === "Customer" && (
							<button
								type="button"
								onClick={() => router.push(`/manage-rates/${selectedID}`)}
								className="button-submit bg-purple-600"
							>
								Manage Rates
							</button>
						)}
						<button
							type="button"
							onClick={handleCancel}
							className="button-cancel"
						>
							Cancel
						</button>
					</div>
				</form>
			)) || <Suspense fallback={<div>Loading...</div>} />}
			<MessageModal
				isOpen={isMessageModalOpen}
				onClose={() => setIsMessageModalOpen(false)}
				DriverID={selectedID}
				onMessageSent={(jobId: number, status: boolean): void => {
					throw new Error("Function not implemented.");
				}}
			/>
			<SuccessDialog
				isOpen={isSuccessDialogOpen}
				message={`${entityName} has been ${selectedID === 0 ? "added" : "updated"} successfully.`}
				onClose={handleCloseSuccessDialog}
			/>
		</>
	);
}
