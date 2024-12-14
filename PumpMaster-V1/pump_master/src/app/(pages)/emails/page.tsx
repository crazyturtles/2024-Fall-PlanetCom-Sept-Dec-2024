"use client";

import type React from "react";
import { useState } from "react";

const EmailManager = () => {
	const [formData, setFormData] = useState({
		email: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/operators/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				alert("Email sent successfully!");
			} else {
				alert("Failed to send email.");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="mx-auto max-w-4xl p-4">
			<h1 className="mb-6 text-center font-bold text-3xl">Email Manager</h1>
			<form
				onSubmit={handleSubmit}
				className="mx-auto mt-8 max-w-lg rounded-lg bg-white p-6 shadow-lg"
			>
				<h2 className="mb-6 font-bold text-2xl">Testing Email and SMS</h2>

				<div className="mb-4">
					<label className="mb-2 block font-bold text-gray-700" htmlFor="email">
						Email
					</label>
					<input
						type="text"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full rounded border p-3"
					/>
				</div>

				<div className="mb-4">
					<label
						className="mb-2 block font-bold text-gray-700"
						htmlFor="message"
					>
						Message
					</label>
					<input
						type="text"
						name="message"
						value={formData.message}
						onChange={handleChange}
						className="w-full rounded border p-3"
					/>
				</div>

				{/* <div className="mb-6">
					<label
						className="mb-2 block font-bold text-gray-700"
						htmlFor="emailpref"
					>
						Email
					</label>
					<input
						type="radio"
						name="pref"
						id="emailpref"
						value="emailpref"
						className="rounded border p-3"
					/>
					<label
						className="mb-2 block font-bold text-gray-700"
						htmlFor="smspref"
					>
						SMS
					</label>
					<input
						type="radio"
						name="pref"
						id="smspref"
						value="smspref"
						className="rounded border p-3"
					/>
				</div>

				<div className="mb-6">
					<label
						className="mb-2 block font-bold text-gray-700"
						htmlFor="domain"
					>
						Message Preference
					</label>
					<select name="domain" className="w-full rounded border p-3">
						<option value="Select">Please Select...</option>
						<option value="atntpcs">AT&amp;T PCS</option>
						<option value="atntpocket">AT&amp;T Pocketnet PCS</option>
						<option value="bellatl">Bell Atlantic</option>
						<option value="bellcanada">Bell Canada</option>
						<option value="bellcanadalt">Bell Canada alt</option>
						<option value="bellmobile">Bell Mobility (Canada)</option>
						<option value="boost">Boost</option>
						<option value="clearnet">Clearnet</option>
						<option value="comcast">Comcast</option>
						<option value="fido">Fido</option>
						<option value="manitoba">Manitoba Telecom Systems</option>
						<option value="orange">Orange</option>
						<option value="rogers">Rogers Canada</option>
						<option value="sprint">Sprint</option>
						<option value="sprintpcs">Sprint PCS</option>
						<option value="tmobile">T-Mobile</option>
						<option value="tmobilealt">T-Mobile alt</option>
						<option value="telus">Telus</option>
						<option value="virgin">Virgin Mobile</option>
					</select>
				</div> */}

				<div className="flex justify-between space-x-4">
					<button
						type="submit"
						className="w-full rounded bg-blue-600 py-3 text-white transition hover:bg-blue-500"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default EmailManager;
