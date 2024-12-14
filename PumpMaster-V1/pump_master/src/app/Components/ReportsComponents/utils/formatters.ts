export const formatters = {
	number: (value: number) => value?.toLocaleString() ?? "",
	currency: (value: number) =>
		value
			? `$${value.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`
			: "",
	date: (value: string) => (value ? new Date(value).toLocaleDateString() : ""),
	time: (value: string) => value || "",
	nullableString: (value: string | null) => value ?? "",
};

export { formatters as columnFormatters };
