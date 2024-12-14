import Modal from "../../Modal";
import type { FormField, ModalFormProps } from "./modalTypes";

export function ModalForm({
	isOpen,
	onClose,
	title,
	fields,
	onSubmit,
	submitLabel = "OK",
	isSubmitDisabled = false,
	size = "md",
	children,
	extraButtons,
}: ModalFormProps) {
	const renderField = (field: FormField) => {
		if (field.type === "radio") {
			return (
				<div className="flex gap-4">
					{field.options?.map((option) => (
						<label key={option.value} className="flex items-center gap-2">
							<input
								type="radio"
								name={field.id}
								value={option.value}
								checked={field.value === option.value}
								onChange={(e) => field.onChange(e.target.value)}
								className="h-4 w-4"
							/>
							<span className="text-sm">{option.label}</span>
						</label>
					))}
				</div>
			);
		}

		if (field.type === "select") {
			return (
				<select
					id={field.id}
					className="w-full rounded border bg-white p-2"
					value={field.value}
					onChange={(e) => field.onChange(e.target.value)}
					disabled={field.disabled}
				>
					<option value="">Select...</option>
					{field.options?.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			);
		}

		return (
			<input
				id={field.id}
				type={field.type}
				className="w-full rounded border bg-white p-2"
				value={field.value}
				onChange={(e) => field.onChange(e.target.value)}
				disabled={field.disabled}
			/>
		);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className={"bg-white p-6 text-gray-900"}>
				<h2 className="mb-4 font-semibold text-lg">{title}</h2>
				<form onSubmit={onSubmit} className="space-y-4">
					{fields.map((field) => (
						<div key={field.id}>
							<label
								htmlFor={field.id}
								className="mb-1 block font-medium text-sm"
							>
								{field.label}
							</label>
							{renderField(field)}
						</div>
					))}
					<div className="mt-4 flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded border px-4 py-2 text-gray-900 hover:bg-gray-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitDisabled}
							className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
						>
							{submitLabel}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
