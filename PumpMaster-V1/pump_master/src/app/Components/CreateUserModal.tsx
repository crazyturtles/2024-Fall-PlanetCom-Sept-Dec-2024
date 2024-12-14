"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

interface Role {
	RoleTypeID: number;
	RoleDescription: string;
}

interface CreateUserModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface FormData {
	username: string;
	firstName: string;
	lastName: string;
	roleTypeId: string;
	employeeId: string;
	password: string;
	confirmPassword: string;
}

const initialFormData: FormData = {
	username: "",
	firstName: "",
	lastName: "",
	roleTypeId: "",
	employeeId: "",
	password: "",
	confirmPassword: "",
};

const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<Partial<FormData>>({});
	const [successMessage, setSuccessMessage] = useState<string>("");

	useEffect(() => {
		if (isOpen) {
			setFormData(initialFormData);
			setErrors({});
			setSuccessMessage("");
			fetchRoles();
		}
	}, [isOpen]);

	const fetchRoles = async () => {
		try {
			const response = await fetch("http://localhost:3001/auth/roles");
			const data = await response.json();
			setRoles(data);
		} catch (error) {
			console.error("Error fetching roles:", error);
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<FormData> = {};

		if (!formData.username.trim()) {
			newErrors.username = "Username is required";
		}

		if (!formData.roleTypeId) {
			newErrors.roleTypeId = "Role is required";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			const response = await fetch("http://localhost:3001/auth/create-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: formData.username,
					firstName: formData.firstName || null,
					lastName: formData.lastName || null,
					roleTypeId: Number.parseInt(formData.roleTypeId),
					employeeId: formData.employeeId
						? Number.parseInt(formData.employeeId)
						: null,
					password: formData.password,
				}),
			});

			if (response.ok) {
				const successUsername = formData.username;
				setFormData(initialFormData);
				setSuccessMessage(
					`User "${successUsername}" has been created successfully`,
				);

				setTimeout(() => {
					setSuccessMessage("");
					onClose();
				}, 2000);
			} else {
				const data = await response.json();
				setErrors({ username: data.message });
			}
		} catch (error) {
			console.error("Error creating user:", error);
			setErrors({ username: "Error creating user. Please try again." });
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name as keyof FormData]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const handleModalClose = () => {
		setSuccessMessage("");
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleModalClose}>
			<div className="px-4 py-2">
				<h2 className="mb-4 font-semibold text-xl">Create New User</h2>

				{successMessage && (
					<div className="mb-4 rounded border border-green-400 bg-green-100 p-2 text-green-700">
						{successMessage}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="username"
							className="block font-medium text-gray-700 text-sm"
						>
							Username*
						</label>
						<input
							id="username"
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
						{errors.username && (
							<p className="mt-1 text-red-600 text-sm">{errors.username}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="firstName"
							className="block font-medium text-gray-700 text-sm"
						>
							First Name
						</label>
						<input
							id="firstName"
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label
							htmlFor="lastName"
							className="block font-medium text-gray-700 text-sm"
						>
							Last Name
						</label>
						<input
							id="lastName"
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label
							htmlFor="roleTypeId"
							className="block font-medium text-gray-700 text-sm"
						>
							Role*
						</label>
						<select
							id="roleTypeId"
							name="roleTypeId"
							value={formData.roleTypeId}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="">Select a role</option>
							{roles.map((role) => (
								<option key={role.RoleTypeID} value={role.RoleTypeID}>
									{role.RoleDescription}
								</option>
							))}
						</select>
						{errors.roleTypeId && (
							<p className="mt-1 text-red-600 text-sm">{errors.roleTypeId}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="employeeId"
							className="block font-medium text-gray-700 text-sm"
						>
							Employee ID
						</label>
						<input
							id="employeeId"
							type="number"
							name="employeeId"
							value={formData.employeeId}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block font-medium text-gray-700 text-sm"
						>
							Password*
						</label>
						<input
							id="password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
						{errors.password && (
							<p className="mt-1 text-red-600 text-sm">{errors.password}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block font-medium text-gray-700 text-sm"
						>
							Confirm Password*
						</label>
						<input
							id="confirmPassword"
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
						{errors.confirmPassword && (
							<p className="mt-1 text-red-600 text-sm">
								{errors.confirmPassword}
							</p>
						)}
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={handleModalClose}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Create User
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default CreateUserModal;
