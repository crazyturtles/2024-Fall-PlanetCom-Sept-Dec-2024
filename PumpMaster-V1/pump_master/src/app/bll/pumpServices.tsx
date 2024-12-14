export const fetchPumpsService = async () => {
	try {
		const response = await fetch("http://localhost:3001/pumps");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const getPumps = await response.json();
		return getPumps;
	} catch (error: any) {
		throw new Error(`Failed to fetch pumps: ${error.message}`);
	}
};

export const createPumpService = async (pumpData: any) => {
	try {
		const response = await fetch("http://localhost:3001/pumps", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(pumpData),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const newPump = await response.json();
		return newPump;
	} catch (error: any) {
		throw new Error(`Failed to create pump: ${error.message}`);
	}
};

export const updatePumpService = async (pumpData: any) => {
	try {
		const response = await fetch("http://localhost:3001/pumps", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(pumpData),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const updatedPumps = await response.json();
		return updatedPumps;
	} catch (error: any) {
		throw new Error(`Failed to update pump: ${error.message}`);
	}
};
