// import {} from "../dal/TechnicianDAL";

// //from "../api/PumpMasterBackend/TechnicianBackend";

// // Fetch all technicians
// export const getAllTechnicians = async () => {
// 	try {
// 		const response = await fetch("http://localhost:3001/getTechnicians");
// 		if (!response.ok) {
// 			throw new Error(`HTTP error! status: ${response.status}`);
// 		}
// 		const technicians = await response.json();
// 		return technicians;
// 	} catch (err: unknown) {
// 		if (err instanceof Error) {
// 			throw new Error(`Error fetching technicians: ${err.message}`);
// 		}
// 		throw new Error("An unknown error occurred while fetching technicians");
// 	}
// };

// // Add a new technician
// export const addNewTechnician = async (technicianData: any) => {
// 	try {
// 		const response = await fetch("http://localhost:3001/addTechnician", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(technicianData),
// 		});

// 		if (!response.ok) {
// 			throw new Error(`HTTP error! status: ${response.status}`);
// 		}

// 		const newTechnician = await response.json();
// 		return newTechnician;
// 	} catch (err: unknown) {
// 		if (err instanceof Error) {
// 			throw new Error(`Error adding technician: ${err.message}`);
// 		}
// 		throw new Error("An unknown error occurred while adding technician");
// 	}
// };

// // // Update an existing technician
// export const updateExistingTechnician = async (technicianData: any) => {
// 	try {
// 		if (validateTechnician(technicianData)) {
// 			const response = await fetch("http://localhost:3001/updateTechnician", {
// 				method: "PUT",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify(technicianData),
// 			});

// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}

// 			const updatedTechnician = await response.json();
// 			return updatedTechnician;
// 		}
// 	} catch (error: any) {
// 		throw new Error(`Error updating technician: ${error.message}`);
// 	}
// };

// // hide a technician
// export const hideTechnicianById = async (technicianId: number) => {
// 	try {
// 		const response = await fetch("http://localhost:3001/deleteTechnician", {
// 			method: "PUT",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({ technicianId }),
// 		});

// 		if (!response.ok) {
// 			throw new Error(`HTTP error! status: ${response.status}`);
// 		}

// 		const result = await response.json();
// 		return result;
// 	} catch (error: any) {
// 		throw new Error(`Error deleting technician: ${error.message}`);
// 	}
// };

// // Validation logic for technician details
// export const validateTechnician = (technician: any): boolean => {
// 	const errors: { [key: string]: string } = {};

// 	if (!technician.firstName || !technician.lastName) {
// 		errors.name = "First name and last name are required";
// 	}

// 	if (technician.firstName.length > 50 || technician.lastName.length > 50) {
// 		errors.name = "First name and last name must be less than 50 characters";
// 	}

// 	if (technician.province.length !== 2) {
// 		errors.province = "Province must be 2 characters";
// 	}

// 	if (!/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(technician.postalCode)) {
// 		errors.postalCode = "Postal code must be in the format A1A 1A1";
// 	}

// 	if (!/^\d{10}$/.test(technician.cellPhone)) {
// 		errors.cellPhone = "Cell phone number must be 10 digits";
// 	}

// 	if (!/\S+@\S+\.\S+/.test(technician.email)) {
// 		errors.email = "Invalid email format";
// 	}

// 	if (technician.hourlyRate <= 0) {
// 		errors.hourlyRate = "Hourly rate must be a positive number";
// 	}

// 	if (technician.homePhone && !/^\d{10}$|^0$/.test(technician.homePhone)) {
// 		errors.homePhone = "Home phone number must be either 10 digits or '0'";
// 	}

// 	if (Object.keys(errors).length > 0) {
// 		throw errors;
// 	}

// 	return true;
// };
