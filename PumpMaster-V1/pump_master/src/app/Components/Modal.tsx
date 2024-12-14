"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	fullScreen?: boolean;
	isWide?: boolean;
}

const Modal = ({
	isOpen,
	onClose,
	children,
	fullScreen = false,
	isWide = false,
}: ModalProps) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const handleOutsideClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
			onClick={handleOutsideClick}
			onKeyDown={handleKeyDown}
			aria-labelledby="modal-title"
			aria-hidden={!isOpen}
		>
			<dialog
				className={`relative rounded bg-white p-6 shadow-lg ${
					fullScreen
						? "h-full w-full max-w-none"
						: isWide
							? "max-h-[100vh] w-auto max-w-full overflow-y-auto"
							: "max-h-[100vh] w-auto overflow-y-auto "
				}`}
				open={isOpen}
			>
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-red-700"
						aria-label="Close modal"
					>
						<i className="fas fa-times fa-xl" />
					</button>
				</div>
				<div className="mt-2 max-h-[80vh]">{children}</div>
			</dialog>
		</div>
	);
};

export default Modal;
