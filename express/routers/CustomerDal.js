const express = require("express");
const sql = require("mssql/msnodesqlv8");

const customerRouter = express.Router();

// Route to get all customers
customerRouter.get("/customerSearch", async (req, res) => {
	const search = req.query.search || "";

	console.log("Search term:", search);
	if (!search.trim()) {
		return res.status(400).json({ error: "Search term is required" });
	}

	const query = `
    SELECT 
      CustomerID, 
      CustomerCompanyName, 
      FlatRate,
      Discount,
      RoadBan75Rate,
      RoadBan90Rate,
      SaturdayPourRate,
      SecondaryOperatorRate,
      OnsiteQaRate,
      AdditionalDunnageRate,
      AdditionalLineRate,
      FlagPersonRate,
      FuelSurchargeRate,
      WashoutRate
    FROM CDS_Customer
    WHERE CustomerStatus = 1
      AND CustomerCompanyName LIKE @CustomerCompanyName
    ORDER BY CustomerCompanyName;
  `;

	const searchTerm = `${search.trim()}%`;
	console.log("Search term for LIKE query:", searchTerm);

	try {
		const pool = await sql.connect();
		console.log("Database connected");

		const result = await pool
			.request()
			.input("CustomerCompanyName", sql.VarChar, searchTerm)
			.query(query);

		console.log("SQL result:", result.recordset);

		res.json(result.recordset || []);
	} catch (err) {
		console.error("Error fetching customers:", err.message);
		res.status(500).json({
			error: "Failed to fetch customers",
			message: err.message,
		});
	}
});

// Route to get a single customer by ID
customerRouter.get("/:id", async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: "Customer ID is required" });
	}

	const query = `
    SELECT ${req.query.fields}
    FROM CDS_Customer
    WHERE ${id !== "0" ? `CustomerID = ${id}` : "1=1"};
  `;

	try {
		const data = await sql.query(query);
		// Return array instead of single object to match unified model
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching customer:", err.message);
		res.status(500).send("Failed to fetch customer");
	}
});

module.exports = customerRouter;

// I COULDNT FIND WHERE THIS WAS BEING USED, LOOKS LIKE OUTDATED CODE, PLEASE REMOVE ALL COMMENTS AFTER REVIEW BEFORE MERGE
// "use server";
// const sql = require("mssql/msnodesqlv8");

// const config = {
// 	server: "DESKTOP-K353V85",
// 	database: "PumpMasterDB",
// 	options: {
// 		trustedConnection: true,
// 		trustServerCertificate: true,
// 	},
// 	driver: "msnodesqlv8",
// };

// export const getCustomers = async () => {
// 	try {
// 		await sql.connect(config);
// 		const result = await sql.query`SELECT
//     CustomerID as id,
//     CustomerStatus as status,
//     CustomerCompanyName as companyName,
//     CustomerLastName as lastName,
//     CustomerFirstName as firstName,
//     CustomerAddress as address,
//     CustomerCity as city,
//     CustomerProvince as province,
//     CustomerPostalCode as postalCode,
//     CustomerPhone as phone,
//     CustomerCell as cell,
//     CustomerEmail as email,
//     CustomerComments as Comments,
//     CustomerInvoiceTerms as invoiceTerms
//     FROM CDS_Customer`;
// 		return result.recordset;
// 	} catch (error) {
// 		throw new Error(`Error fetching customers: ${error.message}`);
// 	}
// };
