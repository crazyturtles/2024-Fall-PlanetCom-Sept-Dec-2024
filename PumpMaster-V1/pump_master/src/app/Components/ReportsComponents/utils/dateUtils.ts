import { format, isValid, parse, parseISO } from "date-fns";

export const formatDateTime = (dateString: string | null): string | null => {
	if (!dateString) return null;

	try {
		const date = parseISO(dateString);
		if (!isValid(date)) return null;
		return format(date, "MM-dd-yyyy hh:mm aa");
	} catch {
		return null;
	}
};

export const formatSQLDate = (dateString: string | null): string | null => {
	if (!dateString) return null;

	try {
		const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
		if (!isValid(parsedDate)) return null;
		return format(parsedDate, "yyyy-MM-dd");
	} catch {
		return null;
	}
};

export const validateDateRange = (
	startDate: string | null,
	endDate: string | null,
): boolean => {
	if (!startDate || !endDate) return false;

	const start = parse(startDate, "yyyy-MM-dd", new Date());
	const end = parse(endDate, "yyyy-MM-dd", new Date());

	return isValid(start) && isValid(end) && start <= end;
};
