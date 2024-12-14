const API_BASE = "http://localhost:3001";

export const getAllOperators = async () => {
	try {
		const response = await fetch(`${API_BASE}/operators`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const operators = await response.json();
		return operators;
	} catch (err) {
		throw new Error(`Error fetching operators: ${err.message}`);
	}
};

export const getOperatorById = async (operatorId) => {
	try {
		const response = await fetch(`${API_BASE}/operator/${operatorId}`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const operator = await response.json();
		return operator;
	} catch (err) {
		throw new Error(`Error fetching operator by ID: ${err.message}`);
	}
};

export const addOperator = async (operatorData) => {
	try {
		const response = await fetch(`${API_BASE}/operator`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(operatorData),
		});
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const newOperator = await response.json();
		return newOperator;
	} catch (err) {
		throw new Error(`Error adding operator: ${err.message}`);
	}
};

export const updateOperator = async (operatorData) => {
	try {
		const response = await fetch(`${API_BASE}/operator/${operatorData.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(operatorData),
		});
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const updatedOperator = await response.json();
		return updatedOperator;
	} catch (err) {
		throw new Error(`Error updating operator: ${err.message}`);
	}
};

export const validateOperator = (operator) => {
	if (!operator.driverFirstName || operator.driverFirstName.trim() === "") {
		throw new Error("First Name is required.");
	}
	if (operator.driverFirstName.length > 50) {
		throw new Error("First Name must not exceed 50 characters.");
	}

	if (!operator.driverLastName || operator.driverLastName.trim() === "") {
		throw new Error("Last Name is required.");
	}
	if (operator.driverLastName.length > 50) {
		throw new Error("Last Name must not exceed 50 characters.");
	}

	if (!operator.driverAddress || operator.driverAddress.trim() === "") {
		throw new Error("Address is required.");
	}
	if (operator.driverAddress.length > 255) {
		throw new Error("Address must not exceed 255 characters.");
	}

	if (!operator.driverCity || operator.driverCity.trim() === "") {
		throw new Error("City is required.");
	}
	if (operator.driverCity.length > 50) {
		throw new Error("City must not exceed 50 characters.");
	}

	if (!operator.driverProvince || operator.driverProvince.trim() === "") {
		throw new Error("Province is required.");
	}
	if (operator.driverProvince.length > 50) {
		throw new Error("Province must not exceed 50 characters.");
	}

	if (!operator.driverPostalCode || operator.driverPostalCode.trim() === "") {
		throw new Error("Postal Code is required.");
	}
	const postalCodePattern = /^[A-Za-z0-9 ]{5,10}$/;
	if (!postalCodePattern.test(operator.driverPostalCode)) {
		throw new Error("Postal Code is invalid.");
	}

	if (!operator.driverPhone || operator.driverPhone.trim() === "") {
		throw new Error("Phone number is required.");
	}
	const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
	if (!phonePattern.test(operator.driverPhone)) {
		throw new Error("Operator must have a valid phone number.");
	}

	if (!operator.driverEmail || operator.driverEmail.trim() === "") {
		throw new Error("Email is required.");
	}
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(operator.driverEmail)) {
		throw new Error("Operator must have a valid email address.");
	}

	if (operator.driverStatus !== 1 && operator.driverStatus !== 0) {
		throw new Error("Operator status must be either Active or Inactive.");
	}

	return true;
};
