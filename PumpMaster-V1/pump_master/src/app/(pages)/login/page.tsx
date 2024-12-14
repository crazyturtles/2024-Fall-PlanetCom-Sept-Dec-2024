"use client";

import axios, { type AxiosError } from "axios";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

interface ErrorResponse {
	message: string;
}

const LoginPage: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errors, setErrors] = useState<{
		username?: string;
		password?: string;
	}>({});
	const [loading, setLoading] = useState<boolean>(false);
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [redirectUrl, setRedirectUrl] = useState<string>("/");
	const router = useRouter();

	const validateInputs = () => {
		const newErrors: { username?: string; password?: string } = {};
		let isValid = true;

		if (!username.trim()) {
			newErrors.username = "Username cannot be empty";
			isValid = false;
		}
		if (!password.trim()) {
			newErrors.password = "Password cannot be empty";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		if (!validateInputs()) {
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:3001/auth/login",
				{ username, password },
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.data.token) {
				setLoggedIn(true);
				router.push(redirectUrl);
			}
		} catch (err) {
			const axiosError = err as AxiosError<ErrorResponse>;
			if (axiosError.response?.data.message) {
				setErrors({ username: axiosError.response.data.message });
			} else {
				setErrors({ username: "An unexpected error occurred." });
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-black">
			<div className="w-96 rounded-lg bg-white p-8 text-black shadow-lg">
				<div className="mb-6 flex justify-center">
					<img
						src="/img/pumpmaster-logo-2.1-transparent.png"
						alt="PumpMaster Logo"
						className="w-50"
					/>
				</div>
				<h2 className="mb-6 text-center font-semibold text-3xl">Sign In</h2>
				<form onSubmit={handleLogin} noValidate>
					<div className="mb-4">
						<label
							htmlFor="username"
							className="mb-2 block font-medium text-sm"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className={`w-full border bg-white px-3 py-2 ${
								errors.username ? "border-red-500" : "border-black"
							} rounded-md text-black focus:outline-none focus:ring-2`}
						/>
						{errors.username && (
							<p className="mt-1 text-red-500 text-sm">{errors.username}</p>
						)}
					</div>
					<div className="mb-6">
						<label
							htmlFor="password"
							className="mb-2 block font-medium text-sm"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={`w-full border bg-white px-3 py-2 ${
								errors.password ? "border-red-500" : "border-black"
							} rounded-md text-black focus:outline-none focus:ring-2`}
						/>
						{errors.password && (
							<p className="mt-1 text-red-500 text-sm">{errors.password}</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
