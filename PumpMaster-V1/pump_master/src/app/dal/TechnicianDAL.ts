// "use server";
// const sql = require("mssql/msnodesqlv8");

// const config = {
// 	server: "colelittle1\\SQLEXPRESS01",
// 	database: "PumpMasterDB",
// 	options: {
// 		trustedConnection: true,
// 		trustServerCertificate: true,
// 	},
// 	driver: "msnodesqlv8",
// };
// export const getTechnicians = async () => {
// 	try {
// 		await sql.connect(config);
// 		const result = await sql.query`		SELECT
// 				TechnicianID as id,
// 				TechnicianFirstName as firstName,
// 				TechnicianLastName as lastName,
// 				TechnicianAddress as address,
// 				TechnicianCity as city,
// 				TechnicianProvince as province,
// 				TechnicianPostalCode as postalCode,
// 				TechnicianPhone as homePhone,
// 				TechnicianCell as cellPhone,
// 				TechnicianEmail as email,
// 				TechnicianHourlyRate as hourlyRate,
// 				TechnicianStatus as status
// 			FROM CDS_Technician

// 		`;
// 		return result.recordset;
// 	} catch (err) {
// 		console.error("Error during SQL query:", err);
// 	}
// };

// export const addTechnician = async (technicianData) => {
// 	try {
// 		await sql.connect(config);
// 		const {
// 			firstName,
// 			lastName,
// 			address,
// 			city,
// 			province,
// 			postalCode,
// 			homePhone,
// 			cellPhone,
// 			email,
// 			hourlyRate,
// 			status,
// 		} = technicianData;
// 		await sql.query`
//     INSERT INTO CDS_Technician (
//         TechnicianFirstName,
//         TechnicianLastName,
//         TechnicianAddress,
//         TechnicianCity,
//         TechnicianProvince,
//         TechnicianPostalCode,
//         TechnicianPhone,
//         TechnicianCell,
//         TechnicianEmail,
//         TechnicianHourlyRate,
//         TechnicianStatus
//     ) VALUES (
//         ${firstName},
//         ${lastName},
//         ${address},
//         ${city},
//         ${province},
//         ${postalCode},
//         ${homePhone},
//         ${cellPhone},
//         ${email},
//         ${hourlyRate},
//         ${status}
//     )`;
// 		return { message: "Technician added successfully" };
// 	} catch (err) {
// 		throw new Error(err.message);
// 	}
// };

// export const updateTechnician = async (technicianData) => {
// 	try {
// 		await sql.connect(config);
// 		const {
// 			id,
// 			firstName,
// 			lastName,
// 			address,
// 			city,
// 			province,
// 			postalCode,
// 			homePhone,
// 			cellPhone,
// 			email,
// 			hourlyRate,
// 			status,
// 		} = technicianData;
// 		await sql.query`

// 				UPDATE CDS_Technician
// 				SET
// 					TechnicianFirstName = ${firstName},
// 					TechnicianLastName = ${lastName},
// 					TechnicianAddress = ${address},
// 					TechnicianCity = ${city},
// 					TechnicianProvince = ${province},
// 					TechnicianPostalCode = ${postalCode},
// 					TechnicianPhone = ${homePhone},
// 					TechnicianCell = ${cellPhone},
// 					TechnicianEmail = ${email},
// 					TechnicianHourlyRate = ${hourlyRate},
// 					TechnicianStatus = ${status}
// 				WHERE
// 					TechnicianID = ${id}
// 			`;
// 		return { message: "Technician updated successfully" };
// 	} catch (err) {
// 		throw new Error(err.message);
// 	}
// };

// export const hideTechnician = async (technicianId) => {
// 	try {
// 		await sql.connect(config);
// 		await sql.query`

// 				UPDATE CDS_Technician
// 				SET
// 					TechnicianStatus = 0
//                     FROM CDS_Technician
// 				WHERE
// 					TechnicianID = ${technicianId}
// 			`;
// 		return { message: "Technician deleted successfully" };
// 	} catch (err) {
// 		throw new Error(err.message);
// 	}
// };
