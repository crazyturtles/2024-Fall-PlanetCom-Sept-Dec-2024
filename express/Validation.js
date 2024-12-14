const matchesPattern = (value, pattern) => {
	return pattern.test(value);
};

// WE NEED TO NOT ALLOW NULLS GOING IN OR COMING OUT OF THE DATABASE

const validatePump = (data) => {
	const errors = {};

	// Pump Type Name - must be required - must be less than 255 characters
	if (!data.typeName || data.typeName.trim() === "") {
		errors.typeName = "Pump Type Name is required.";
	} else if (data.typeName.length > 255) {
		errors.typeName = "Pump Type Name must not exceed 255 characters.";
	}

	// Hourly Rate - must be required with 0.00 pattern - must be a positive number
	if (!data.hourlyRate || !matchesPattern(data.hourlyRate, /^\d+(\.\d{2})?$/)) {
		errors.hourlyRate = "Hourly Rate must be provided in the format 0.00";
	} else if (data.hourlyRate < 0) {
		errors.hourlyRate = "Hourly Rate must be a positive number";
	}

	// Pour Rate - 0.00 pattern (optional) - must be a positive number
	if (data.pourRate && !matchesPattern(data.pourRate, /^\d+(\.\d{2})?$/)) {
		errors.pourRate = "Pour Rate must be in the format 0.00 if provided";
	} else if (data.pourRate < 0) {
		errors.pourRate = "Pour Rate must be a positive number";
	}

	// Washout Rate - 0.00 pattern (optional) - must be a positive number
	if (
		data.washoutRate &&
		!matchesPattern(data.washoutRate, /^\d+(\.\d{2})?$/)
	) {
		errors.washoutRate = "Washout Rate must be in the format 0.00 if provided";
	} else if (data.washoutRate < 0) {
		errors.washoutRate = "Washout Rate must be a positive number";
	}

	// Status - must be required, pick either active or inactive
	if (!data.status || ![1, 0].includes(data.status)) {
		errors.status = "Status must be either Active or Inactive.";
	}

	return errors;
};

const validateOperator = (data) => {
	const errors = {};

	// Last Name - required - must be less than 255 char
	if (!data.driverLastName || data.driverLastName.trim() === "") {
		errors.driverLastName = "Last Name is required.";
	} else if (data.driverLastName.length > 255) {
		errors.driverLastName = "Driver Last Name must not exceed 255 characters.";
	}

	// First Name - required - must be less than 255 char
	if (!data.driverFirstName || data.driverFirstName.trim() === "") {
		errors.driverFirstName = "First Name is required.";
	} else if (data.driverFirstName.length > 255) {
		errors.driverFirstName =
			"Driver First Name must not exceed 255 characters.";
	}

	// Postal Code - 6 characters, 3 letters + 3 numbers
	if (
		!data.driverPostalCode ||
		!matchesPattern(data.driverPostalCode, /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/)
	) {
		errors.driverPostalCode = 'Postal Code must be in the format "A1A 1A1".';
	}

	// Driver's License - 9 digits
	if (
		!data.driverLicenseNumber ||
		!matchesPattern(data.driverLicenseNumber, /^\d{6}-\d{3}$/)
	) {
		errors.driverLicenseNumber =
			"Driver's License must be 9 digits, e.g., '415581-296'.";
	}

	// Phone - 10 digits, format xxx-xxx-xxxx
	if (
		!data.driverPhone ||
		!matchesPattern(data.driverPhone, /^\d{3}-\d{3}-\d{4}$/)
	) {
		errors.driverPhone = 'Phone must be in the format "xxx-xxx-xxxx".';
	}

	// Email - standard email pattern
	if (
		!data.driverEmail ||
		!matchesPattern(data.driverEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
	) {
		errors.driverEmail = "A valid email is required.";
	}

	// Status - must be Active or Inactive
	if (!data.driverStatus || ![1, 0].includes(data.driverStatus)) {
		errors.driverStatus = 'Status must be either "Active" or "Inactive".';
	}

	return errors;
};

const validateUnit = (data) => {
	const errors = {};

	// Unit Number - required, can be a combination of string and number - less than 50 char
	if (!data.UnitNumber || data.UnitNumber.trim() === "") {
		errors.UnitNumber = "Unit Number is required.";
	} else if (data.UnitNumber.length > 50) {
		errors.UnitNumber = "Unit Number must not exceed 50 characters.";
	}

	// Pump Type - must be required, and should match an active pump type
	// MAKE SURE THIS VALIDATION IS TAKEN CARE OF
	if (!data.PumpType || data.PumpType.trim() === "") {
		errors.PumpType = "Pump Type is required.";
	}

	// Operator - must be required, and should be a valid/active operator
	// MAKE SURE THIS VALIDATION IS TAKEN CARE OF
	if (!data.Operator || data.Operator.trim() === "") {
		errors.Operator = "Operator is required.";
	}

	// Serial Number - required - less than 255 char
	if (!data.UnitSerialNumber || data.UnitSerialNumber.trim() === "") {
		errors.UnitSerialNumber = "Serial Number is required.";
	} else if (data.UnitSerialNumber.length > 255) {
		errors.UnitSerialNumber = "Serial Number must not exceed 255 characters.";
	}

	// License Plate - required
	if (!data.UnitLicensePlate || data.UnitLicensePlate.trim() === "") {
		errors.UnitLicensePlate = "License Plate # is required.";
	} else if (data.UnitLicensePlate.length > 50) {
		errors.UnitLicensePlate = "Pump Type Name must not exceed 50 characters.";
	}

	// CVI Expired Date - YYYY-MM-DD pattern
	// THIS IS GOING INTO THE DATA BASE WITH 00:00:00.000
	if (
		data.UnitCVIExpiry ||
		!matchesPattern(data.UnitCVIExpiry, /^\d{4}-\d{2}-\d{2}$/)
	) {
		errors.UnitCVIExpiry = "CVI Expired Date must be in the format YYYY-MM-DD.";
	}

	// Boom Pipe Changed - YYYY-MM-DD pattern
	// THIS IS GOING INTO THE DATA BASE WITH 00:00:00.000
	if (
		data.UnitPipeLastChanged ||
		!matchesPattern(data.UnitPipeLastChanged, /^\d{4}-\d{2}-\d{2}$/)
	) {
		errors.boomPipeChanged =
			"Boom Pipe Changed Date must be in the format YYYY-MM-DD.";
	}

	// Status - required, must be Active or Inactive
	if (!data.UnitStatus || ![1, 0].includes(data.UnitStatus)) {
		errors.UnitStatus = "Status must be either Active or Inactive.";
	}

	console.log("Unit validation errors:", errors);

	return errors;
};

const validateCompany = (data) => {
	const errors = {};

	// Company Name - required - less than 255 char
	if (!data.companyName || data.companyName.trim() === "") {
		errors.companyName = "Company Name is required.";
	} else if (data.companyName.length > 255) {
		errors.companyName = "Company Name must not exceed 255 characters.";
	}

	// Address - required - less than 50 char
	if (!data.address || data.address.trim() === "") {
		errors.address = "Address is required.";
	} else if (data.address.length > 255) {
		errors.address = "address must not exceed 255 characters.";
	}

	// City - required - less than 50 char
	if (!data.city || data.city.trim() === "") {
		errors.city = "City is required.";
	} else if (data.city.length > 50) {
		errors.city = "City must not exceed 50 characters.";
	}

	// Province - required - less than 50 char
	if (!data.province || data.province.trim() === "") {
		errors.province = "Province is required.";
	} else if (data.province.length > 50) {
		errors.province = "Province must not exceed 50 characters.";
	}

	// Postal Code - 6 characters, 3 letters + 3 numbers
	if (
		!data.postalCode ||
		!matchesPattern(data.postalCode, /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/)
	) {
		errors.postalCode = 'Postal Code must be in the format "A1A 1A1".';
	}

	// Phone - 10 digits, formatted as xxx-xxx-xxxx
	if (!data.phone || !matchesPattern(data.phone, /^\d{3}-\d{3}-\d{4}$/)) {
		errors.phone = 'Phone must be in the format "xxx-xxx-xxxx".';
	}

	// Website - required - must be less than 50 char
	if (!data.website || data.website.trim() === "") {
		errors.website = "Website is required.";
	} else if (data.website.length > 50) {
		errors.website = "Website must not exceed 50 characters.";
	}

	// Email - standard email pattern - less than 255 char
	if (
		!data.email ||
		!matchesPattern(data.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
	) {
		errors.email = "A valid email is required.";
	} else if (data.email.length > 255) {
		errors.email = "Email must not exceed 255 characters.";
	}

	// Default Rates - required, in 0.00 pattern - must be positive
	if (
		!data.defaultRates ||
		!matchesPattern(data.defaultRates, /^\d+(\.\d{2})?$/)
	) {
		errors.defaultRates = "Default Rates must be in the format 0.00.";
	} else if (data.defaultRates.length < 0) {
		errors.defaultRates = "Default Rates must be a positive number.";
	}

	return errors;
};

const validateCustomer = (data) => {
	const errors = {};

	// Company Name - required - less than 255 char
	if (!data.companyName || data.companyName.trim() === "") {
		errors.companyName = "Company Name is required.";
	} else if (data.companyName.length > 255) {
		errors.companyName = "Company Name must not exceed 255 characters.";
	}

	// Last Name - required - less than 255 char
	if (!data.lastName || data.lastName.trim() === "") {
		errors.lastName = "Last Name is required.";
	} else if (data.lastName.length > 255) {
		errors.lastName = "Last Name must not exceed 255 characters.";
	}

	// First Name - required - less than 255 char
	if (!data.firstName || data.firstName.trim() === "") {
		errors.firstName = "First Name is required.";
	} else if (data.firstName.length > 255) {
		errors.firstName = "First Name must not exceed 255 characters.";
	}

	// Postal Code - 6 characters, 3 letters + 3 numbers
	if (
		!data.postalCode ||
		!matchesPattern(data.postalCode, /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/)
	) {
		errors.postalCode = 'Postal Code must be in the format "A1A 1A1".';
	}

	// Phone - 10 digits, format xxx-xxx-xxxx
	if (!data.phone || !matchesPattern(data.phone, /^\d{3}-\d{3}-\d{4}$/)) {
		errors.phone = 'Phone must be in the format "xxx-xxx-xxxx".';
	}

	// Email - standard email pattern - less than 255 char
	if (
		!data.email ||
		!matchesPattern(data.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
	) {
		errors.email = "A valid email is required.";
	} else if (data.email.length > 255) {
		errors.email = "Email must not exceed 255 characters.";
	}

	// Status - must be Active or Inactive
	if (!data.status || ![1, 0].includes(data.status)) {
		errors.status = 'Status must be either "Active" or "Inactive".';
	}

	// Customer Discount - optional, 0.00 format
	// DOES DISCOUNT NEED TO BE POSITIVE?
	if (
		data.customerDiscount &&
		!matchesPattern(data.customerDiscount, /^\d+(\.\d{2})?$/)
	) {
		errors.customerDiscount = "Customer Discount must be in the format 0.00.";
	}

	// Rates and charges - all should follow 0.00 pattern if provided
	// SHOULD RATES BE POSITIVE?
	const rateFields = [
		"roadBan75",
		"roadBan90",
		"saturdayPourRate",
		"washoutRate",
		"secondaryOpRate",
		"onsiteQaRate",
		"addDunnageRate",
		"addDeliveryLineRate",
		"flagPersonRate",
		"carbonLevy",
	];

	rateFields.forEach((field) => {
		if (data[field] && !matchesPattern(data[field], /^\d+(\.\d{2})?$/)) {
			errors[field] =
				`${field.replace(/([A-Z])/g, " $1")} must be in the format 0.00.`;
		}
	});

	return errors;
};

const validateTechnician = (data) => {
	const errors = {};

	// First Name and Last Name - must be required and less than 50 characters
	if (!data.firstName || !data.lastName) {
		errors.name = "First name and last name are required.";
	} else if (data.firstName.length > 50 || data.lastName.length > 50) {
		errors.name = "First name and last name must be less than 50 characters.";
	}

	// Province - must be exactly 2 characters
	if (!data.province || data.province.length !== 2) {
		errors.province = "Province must be 2 characters.";
	}

	// Postal Code - must follow A1A 1A1 format
	if (
		data.postalCode &&
		!matchesPattern(data.postalCode, /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/)
	) {
		errors.postalCode = "Postal code must be in the format A1A 1A1.";
	}

	// Cell Phone - must follow format xxx-xxx-xxxx
	if (
		!data.cellPhone ||
		!matchesPattern(data.cellPhone, /^\d{3}-\d{3}-\d{4}$/)
	) {
		errors.cellPhone = 'Phone must be in the format "xxx-xxx-xxxx"';
	}

	// Email - must follow standard email format
	if (
		!data.email ||
		!matchesPattern(data.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
	) {
		errors.email = "Invalid email format.";
	}

	if (data.hourlyRate && !matchesPattern(data.hourlyRate, /^\d+(\.\d{2})?$/)) {
		errors.washoutRate = "Washout Rate must be in the format 0.00 if provided";
	} else if (data.hourlyRate < 0) {
		errors.hourlyRate = "Hourly Rate must be a positive number";
	}

	// Cell Phone - must follow format xxx-xxx-xxxx
	if (
		!data.homePhone ||
		!matchesPattern(data.homePhone, /^\d{3}-\d{3}-\d{4}$/)
	) {
		errors.homePhone = 'Phone must be in the format "xxx-xxx-xxxx"';
	}

	return errors;
};

const validateSupplier = (data) => {
	const errors = {};

	// Company Name - required and must not exceed 255 characters
	if (!data.companyName || data.companyName.trim() === "") {
		errors.companyName = "Company Name is required.";
	} else if (data.companyName.length > 255) {
		errors.companyName = "Company Name must not exceed 255 characters.";
	}

	// Address - required and must not exceed 255 characters
	if (!data.address || data.address.trim() === "") {
		errors.address = "Address is required.";
	} else if (data.address.length > 255) {
		errors.address = "Address must not exceed 255 characters.";
	}

	// City - must not exceed 50 characters
	if (data.city.length > 50) {
		errors.city = "City must not exceed 50 characters.";
	}

	// Province - must not exceed 50 characters
	if (data.province.length > 50) {
		errors.province = "Province must not exceed 50 characters.";
	}

	// Postal Code - 6 characters, 3 letters + 3 numbers
	if (
		!data.postalCode ||
		!matchesPattern(data.postalCode, /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/)
	) {
		errors.postalCode = 'Postal Code must be in the format "A1A 1A1".';
	}

	// Status - required, must be Active or Inactive
	if (!data.status || ![1, 0].includes(data.status)) {
		errors.status = "Status must be either Active or Inactive.";
	}

	// Email - standard email pattern
	if (
		!data.email ||
		!matchesPattern(data.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
	) {
		errors.email = "A valid email is required.";
	}

	// Phone - must follow format xxx-xxx-xxxx
	if (!data.phone || !matchesPattern(data.phone, /^\d{3}-\d{3}-\d{4}$/)) {
		errors.phone = 'Phone must be in the format "xxx-xxx-xxxx"';
	}

	return errors;
};

const validatePourType = (data) => {
	const errors = {};

	// Product Name - must be required
	if (!data.PourTypeName || data.PourTypeName.trim() === "") {
		errors.PourTypeName = "Pour Type Name is required.";
	} else if (data.PourTypeName > 50) {
		errors.PourTypeName = "Pour Type Name must be less than 50 characters";
	}

	// Default Flat Rate - optional, 0.00 format
	if (
		data.PourTypeRate &&
		!matchesPattern(data.PourTypeRate, /^\d+(\.\d{2})?$/)
	) {
		errors.PourTypeRate = "Pour Type Rate must be in the format 0.00.";
	} else if (data.PourTypeRate < 0) {
		errors.PourTypeRate = "Pour Type Rate must be a positive number.";
	}

	// Status - required, must be Active or Inactive
	if (!data.PourTypeStatus || ![1, 0].includes(data.PourTypeStatus)) {
		errors.status = "Status must be either Active or Inactive.";
	}

	return errors;
};

const validateJobType = (data) => {
	const errors = {};

	// Job Name - must be required
	if (!data.JobName || data.JobName.trim() === "") {
		errors.JobName = "Job Name is required.";
	} else if (data.JobName > 50) {
		errors.JobName = "Job Name must be less than 50 characters";
	}

	return errors;
};

module.exports = {
	validatePump,
	validateOperator,
	validateUnit,
	validateCompany,
	validateCustomer,
	validateTechnician,
	validateSupplier,
	validatePourType,
	validateJobType,
};
