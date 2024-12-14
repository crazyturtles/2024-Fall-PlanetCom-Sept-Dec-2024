const API_BASE = "http://localhost:3001";

export const getAllSuppliers = async () => {
	try {
		const response = await fetch(`${API_BASE}/suppliers`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const suppliers = await response.json();
		return suppliers;
	} catch (err) {
		throw new Error(`Error fetching suppliers: ${err.message}`);
	}
};

export const getSupplierById = async (supplierId) => {
	try {
		const response = await fetch(`${API_BASE}/supplier/${supplierId}`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const supplier = await response.json();
		return supplier;
	} catch (err) {
		throw new Error(`Error fetching supplier by ID: ${err.message}`);
	}
};

export const addSupplier = async (supplierData) => {
	try {
		const response = await fetch(`${API_BASE}/supplier`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(supplierData),
		});
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const newSupplier = await response.json();
		return newSupplier;
	} catch (err) {
		throw new Error(`Error adding supplier: ${err.message}`);
	}
};

export const updateSupplier = async (supplierData) => {
	try {
		const response = await fetch(`${API_BASE}/supplier/${supplierData.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(supplierData),
		});
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const updatedSupplier = await response.json();
		return updatedSupplier;
	} catch (err) {
		throw new Error(`Error updating supplier: ${err.message}`);
	}
};

export const validateSupplier = (supplier) => {
	if (!supplier.companyName || supplier.companyName.trim() === "") {
		throw new Error("Company Name is required.");
	}
	if (supplier.companyName.length > 255) {
		throw new Error("Company Name must not exceed 255 characters.");
	}

	if (!supplier.address || supplier.address.trim() === "") {
		throw new Error("Address is required.");
	}
	if (supplier.address.length > 255) {
		throw new Error("Address must not exceed 255 characters.");
	}

	if (!supplier.city || supplier.city.trim() === "") {
		throw new Error("City is required.");
	}
	if (supplier.city.length > 50) {
		throw new Error("City must not exceed 50 characters.");
	}

	if (!supplier.province || supplier.province.trim() === "") {
		throw new Error("Province is required.");
	}
	if (supplier.province.length > 50) {
		throw new Error("Province must not exceed 50 characters.");
	}

	if (!supplier.postalCode || supplier.postalCode.trim() === "") {
		throw new Error("Postal Code is required.");
	}
	const postalCodePattern = /^[A-Za-z0-9 ]{5,10}$/;
	if (!postalCodePattern.test(supplier.postalCode)) {
		throw new Error("Postal Code is invalid.");
	}

	if (supplier.status !== 1 && supplier.status !== 0) {
		throw new Error("Supplier status must be either Active or Inactive.");
	}

	if (!supplier.email || supplier.email.trim() === "") {
		throw new Error("Email is required.");
	}
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(supplier.email)) {
		throw new Error("Supplier must have a valid email address.");
	}

	if (!supplier.phone || supplier.phone.trim() === "") {
		throw new Error("Phone number is required.");
	}
	const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
	if (!phonePattern.test(supplier.phone)) {
		throw new Error("Supplier must have a valid phone number.");
	}

	return true;
};
