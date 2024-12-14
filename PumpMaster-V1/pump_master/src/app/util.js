export function validateParam(paramName) {
	if (
		paramName === "carbonLevy" ||
		paramName === "default-FuelSurcharge-rate"
	) {
		return "\\d*\\.?\\d*";
	} //Validate carbon levy. Format: decimal percentage.
	if (paramName === "CompanySMTPPort" || paramName === "smtpPort") {
		return "\\d*";
	} //Validate smtp port. Format: integer
	if (
		paramName === "CompanySMTPFromAddress" ||
		/[\s\S]*[Ee]mail[\s\S]*/.test(paramName)
	) {
		return "((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])";
	}
	if (
		paramName === "CompanySMTPServer" ||
		paramName === "smtpServer" ||
		paramName === "CompanyWebsite" ||
		paramName === "website"
	) {
		return "(https?:\\/\\/)?([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}";
	} //Validate URI. Format: URI with or without protocol
	if (/[\s\S]*[Pp]hone[\s\S]*/.test(paramName)) {
		return "[0-9]{10}";
	} //Validate phone. Format: phone number with hyphens
	// if (
	// 	paramName === "gstRate" ||
	// 	paramName === "GSTRate" ||
	// 	paramName === "scheduleEndTime" ||
	// 	paramName === "ScheduleEndTime" ||
	// 	paramName === "scheduleInterval" ||
	// 	paramName === "ScheduleInterval" ||
	// 	paramName === "scheduleStarTime" ||
	// 	paramName === "ScheduleStarTime" ||
	// 	paramName === "simplyCurrencyValue" ||
	// 	paramName === "simply-currency-value" ||
	// 	paramName === "simplyDbPort" ||
	// 	paramName === "simply-db-port" ||
	// 	paramName === "simplyTaxValue" ||
	// 	paramName === "simply-tax-value" ||
	// 	paramName === "timeClockRoundUpDownTime" ||
	// 	paramName === "TimeClockRoundUpDownTime"
	// ) {
	// 	return "\\d*";
	// }
	if (/[\s\S]*[Rr]ates[\s\S]*/.test(paramName)) {
		return "\\d*\\.?\\d{0,2}";
	} //Validate rates. Format: currency
	return "[\\s\\S]*";
}

export function stringToRegex(s) {
	return new RegExp(s);
}

export function validateObject(obj, func) {
	for (const p in obj) {
		if (p == undefined || typeof obj[p] !== "string") {
			continue;
		}
		if (!func(p)) {
			obj[p] = "";
		}
	}
	return obj;
}

export function formatInput(value) {
	if (value == null) {
		return ""; // Return an empty string if value is null or undefined
	}

	if (/\d{10}/.test(value.toString())) {
		return `${value.toString().slice(0, 3)}-${value.toString().slice(3, 6)}-${value.toString().slice(6)}`;
	}

	// biome-ignore lint/style/noUselessElse: <explanation>
	else if (/\d{3}-\d{3}-\d{4}/.test(value)) {
		return value.replaceAll("-", "");
	}

	return value;
}

//deprecated
function parseMoneyNumber(cashString) {
	try {
		return Number.parseInt(cashString.replace("$", ""));
	} catch {}
	return undefined;
}

//deprecated
function parseMoneyString(cashNumber) {
	try {
		return "$" + cashNumber.toString();
	} catch {}
	return undefined;
}
