"use server";
const sql = require("mssql/msnodesqlv8");

const config = {
	server: "DESKTOP-K353V85",
	database: "PumpMasterDB",
	options: {
		trustedConnection: true,
		trustServerCertificate: true,
	},
	driver: "msnodesqlv8",
};

export const getCustomers = async () => {
	try {
		await sql.connect(config);
		const result = await sql.query`SELECT  
    CustomerID as id,
    CustomerStatus as status,
    CustomerCompanyName as companyName,
    CustomerLastName as lastName,
    CustomerFirstName as firstName,
    CustomerAddress as address,
    CustomerCity as city,
    CustomerProvince as province,
    CustomerPostalCode as postalCode,
    CustomerPhone as phone,
    CustomerCell as cell,
    CustomerEmail as email,
    CustomerComments as Comments,
    CustomerInvoiceTerms as invoiceTerms
    FROM CDS_Customer`;
		return result.recordset;
	} catch (error) {
		throw new Error(`Error fetching customers: ${error.message}`);
	}
};
