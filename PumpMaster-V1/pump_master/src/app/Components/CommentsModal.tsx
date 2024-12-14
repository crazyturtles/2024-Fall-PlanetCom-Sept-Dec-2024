import type React from "react";
import { useEffect, useState } from "react";

interface CommentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	customerID: number | null;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
	isOpen,
	onClose,
	customerID,
}) => {
	const [comments, setComments] = useState<string>("Loading comments...");
	const [originalComments, setOriginalComments] = useState<string>("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchCustomerComments = async () => {
			if (!customerID) return;
			setLoading(true);
			try {
				const response = await fetch(
					`http://localhost:3001/job/customer/comments/${customerID}`,
				);
				const data = await response.json();
				const fetchedComments =
					data.CustomerComments || "No comments available.";
				setComments(fetchedComments);
				setOriginalComments(fetchedComments);
			} catch (error) {
				console.error("Error fetching customer comments:", error);
				setComments("Failed to load comments.");
				setOriginalComments("Failed to load comments.");
			} finally {
				setLoading(false);
			}
		};

		if (isOpen) {
			fetchCustomerComments();
		}
	}, [isOpen, customerID]);

	const handleSave = async () => {
		if (!customerID) return;

		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:3001/job/customer/comments/${customerID}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ CustomerComments: comments }),
				},
			);

			if (response.ok) {
				console.log("Comments saved successfully.");
				onClose();
			} else {
				console.error("Failed to save comments:", response.statusText);
			}
		} catch (error) {
			console.error("Error saving comments:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setComments(originalComments);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 font-semibold text-lg">Comments</h2>
				<textarea
					value={comments}
					onChange={(e) => setComments(e.target.value)}
					rows={8}
					className="w-full resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
				/>
				<div className="mt-4 flex justify-end space-x-2">
					<button
						className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						onClick={handleSave}
						type="button"
					>
						Save
					</button>
					<button
						className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
						onClick={handleCancel}
						type="button"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentsModal;
