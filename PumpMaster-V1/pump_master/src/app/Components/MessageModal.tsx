import type React from "react";
import { useEffect, useState } from "react";

interface MessageModalProps {
	isOpen: boolean;
	onClose: () => void;
	JobDriverID?: number | null;
	DriverID?: number;
	JobID?: number | null;
	onMessageSent: (jobId: number, status: boolean) => void;
}

interface OperatorDetails {
	MessagePreference: string;
	DriverTextMsgDomain: string;
	DriverTextMsgNum: string;
	DriverEmail: string;
}

const MessageModal: React.FC<MessageModalProps> = ({
	isOpen,
	onClose,
	JobDriverID,
	DriverID,
	JobID,
	onMessageSent,
}) => {
	const [operatorDetails, setOperatorDetails] =
		useState<OperatorDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [message, setMessage] = useState<string>("");
	const [provider, setProvider] = useState<string>("Select");

	useEffect(() => {
		if (isOpen) {
			const fetchOperatorDetails = async () => {
				setLoading(true);

				try {
					const id = JobDriverID || DriverID;
					if (!id) throw new Error("No valid ID provided.");

					const response = await fetch(
						`http://localhost:3001/job/operators/${id}`,
					);
					if (!response.ok)
						throw new Error("Failed to fetch operator details.");

					const data = await response.json();

					setOperatorDetails({
						MessagePreference: data.MessagePreference || "",
						DriverTextMsgDomain: data.DriverTextMsgDomain || "",
						DriverTextMsgNum: data.DriverTextMsgNum || "",
						DriverEmail: data.DriverEmail || "",
					});
				} catch (error) {
					console.error("Error fetching operator details:", error);
					alert("Failed to load operator details.");
				} finally {
					setLoading(false);
				}
			};

			fetchOperatorDetails();
		}
	}, [isOpen, JobDriverID, DriverID]);

	useEffect(() => {
		if (operatorDetails?.DriverTextMsgDomain) {
			setProvider(operatorDetails?.DriverTextMsgDomain);
		}
	}, [operatorDetails?.DriverTextMsgDomain]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!operatorDetails || !JobID) {
			alert("Job ID or operator details are missing.");
			return;
		}

		setLoading(true);

		try {
			const recipient =
				operatorDetails.MessagePreference === "E"
					? operatorDetails.DriverEmail
					: `${operatorDetails.DriverTextMsgNum}@${provider}`;

			const response = await fetch(
				"http://localhost:3001/send-message/send-message",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						recipient,
						message,
						subject:
							operatorDetails.MessagePreference === "E"
								? "New Email Message"
								: "New SMS Message",
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to send message.");
			}

			await fetch(`http://localhost:3001/job/${JobID}/update-message-status`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isTextMessageSent: true }),
			});

			alert("Message sent successfully!");
			setMessage("");

			if (onMessageSent) {
				onMessageSent(JobID, true);
			}

			onClose();
		} catch (error) {
			console.error("Error sending message:", error);
			alert("Failed to send the message. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
					<h2 className="mb-4 font-bold text-lg">Loading...</h2>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
				<h2 className="mb-4 font-bold text-lg">Send Message</h2>
				<form onSubmit={handleSubmit}>
					{operatorDetails?.MessagePreference === "S" && (
						<div className="mb-4">
							<label htmlFor="provider" className="mb-1 block font-medium">
								Service Provider
							</label>
							<select
								id="provider"
								value={provider}
								onChange={(e) => setProvider(e.target.value)}
								className="w-full rounded-md border p-2"
							>
								<option value="Select">Select Provider</option>
								<option value="msg.telus.com">Telus</option>
								<option value="txt.freedommobile.ca">Freedom</option>
								<option value="txt.att.net">AT&T PCS</option>
								<option value="dpcs.mobile.att.net">AT&T Pocketnet PCS</option>
								<option value="txt.bell.ca">Bell Canada</option>
								<option value="txt.bellmobility.ca">Bell Mobility</option>
								<option value="sms.rogers.com">Rogers Canada</option>
								<option value="tmomail.net">T-Mobile</option>
							</select>
						</div>
					)}
					<div className="mb-4">
						<label htmlFor="message" className="mb-1 block font-medium">
							Message
						</label>
						<textarea
							id="message"
							name="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full rounded-md border p-2"
							placeholder="Enter your message"
							rows={4}
							required
						/>
					</div>
					<div className="flex justify-end space-x-4">
						<button
							type="submit"
							className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
							disabled={loading}
						>
							{loading ? "Sending..." : "Send"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
							disabled={loading}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MessageModal;
