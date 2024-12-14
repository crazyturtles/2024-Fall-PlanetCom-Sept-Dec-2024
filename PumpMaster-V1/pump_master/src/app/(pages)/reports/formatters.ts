export const formatters = {
	number: (value: any): string => {
		if (value === null || value === undefined || value === "-") {
			return "0";
		}
		return Math.round(Number(value)).toString();
	},

	currency: (value: any): string => {
		if (value === null || value === undefined || value === "-") {
			return "$0.00";
		}
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);
	},

	date: (value: any): string => {
		if (!value) return "";
		return new Date(value).toLocaleDateString();
	},

	time: (value: any): string => {
		if (!value) return "";
		return new Date(`1970-01-01T${value}`).toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit",
		});
	},

	nullableString: (value: any): string => {
		return value ?? "0";
	},

	monthYear: (year: number, month: number): string => {
		if (!year || !month) return "0";
		const date = new Date(year, month - 1);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
		});
	},
};
