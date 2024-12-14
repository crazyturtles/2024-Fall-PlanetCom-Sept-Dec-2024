export type ModalSize = "sm" | "md" | "lg";

export interface BaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	size?: ModalSize;
}

export interface ModalFormProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	fields: FormField[];
	onSubmit: (e: React.FormEvent) => void;
	submitLabel?: string;
	isSubmitDisabled?: boolean;
	size?: "sm" | "md" | "lg";
	children?: React.ReactNode;
	extraButtons?: React.ReactNode;
}

export interface FormField {
	id: string;
	label: string;
	type: "text" | "select" | "date" | "number" | "radio" | "custom";
	value: any;
	onChange: (value: any) => void;
	options?: Array<{ value: string; label: string }>;
	disabled?: boolean;
	step?: number;
	render?: () => React.ReactNode;
}

export interface CustomerSelectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (customerId: string, customerName: string) => void;
	showUnitSearch?: boolean;
}
