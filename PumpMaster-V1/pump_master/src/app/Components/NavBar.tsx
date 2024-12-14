import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../../public/css/nav.css";
import Cookies from "js-cookie";
import { ChevronDown } from "lucide-react";
import CreateUserModal from "./CreateUserModal";

interface NavProps {
	OnAdd: (id: number) => void;
	openJobForm: () => void;
}

const NavBar = ({ openJobForm }: NavProps) => {
	const router = useRouter();
	const [authState, setAuthState] = useState({
		isLoggedIn: false,
		username: "",
		role: "",
		permissionLevel: 0,
	});
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const profileMenuRef = useRef<HTMLDivElement | null>(null);
	const [showCreateUserModal, setShowCreateUserModal] = useState(false);

	const checkAuth = useCallback(async () => {
		try {
			const response = await fetch("http://localhost:3001/auth/verify", {
				credentials: "include",
			});
			if (response.ok) {
				const data = await response.json();
				setAuthState({
					isLoggedIn: true,
					username: data.username,
					role: data.role,
					permissionLevel: data.permissionLevel,
				});
			} else {
				setAuthState({
					isLoggedIn: false,
					username: "",
					role: "",
					permissionLevel: 0,
				});
			}
		} catch (error) {
			console.error("Auth check error:", error);
			setAuthState({
				isLoggedIn: false,
				username: "",
				role: "",
				permissionLevel: 0,
			});
		}
	}, []);

	useEffect(() => {
		checkAuth();

		const handleCookieChange = () => {
			checkAuth();
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target as Node)
			) {
				setShowProfileMenu(false);
			}
		};

		window.addEventListener("storage", handleCookieChange);
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("storage", handleCookieChange);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [checkAuth]);

	const handleNavigation = (path: string) => {
		router.push(path);
	};

	const handleLogout = async () => {
		try {
			const response = await fetch("http://localhost:3001/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			if (response.ok) {
				Cookies.remove("authToken", { path: "/" });
				localStorage.removeItem("authToken");
				setAuthState({
					isLoggedIn: false,
					username: "",
					role: "",
					permissionLevel: 0,
				});

				setShowProfileMenu(false);
				router.push("/login");
			} else {
				console.error("Logout failed", response.statusText);
			}
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	const ProfileMenu = () => (
		<div
			ref={profileMenuRef}
			className="absolute top-16 right-0 z-50 mt-2 w-48 rounded-md bg-gray-800 py-1 shadow-lg"
			role="menu"
		>
			<div className="border-gray-700 border-b px-4 py-2 text-gray-300 text-sm">
				<div className="font-medium">{authState.username}</div>
				<div className="text-gray-400 text-xs">{authState.role}</div>
			</div>
			{authState.permissionLevel === 4 && (
				<button
					onClick={() => setShowCreateUserModal(true)}
					className="block w-full px-4 py-2 text-left text-gray-300 text-sm hover:bg-gray-700"
					type="button"
					role="menuitem"
				>
					Create User
				</button>
			)}
			<button
				onClick={handleLogout}
				className="block w-full px-4 py-2 text-left text-red-400 text-sm hover:bg-gray-700"
				type="button"
				role="menuitem"
			>
				Sign out
			</button>
		</div>
	);

	return (
		<nav className="navbar">
			<div className="navbar-left">
				<img
					src="/img/pumpmaster-logo-2.1-transparent.png"
					alt="PumpMaster Logo"
					className="navbar-logo cursor-pointer"
					onClick={() => router.push("/")}
					onKeyPress={(e) => {
						if (e.key === "Enter") router.push("/");
					}}
				/>
			</div>

			<div className="navbar-center">
				<ul className="navbar-menu" role="menubar">
					{authState.permissionLevel >= 3 && (
						<li>
							<button
								onClick={openJobForm}
								role="menuitem"
								type="button"
								className="w-full text-left"
							>
								Job Creator
							</button>
						</li>
					)}

					{authState.permissionLevel >= 1 && (
						<li className="dropdown">
							<button
								type="button"
								className="dropdown-toggle flex items-center gap-1"
								role="menuitem"
								aria-haspopup="true"
							>
								Reports
								<ChevronDown size={16} />
							</button>
							<ul className="dropdown-menu" role="menu">
								{[
									{
										name: "Customer Job History",
										path: "/reports/customer-job-history",
									},
									{
										name: "Amount Pumped By Job Type",
										path: "/reports/amount-pumped-by-job-type",
									},
									{
										name: "Amount Pumped By Pump And Date",
										path: "/reports/amount-pumped-by-pump-and-date",
									},
									{
										name: "Amount Poured by Unit Since Pipe Change",
										path: "/reports/amount-pumped-since-pipe-change",
									},
									{
										name: "Job Count Details",
										path: "/reports/customer-job-count",
									},
								].map((item, index) => (
									<li key={index}>
										<button
											type="button"
											onClick={() => handleNavigation(item.path)}
											role="menuitem"
											className="w-full text-left"
										>
											{item.name}
										</button>
									</li>
								))}
							</ul>
						</li>
					)}

					{authState.permissionLevel >= 3 && (
						<li className="dropdown">
							<button
								type="button"
								className="dropdown-toggle flex items-center gap-1"
								role="menuitem"
								aria-haspopup="true"
							>
								Manage Data
								<ChevronDown size={16} />
							</button>
							<ul className="dropdown-menu" role="menu">
								{[
									{ name: "Technician", path: "/technician" },
									{ name: "Supplier", path: "/supplier" },
									{ name: "Job Types", path: "/job-type" },
									{ name: "Pour Type", path: "/pour-type" },
									{ name: "Units", path: "/units" },
									{ name: "Pump Type", path: "/pumps" },
									{ name: "Customers", path: "/customers" },
									{ name: "Operators", path: "/operator" },
									{ name: "Company Info", path: "/company-information" },
								].map((item, index) => (
									<li key={index}>
										<button
											type="button"
											onClick={() => handleNavigation(item.path)}
											role="menuitem"
											className="w-full text-left"
										>
											{item.name}
										</button>
									</li>
								))}
							</ul>
						</li>
					)}
					<li>
						<button type="button" role="menuitem">
							Tools
						</button>
					</li>
					<li>
						<button type="button" role="menuitem">
							About
						</button>
					</li>
				</ul>
			</div>

			<div className="navbar-right relative">
				{!authState.isLoggedIn ? (
					<button
						className="cursor-pointer hover:text-gray-300"
						onClick={() => router.push("/login")}
						type="button"
						onKeyPress={(e) => {
							if (e.key === "Enter") router.push("/login");
						}}
					>
						Login
					</button>
				) : (
					<div className="flex items-center gap-4">
						<button
							className="flex cursor-pointer items-center"
							onClick={() => setShowProfileMenu(!showProfileMenu)}
							type="button"
							aria-haspopup="true"
							aria-expanded={showProfileMenu}
						>
							<img
								src="/img/profile-picture-placeholder.png"
								alt="Profile"
								className="profile-pic"
							/>
							<div className="ml-2 flex flex-col text-sm leading-4">
								<p className="font-medium">{authState.username}</p>
								<p className="text-xs">{authState.role}</p>
							</div>
						</button>
						{showProfileMenu && <ProfileMenu />}
					</div>
				)}
			</div>

			<CreateUserModal
				isOpen={showCreateUserModal}
				onClose={() => setShowCreateUserModal(false)}
			/>
		</nav>
	);
};

export default NavBar;
