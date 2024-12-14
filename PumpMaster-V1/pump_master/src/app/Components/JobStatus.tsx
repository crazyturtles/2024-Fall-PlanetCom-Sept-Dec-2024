export const getJobStatusText = (status: number): string => {
	switch (status) {
		case 0:
			return "Pending";
		case 10:
			return "Confirmed";
		case 20:
			return "Scheduled";
		case 25:
			return "Operator Confirmed";
		case 30:
			return "Washing";
		case 40:
			return "Complete";
		case 60:
			return "Postponed";
		case 70:
			return "Cancelled";
		case 80:
			return "Ready for Invoicing";
		case 90:
			return "Invoiced";
		case 100:
			return "Not for Invoicing";
		default:
			return "Unknown";
	}
};
