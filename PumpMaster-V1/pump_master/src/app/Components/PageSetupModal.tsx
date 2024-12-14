import { useState } from "react";
import { ModalForm } from "./ReportsComponents/ReportsModalComponents/ModalForm";
import type { FormField } from "./ReportsComponents/ReportsModalComponents/modalTypes";

// Page sizes in millimeters
const PAGE_SIZES = {
	Letter: { width: 215.9, height: 279.4 }, // 8.5 x 11 inches
	Legal: { width: 215.9, height: 355.6 }, // 8.5 x 14 inches
	A4: { width: 210, height: 297 }, // 210 x 297 mm
};

export interface PageSetupState {
	size: keyof typeof PAGE_SIZES;
	orientation: "portrait" | "landscape";
	margins: {
		left: number;
		right: number;
		top: number;
		bottom: number;
	};
	dimensions: {
		width: number;
		height: number;
	};
}

interface PageSetupModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (settings: PageSetupState) => void;
}

export default function PageSetupModal({
	isOpen,
	onClose,
	onSave,
}: PageSetupModalProps) {
	const [pageSetup, setPageSetup] = useState<PageSetupState>({
		size: "Letter",
		orientation: "landscape",
		margins: {
			left: 6.35, // 1/4 inch in mm
			right: 6.35,
			top: 6.35,
			bottom: 6.35,
		},
		dimensions: PAGE_SIZES.Letter,
	});

	const updatePageDimensions = (
		size: keyof typeof PAGE_SIZES,
		orientation: "portrait" | "landscape",
	) => {
		const baseDimensions = PAGE_SIZES[size];
		if (orientation === "portrait") {
			return {
				width: Math.min(baseDimensions.width, baseDimensions.height),
				height: Math.max(baseDimensions.width, baseDimensions.height),
			};
		}
		return {
			width: Math.max(baseDimensions.width, baseDimensions.height),
			height: Math.min(baseDimensions.width, baseDimensions.height),
		};
	};

	const handleSizeChange = (newSize: keyof typeof PAGE_SIZES) => {
		setPageSetup((prev) => ({
			...prev,
			size: newSize,
			dimensions: updatePageDimensions(newSize, prev.orientation),
		}));
	};

	const handleOrientationChange = (
		newOrientation: "portrait" | "landscape",
	) => {
		setPageSetup((prev) => ({
			...prev,
			orientation: newOrientation,
			dimensions: updatePageDimensions(prev.size, newOrientation),
		}));
	};

	const handleMarginChange = (
		margin: keyof PageSetupState["margins"],
		value: number,
	) => {
		setPageSetup((prev) => ({
			...prev,
			margins: {
				...prev.margins,
				[margin]: value,
			},
		}));
	};

	const handleSubmit = (e: React.FormEvent): void => {
		e.preventDefault();
		onSave(pageSetup);
	};

	const fields: FormField[] = [
		{
			id: "paper-size",
			label: "Paper",
			type: "select",
			value: pageSetup.size,
			onChange: handleSizeChange,
			options: Object.keys(PAGE_SIZES).map((size) => ({
				value: size,
				label: size,
			})),
		},
		{
			id: "orientation",
			label: "Orientation",
			type: "radio",
			value: pageSetup.orientation,
			onChange: handleOrientationChange,
			options: [
				{ value: "portrait", label: "Portrait" },
				{ value: "landscape", label: "Landscape" },
			],
		},
		{
			id: "margin-left",
			label: "Left Margin (mm)",
			type: "number",
			value: pageSetup.margins.left,
			onChange: (value) => handleMarginChange("left", Number(value)),
			step: 0.01,
		},
		{
			id: "margin-right",
			label: "Right Margin (mm)",
			type: "number",
			value: pageSetup.margins.right,
			onChange: (value) => handleMarginChange("right", Number(value)),
			step: 0.01,
		},
		{
			id: "margin-top",
			label: "Top Margin (mm)",
			type: "number",
			value: pageSetup.margins.top,
			onChange: (value) => handleMarginChange("top", Number(value)),
			step: 0.01,
		},
		{
			id: "margin-bottom",
			label: "Bottom Margin (mm)",
			type: "number",
			value: pageSetup.margins.bottom,
			onChange: (value) => handleMarginChange("bottom", Number(value)),
			step: 0.01,
		},
	];

	return (
		<ModalForm
			isOpen={isOpen}
			onClose={onClose}
			title="Page Setup"
			fields={fields}
			onSubmit={handleSubmit}
			submitLabel="OK"
			size="lg"
		/>
	);
}
