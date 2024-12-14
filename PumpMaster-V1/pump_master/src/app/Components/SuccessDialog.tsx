import type React from "react";

interface SuccessDialogProps {
	isOpen: boolean;
	message: string;
	onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
	isOpen,
	message,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
				<h2 className="mb-4 font-bold text-green-600 text-lg">Success</h2>
				<p className="mb-4 text-black">{message}</p>
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						type="button"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default SuccessDialog;
