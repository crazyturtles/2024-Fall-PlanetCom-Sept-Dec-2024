export const GetAllCustomers = async () => {
	try {
		const response = await fetch("http://localhost:3001/getCustomers");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const customers = await response.json();
		console.log(customers);
		return customers;
	} catch (err) {
		throw new Error(`Error fetching customers: ${err.message}`);
	}
};
