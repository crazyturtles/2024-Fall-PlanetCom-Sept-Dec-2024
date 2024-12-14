"use client";

import { useEffect, useState } from "react";

interface SendMessageProps {
	messagePreference: string;
	driverTextMsgDomain: string;
	driverTextMsgNum: string;
	driverEmail: string;
}

const SendMessage = ({
	messagePreference,
	driverTextMsgDomain,
	driverTextMsgNum,
	driverEmail,
}: SendMessageProps) => {
	const [formData, setFormData] = useState({
		email: driverEmail || "",
		message: "",
		phone: driverTextMsgNum || "",
		provider: driverTextMsgDomain || "Select",
		pref: messagePreference || "E",
	});

	useEffect(() => {
		setFormData({
			email: driverEmail,
			message: "",
			phone: driverTextMsgNum,
			provider: driverTextMsgDomain,
			pref: messagePreference,
		});
	}, [driverEmail, driverTextMsgNum, driverTextMsgDomain, messagePreference]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		let recipient = formData.email;
		if (formData.pref === "S" && formData.phone) {
			switch (formData.provider) {
				case "telus":
					recipient = `${formData.phone}@msg.telus.com`;
					break;
				case "freedom":
					recipient = `${formData.phone}@txt.freedommobile.ca`;
					break;
				case "atntpcs":
					recipient = `${formData.phone}@txt.att.net`;
					break;
				case "atntpocket":
					recipient = `${formData.phone}@dpcs.mobile.att.net`;
					break;
				case "bellcanada":
					recipient = `${formData.phone}@txt.bell.ca`;
					break;
				case "bellmobile":
					recipient = `${formData.phone}@txt.bellmobility.ca`;
					break;
				case "rogers":
					recipient = `${formData.phone}@sms.rogers.com`;
					break;
				case "tmobile":
					recipient = `${formData.phone}@tmomail.net`;
					break;
				default:
					alert("Please select a valid service provider for SMS.");
					return;
			}
		}

		try {
			const response = await fetch("/api/operator/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: recipient, message: formData.message }),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Error Response:", errorText);
				throw new Error("Failed to send message");
			}

			const data = await response.json();
			alert(data.message);
			setFormData({
				...formData,
				message: "",
			});
		} catch (error) {
			console.error("Error:", error);
			alert("An error occurred while sending the message.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex w-full max-w-lg flex-col rounded-lg bg-white p-6 text-black shadow-md"
		>
			<h2 className="mb-4 font-bold text-lg">Send Message</h2>

			{formData.pref === "E" ? (
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block font-medium text-gray-700 text-sm"
					>
						Email
					</label>
					<input
						type="text"
						id="email"
						name="email"
						value={formData.email}
						readOnly
						className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 text-gray-500 shadow-sm"
						placeholder="Enter email address"
					/>
				</div>
			) : (
				<>
					<div className="mb-4">
						<label
							htmlFor="phone"
							className="block font-medium text-gray-700 text-sm"
						>
							Phone
						</label>
						<input
							type="text"
							id="phone"
							name="phone"
							value={formData.phone}
							readOnly
							className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 text-gray-500 shadow-sm"
							placeholder="Enter phone number for SMS"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="provider"
							className="block font-medium text-gray-700 text-sm"
						>
							Service Provider
						</label>
						<select
							id="provider"
							name="provider"
							value={formData.provider}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						>
							<option value="Select">Please Select...</option>
							<option value="telus">Telus</option>
							<option value="freedom">Freedom</option>
							<option value="atntpcs">AT&amp;T PCS</option>
							<option value="atntpocket">AT&amp;T Pocketnet PCS</option>
							<option value="bellcanada">Bell Canada</option>
							<option value="bellmobile">Bell Mobility (Canada)</option>
							<option value="rogers">Rogers Canada</option>
							<option value="tmobile">T-Mobile</option>
						</select>
					</div>
				</>
			)}

			<div className="mb-4">
				<label
					htmlFor="message"
					className="block font-medium text-gray-700 text-sm"
				>
					Message
				</label>
				<textarea
					id="message"
					name="message"
					value={formData.message}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					placeholder="Enter your message"
				/>
			</div>

			<button
				type="submit"
				className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				Send Message
			</button>
		</form>
	);
};

export default SendMessage;
