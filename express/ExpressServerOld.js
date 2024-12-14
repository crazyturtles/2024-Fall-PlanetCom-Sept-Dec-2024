"use server";
const { json } = require("node:stream/consumers");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const express = require("express");

const SERVER_NAME = require("./DatabaseConfig").SERVER_NAME;
const DATABASE_NAME = require("./DatabaseConfig").DATABASE_NAME;
const NODE_PORT = require("./DatabaseConfig").NODE_PORT;

const SQLConfig = {
	server: SERVER_NAME,
	database: DATABASE_NAME,
	options: {
		trustedConnection: true, // Set to true if using Windows Authentication
		enableArithAbort: true,
		trustServerCertificate: true, // Set to true if using self-signed certificates
	},
	driver: "msnodesqlv8", // Required if using Windows Authentication
};

const corsConfigs = {
	origin: `http://localhost:${NODE_PORT}`,
};

(async () => {
	const server = express();
	server.use(express.json());
	server.use(cors(corsConfigs));
	const PORT = require("./DatabaseConfig").EXPRESS_PORT;

	await sql.connect(SQLConfig);
	server.get("/company-information", async (req, res) => {
		if (
			req.query.companysql !== undefined &&
			req.query.defaultratessql !== undefined
		) {
			try {
				const companyresult = await sql.query(`${req.query.companysql}`);
				const defaultresult = await sql.query(`${req.query.defaultratessql}`);
				res.json({
					companyInfo: companyresult.recordset[0],
					defaultInfo: defaultresult.recordset,
				});
			} catch (err) {
				console.log(err.message);
			}
		} else {
			res.send("no request");
		}
	});

	server.post("/company-information", async (req, res) => {
		if (
			req.body.companysql !== undefined &&
			req.body.defaultratessql !== undefined
		) {
			try {
				const companyresult = await sql.query(`${req.body.companysql}`);
				const defaultresult = await sql.query(`${req.body.defaultratessql}`);
				res.json({
					companyInfo: companyresult.recordset[0],
					defaultInfo: defaultresult.recordset,
				});
			} catch (err) {
				console.log(err.message);
			}
		} else {
			res.send("no request");
		}
	});

	server.put("/company-information", async (req, res) => {
		if (req.body.sql !== undefined) {
			try {
				const result = await sql.query(`${req.body.sql}`);
				res.json(result);
			} catch (err) {
				console.log(err.message);
			}
		} else {
			res.send("no request");
		}
	});

	server.get("/manage-rates", async (req, res) => {
		if (
			req.query.customerratessql !== undefined &&
			req.query.pourratessql !== undefined &&
			req.query.pumpratesql !== undefined
		) {
			try {
				const customerRateInfo = await sql.query(
					`${req.query.customerratessql}`,
				);
				const pourRateInfo = await sql.query(`${req.query.pourratessql}`);
				const pumpRateInfo = await sql.query(`${req.query.pumpratesql}`);
				res.json({
					customerRateInfo: customerRateInfo.recordset,
					pourRateInfo: pourRateInfo.recordset,
					pumpRateInfo: pumpRateInfo.recordset,
				});
			} catch (err) {
				console.log(err.message);
			}
		} else {
			res.send("no request");
		}
	});

	server.put("/manage-rates", async (req, res) => {
		if (req.body.sql !== undefined) {
			try {
				console.log(req.body.sql);
				const result = await sql.query(`${req.body.sql}`);
				res.json(result);
			} catch (err) {
				console.log(err.message);
			}
		} else {
			res.send("no request");
		}
	});

	server.get("/units", async (req, res) => {
		if (req.query.sql !== undefined) {
			console.log(req.query.sql);
			try {
				const result = await sql.query(`${req.query.sql}`);
				if (result.recordsets && result.recordsets.length > 1) {
					res.json(result.recordsets);
				} else {
					res.json(result.recordset);
				}
			} catch (error) {
				console.error("Error executing SQL query:", error);
				res
					.status(500)
					.json({ error: "An error occurred while executing the query" });
			}
		} else {
			res.status(400).send("No SQL query provided");
		}
	});

	server.post("/units", async (req, res) => {
		try {
			const {
				UnitNumber,
				PumpType,
				Operator,
				UnitMake,
				UnitManufacturer,
				UnitSerialNumber,
				UnitLicensePlate,
				UnitCVIExpiry,
				UnitPipeLastChanged,
				DeckPipeLastChanged,
				UnitStatus,
			} = req.body;

			const query = `
			INSERT INTO CDS_Unit (
			  UnitNumber, UnitPumpTypeID, , UnitMake, 
			  UnitManufacturer, UnitSerialNumber, UnitLicensePlate, 
			  UnitCVIExpiry, UnitPipeLastChanged, DeckPipeLastChanged, UnitStatus
			)
			OUTPUT INSERTED.UnitID
			VALUES (
			  @UnitNumber, 
			  (SELECT PumpTypeID FROM CDS_PumpType WHERE PumpTypeName = @PumpType),
			  (SELECT DriverID FROM CDS_Driver WHERE CONCAT(DriverFirstName, ' ', DriverLastName) = @Operator),
			  @UnitMake, @UnitManufacturer, @UnitSerialNumber, @UnitLicensePlate, 
			  @UnitCVIExpiry, @UnitPipeLastChanged, @DeckPipeLastChanged, @UnitStatus
			)
		  `;

			const request = new sql.Request();
			request.input("UnitNumber", sql.NVarChar, UnitNumber);
			request.input("PumpType", sql.NVarChar, PumpType);
			request.input("Operator", sql.NVarChar, Operator);
			request.input("UnitMake", sql.NVarChar, UnitMake);
			request.input("UnitManufacturer", sql.NVarChar, UnitManufacturer);
			request.input("UnitSerialNumber", sql.NVarChar, UnitSerialNumber);
			request.input("UnitLicensePlate", sql.NVarChar, UnitLicensePlate);
			request.input(
				"UnitCVIExpiry",
				sql.DateTime,
				UnitCVIExpiry ? new Date(UnitCVIExpiry) : null,
			);
			request.input(
				"UnitPipeLastChanged",
				sql.DateTime,
				UnitPipeLastChanged ? new Date(UnitPipeLastChanged) : null,
			);
			request.input(
				"DeckPipeLastChanged",
				sql.DateTime,
				DeckPipeLastChanged ? new Date(DeckPipeLastChanged) : null,
			);
			request.input("UnitStatus", sql.Int, UnitStatus);

			const result = await request.query(query);

			const newUnitId = result.recordset[0].UnitID;

			const newUnitQuery = "SELECT * FROM CDS_Unit WHERE UnitID = @newUnitId";
			request.input("newUnitId", sql.Int, newUnitId);
			const newUnitResult = await request.query(newUnitQuery);

			res.json({
				message: "Unit created successfully",
				newUnit: newUnitResult.recordset[0],
			});
		} catch (error) {
			console.error("Error creating unit:", error);
			res
				.status(500)
				.json({ error: "An error occurred while creating the unit" });
		}
	});

	server.get("/units/all", async (req, res) => {
		try {
			const result = await sql.query(`
			SELECT 
			  u.UnitID, u.UnitNumber, p.PumpTypeName AS PumpType,
			  CONCAT(d.DriverFirstName, ' ', d.DriverLastName) AS Operator,
			  u.UnitMake, u.UnitManufacturer, u.UnitSerialNumber,
			  u.UnitLicensePlate, u.UnitCVIExpiry, u.UnitPipeLastChanged,
			  u.DeckPipeLastChanged, u.UnitStatus
			FROM CDS_Unit u
			LEFT JOIN CDS_PumpType p ON u.UnitPumpTypeID = p.PumpTypeID
			LEFT JOIN CDS_Driver d ON u.UnitDriverID = d.DriverID
		  `);
			res.json(result.recordset);
		} catch (error) {
			console.error("Error fetching units:", error);
			res.status(500).json({ error: "An error occurred while fetching units" });
		}
	});

	server.put("/units/:id", async (req, res) => {
		console.log("Received update request for unit ID:", req.params.id);
		console.log("Update data:", req.body);
		try {
			const { id } = req.params;
			const {
				UnitNumber,
				PumpType,
				Operator,
				UnitMake,
				UnitManufacturer,
				UnitSerialNumber,
				UnitLicensePlate,
				UnitCVIExpiry,
				UnitPipeLastChanged,
				DeckPipeLastChanged,
				UnitStatus,
			} = req.body;

			const request = new sql.Request();
			request.input("UnitNumber", sql.NVarChar, UnitNumber);
			request.input("PumpType", sql.NVarChar, PumpType);
			request.input("Operator", sql.NVarChar, Operator);
			request.input("UnitMake", sql.NVarChar, UnitMake);
			request.input("UnitManufacturer", sql.NVarChar, UnitManufacturer);
			request.input("UnitSerialNumber", sql.NVarChar, UnitSerialNumber);
			request.input("UnitLicensePlate", sql.NVarChar, UnitLicensePlate);
			request.input(
				"UnitCVIExpiry",
				sql.DateTime,
				UnitCVIExpiry ? new Date(UnitCVIExpiry) : null,
			);
			request.input(
				"UnitPipeLastChanged",
				sql.DateTime,
				UnitPipeLastChanged ? new Date(UnitPipeLastChanged) : null,
			);
			request.input(
				"DeckPipeLastChanged",
				sql.DateTime,
				DeckPipeLastChanged ? new Date(DeckPipeLastChanged) : null,
			);
			request.input("UnitStatus", sql.Int, UnitStatus);
			request.input("id", sql.Int, id);

			const query = `
			UPDATE CDS_Unit
			SET UnitNumber = @UnitNumber,
				UnitPumpTypeID = (SELECT PumpTypeID FROM CDS_PumpType WHERE PumpTypeName = @PumpType),
				UnitDriverID = (SELECT DriverID FROM CDS_Driver WHERE CONCAT(DriverFirstName, ' ', DriverLastName) = @Operator),
				UnitMake = @UnitMake,
				UnitManufacturer = @UnitManufacturer,
				UnitSerialNumber = @UnitSerialNumber,
				UnitLicensePlate = @UnitLicensePlate,
				UnitCVIExpiry = @UnitCVIExpiry,
				UnitPipeLastChanged = @UnitPipeLastChanged,
				DeckPipeLastChanged = @DeckPipeLastChanged,
				UnitStatus = @UnitStatus
			WHERE UnitID = @id
		  `;

			console.log("Executing SQL update query");
			await request.query(query);
			console.log("SQL update query executed successfully");

			// Fetch the updated unit data
			console.log("Fetching updated unit data");
			const result = await sql.query`
			SELECT * FROM CDS_Unit WHERE UnitID = ${id}
		  `;
			console.log("Updated unit data:", result.recordset[0]);

			res.json({
				message: "Unit updated successfully",
				updatedUnit: result.recordset[0],
			});
		} catch (error) {
			console.error("Error updating unit in database:", error);
			res.status(500).json({
				error: "An error occurred while updating the unit",
				details: error.message,
			});
		}
	});

	server.get("/pump-types", async (req, res) => {
		try {
			const result = await sql.query(
				`SELECT 
				PumpTypeID, 
				PumpTypeName, 
				PumpTypeStatus 
				FROM CDS_PumpType
				WHERE PumpTypeStatus = 1`,
			);
			res.json(result.recordset);
		} catch (error) {
			console.error("Error fetching pump types:", error);
			res
				.status(500)
				.json({ error: "An error occurred while fetching pump types" });
		}
	});

	server.get("/unit-operators", async (req, res) => {
		try {
			const result = await sql.query(
				`SELECT
				DriverID, CONCAT(DriverFirstName, ' ', DriverLastName) AS DriverName,
				DriverStatus
				FROM CDS_Driver
				WHERE DriverStatus = 1`,
			);
			res.json(result.recordset);
		} catch (error) {
			console.error("Error fetching operators:", error);
			res
				.status(500)
				.json({ error: "An error occurred while fetching operators" });
		}
	});

	server.get("/pour-type", async (req, res) => {
		try {
			const result = await sql.query("SELECT * FROM cds_pourtype");
			res.json(result.recordset);
		} catch (err) {
			res.status(500).send("Error fetching pour types");
		}
	});

	server.post("/pour-type", async (req, res) => {
		try {
			const {
				PourTypeID,
				PourTypeName,
				PourTypeComments,
				PourTypeRate,
				PourTypeStatus,
			} = req.body;
			let query = "";
			if (PourTypeID) {
				query = `UPDATE cds_pourtype SET 
                            PourTypeName = '${PourTypeName}', 
                            PourTypeComments = '${PourTypeComments}', 
                            PourTypeRate = ${PourTypeRate}, 
                            PourTypeStatus = '${PourTypeStatus}'
                          WHERE PourTypeID = ${PourTypeID}`;
			} else {
				query = `INSERT INTO cds_pourtype (PourTypeName, PourTypeComments, PourTypeRate, PourTypeStatus)
                         VALUES ('${PourTypeName}', '${PourTypeComments}', ${PourTypeRate}, '${PourTypeStatus}')`;
			}
			await sql.query(query);
			res.json({ success: true });
		} catch (err) {
			res.status(500).send("Error saving pour type");
		}
	});

	server.get("/technician", async (req, res) => {
		try {
			const result = await sql.query`
				SELECT 
					TechnicianID as id,
					TechnicianFirstName as firstName,
					TechnicianLastName as lastName,
					TechnicianAddress as address,
					TechnicianCity as city,
					TechnicianProvince as province,
					TechnicianPostalCode as postalCode,
					TechnicianPhone as homePhone,
					TechnicianCell as cellPhone,
					TechnicianEmail as email,
					TechnicianHourlyRate as hourlyRate,
					TechnicianStatus as status               
				FROM CDS_Technician
			`;
			res.json(result.recordset);
		} catch (err) {
			console.error("Error during SQL query:", err.message);
			res.status(500).json({ error: "Internal server error" });
		}
	});

	server.post("/technician", async (req, res) => {
		try {
			const {
				firstName,
				lastName,
				address,
				city,
				province,
				postalCode,
				homePhone,
				cellPhone,
				email,
				hourlyRate,
				status,
			} = req.body;

			await sql.connect(SQLConfig);

			await sql.query`
				INSERT INTO CDS_Technician (
					TechnicianFirstName,
					TechnicianLastName,
					TechnicianAddress,
					TechnicianCity,
					TechnicianProvince,
					TechnicianPostalCode,
					TechnicianPhone,
					TechnicianCell,
					TechnicianEmail,
					TechnicianHourlyRate,
					TechnicianStatus
				) VALUES (
					${firstName},
					${lastName},
					${address},
					${city},
					${province},
					${postalCode},
					${homePhone},
					${cellPhone},
					${email},
					${hourlyRate},
					1
				)`;
			res.status(201).json({ message: "Technician added successfully" });
		} catch (err) {
			console.error("Error during SQL query:", err);
			res
				.status(500)
				.json({ message: "Error adding technician", error: err.message });
		}
	});

	server.put("/technician", async (req, res) => {
		try {
			const {
				id,
				firstName,
				lastName,
				address,
				city,
				province,
				postalCode,
				homePhone,
				cellPhone,
				email,
				hourlyRate,
				status,
			} = req.body;

			await sql.connect(SQLConfig);

			await sql.query`
				UPDATE CDS_Technician
				SET
					TechnicianFirstName = ${firstName},
					TechnicianLastName = ${lastName},
					TechnicianAddress = ${address},
					TechnicianCity = ${city},
					TechnicianProvince = ${province},
					TechnicianPostalCode = ${postalCode},
					TechnicianPhone = ${homePhone},
					TechnicianCell = ${cellPhone},
					TechnicianEmail = ${email},
					TechnicianHourlyRate = ${hourlyRate},
					TechnicianStatus = ${status}
				WHERE TechnicianID = ${id}`;
			res.status(200).json({ message: "Technician updated successfully" });
		} catch (err) {
			console.error("Error during SQL query:", err);
			res
				.status(500)
				.json({ message: "Error updating technician", error: err.message });
		}
	});

	server.put("/deleteTechnician", async (req, res) => {
		try {
			const { technicianId } = req.body;

			await sql.connect(SQLConfig);

			await sql.query`
				UPDATE CDS_Technician
				SET
					TechnicianStatus = 0
                    FROM CDS_Technician
				WHERE
					TechnicianID = ${technicianId}`;
			res.status(200).json({ message: "Technician deleted successfully" });
		} catch (err) {
			console.error("Error during SQL query:", err);
			res
				.status(500)
				.json({ message: "Error deleting technician", error: err.message });
		}
	});

	server.get("/getCustomers", async (req, res) => {
		try {
			const result = await sql.query`
				SELECT  CustomerID as id,
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
			res.json(result.recordset);
		} catch (err) {
			console.error("Error during SQL query:", err.message);
			res.status(500).json({ error: "Internal server error" });
		}
	});

	server.get("/customer", async (req, res) => {
		try {
			const result = await sql.query("SELECT * FROM cds_customer");
			res.json(result.recordset);
		} catch (err) {
			res.status(500).send(`Error fetching customers: ${err.message}`);
		}
	});

	server.post("/customer", async (req, res) => {
		try {
			const {
				CustomerCompanyName,
				CustomerLastName,
				CustomerFirstName,
				CustomerAddress,
				CustomerCity,
				CustomerProvince,
				CustomerPostalCode,
				CustomerPhone,
				CustomerCell,
				CustomerEmail,
				CustomerComments,
				CustomerStatus,
				SimplyID,
				CustomerInvoiceTerms,
				CustomerFax,
			} = req.body;

			const validatedCustomerComments = CustomerComments
				? `'${CustomerComments}'`
				: "NULL";
			const validatedSimplyID = SimplyID ? `'${SimplyID}'` : "NULL";
			const validatedCustomerInvoiceTerms = CustomerInvoiceTerms
				? `'${CustomerInvoiceTerms}'`
				: "NULL";

			const defaultRatesData = await sql.query("select * from CDS_Parameter");
			const defaultRates = {};
			for (const record of defaultRatesData.recordset) {
				defaultRates[record.ParamName] = record.ParamValue;
			}

			const query = `
			INSERT INTO cds_customer (
			  CustomerType,
			  CustomerCompanyName, 
			  CustomerLastName, 
			  CustomerFirstName, 
			  CustomerAddress, 
			  CustomerCity, 
			  CustomerProvince, 
			  CustomerPostalCode, 
			  CustomerPhone,
			  CustomerFax,
			  CustomerCell, 
			  CustomerEmail, 
			  CustomerComments, 
			  CustomerStatus, 
			  SimplyID, 
			  CustomerInvoiceTerms,
			  WashoutRate,
			  RoadBan75Rate,
			  RoadBan90Rate,
			  SaturdayPourRate,
			  SecondaryOperatorRate,
			  OnsiteQaRate,
			  AdditionalDunnageRate,
			  AdditionalLineRate,
			  FlagPersonRate,
			  FuelSurchargeRate
			) OUTPUT inserted.CustomerID
			VALUES (
			  1,
			  '${CustomerCompanyName}', 
			  '${CustomerLastName}', 
			  '${CustomerFirstName}', 
			  '${CustomerAddress}', 
			  '${CustomerCity}', 
			  '${CustomerProvince}', 
			  '${CustomerPostalCode}',
			  '${CustomerFax}',
			  '${CustomerPhone}', 
			  '${CustomerCell}', 
			  '${CustomerEmail}', 
			  ${validatedCustomerComments}, 
			  ${CustomerStatus}, 
			  ${validatedSimplyID}, 
			  ${validatedCustomerInvoiceTerms},
			  ${defaultRates["default-washout-rate"]},
			  ${defaultRates["default-RoadBan75-rate"]},
			  ${defaultRates["default-RoadBan90-rate"]},
			  ${defaultRates["default-SaturdayPour-rate"]},
			  ${defaultRates["default-SecondaryOperator-rate"]},
			  ${defaultRates["default-OnsiteQa-rate"]},
			  ${defaultRates["default-AdditionalDunnage-rate"]},
			  ${defaultRates["default-AdditionalLine-rate"]},
			  ${defaultRates["default-FlagPerson-rate"]},
			  ${defaultRates["default-FuelSurcharge-rate"]}
			)`;

			const result = await sql.query(query);

			res.json({ success: true, CustomerID: result.recordset[0].CustomerID });
		} catch (err) {
			console.error("Error inserting customer:", err.message);
			res.status(500).send(`Error saving customer: ${err.message}`);
		}
	});

	server.put("/customer/:id", async (req, res) => {
		try {
			const { id } = req.params;
			const {
				CustomerCompanyName,
				CustomerLastName,
				CustomerFirstName,
				CustomerAddress,
				CustomerCity,
				CustomerProvince,
				CustomerPostalCode,
				CustomerPhone,
				CustomerFax,
				CustomerCell,
				CustomerEmail,
				CustomerComments,
				CustomerStatus,
				SimplyID,
				CustomerInvoiceTerms,
			} = req.body;

			const query = `
			UPDATE cds_customer
			SET 
			  CustomerCompanyName = @CustomerCompanyName,
			  CustomerLastName = @CustomerLastName,
			  CustomerFirstName = @CustomerFirstName,
			  CustomerAddress = @CustomerAddress,
			  CustomerCity = @CustomerCity,
			  CustomerProvince = @CustomerProvince,
			  CustomerPostalCode = @CustomerPostalCode,
			  CustomerPhone = @CustomerPhone,
			  CustomerFax = @CustomerFax,
			  CustomerCell = @CustomerCell,
			  CustomerEmail = @CustomerEmail,
			  CustomerComments = @CustomerComments,
			  CustomerStatus = @CustomerStatus,
			  SimplyID = @SimplyID,
			  CustomerInvoiceTerms = @CustomerInvoiceTerms
			WHERE CustomerID = @CustomerID`;

			const request = new sql.Request();
			request.input("CustomerCompanyName", sql.NVarChar, CustomerCompanyName);
			request.input("CustomerLastName", sql.NVarChar, CustomerLastName);
			request.input("CustomerFirstName", sql.NVarChar, CustomerFirstName);
			request.input("CustomerAddress", sql.NVarChar, CustomerAddress);
			request.input("CustomerCity", sql.NVarChar, CustomerCity);
			request.input("CustomerProvince", sql.NVarChar, CustomerProvince);
			request.input("CustomerPostalCode", sql.NVarChar, CustomerPostalCode);
			request.input("CustomerPhone", sql.NVarChar, CustomerPhone);
			request.input("CustomerFax", sql.NVarChar, CustomerFax);
			request.input("CustomerCell", sql.NVarChar, CustomerCell);
			request.input("CustomerEmail", sql.NVarChar, CustomerEmail);
			request.input("CustomerComments", sql.NVarChar, CustomerComments);
			request.input("CustomerStatus", sql.Int, CustomerStatus);
			request.input("SimplyID", sql.NVarChar, SimplyID);
			request.input("CustomerInvoiceTerms", sql.NVarChar, CustomerInvoiceTerms);
			request.input("CustomerID", sql.Int, id);

			await request.query(query);
			res.json({ success: true, CustomerID: id });
		} catch (err) {
			res.status(500).send(`Error updating customer: ${err.message}`);
		}
	});

	server.get("/suppliers", async (req, res) => {
		try {
			await sql.connect(SQLConfig);
			console.log("Connected to DB - fetching suppliers.");
			const result = await sql.query("SELECT * FROM CDS_Supplier");

			const suppliers = result.recordset.map((supplier) => ({
				id: supplier.SupplierID,
				companyName: supplier.SupplierCompanyName,
				contactName: supplier.SupplierContactName,
				address: supplier.SupplierAddress,
				city: supplier.SupplierCity,
				province: supplier.SupplierProvince,
				postalCode: supplier.SupplierPostalCode,
				phone: supplier.SupplierPhone,
				email: supplier.SupplierEmail,
				comments: supplier.SupplierComments,
				status: supplier.SupplierStatus,
			}));
			res.json(suppliers);
		} catch (error) {
			console.error("Error fetching suppliers:", error);
			res.status(500).json({ error: "Failed to fetch suppliers" });
		}
	});

	server.post("/supplier", async (req, res) => {
		const {
			companyName,
			contactName,
			address,
			city,
			province,
			postalCode,
			phone,
			email,
			comments,
			status,
		} = req.body;
		try {
			await sql.connect(SQLConfig);
			const query = `
				INSERT INTO CDS_Supplier (SupplierCompanyName, SupplierContactName, SupplierAddress, SupplierCity, SupplierProvince, SupplierPostalCode, SupplierPhone, SupplierEmail, SupplierComments, SupplierStatus)
				OUTPUT INSERTED.SupplierID AS id
				VALUES (@companyName, @contactName, @address, @city, @province, @postalCode, @phone, @email, @comments, @status)`;
			const request = new sql.Request();
			request
				.input("companyName", sql.NVarChar, companyName)
				.input("contactName", sql.NVarChar, contactName)
				.input("address", sql.NVarChar, address)
				.input("city", sql.NVarChar, city)
				.input("province", sql.NVarChar, province)
				.input("postalCode", sql.NVarChar, postalCode)
				.input("phone", sql.NVarChar, phone)
				.input("email", sql.NVarChar, email)
				.input("comments", sql.NVarChar, comments)
				.input("status", sql.Int, status);
			const result = await request.query(query);
			const insertedId = result.recordset[0].id;
			res.json({ id: insertedId, ...req.body });
		} catch (error) {
			console.error("Error adding supplier:", error);
			res.status(500).json({ error: "Failed to add supplier" });
		}
	});

	server.put("/supplier/:id", async (req, res) => {
		const { id } = req.params;
		const {
			companyName,
			contactName,
			address,
			city,
			province,
			postalCode,
			phone,
			email,
			comments,
			status,
		} = req.body;
		try {
			await sql.connect(SQLConfig);
			const query = `
				UPDATE CDS_Supplier 
				SET SupplierCompanyName = @companyName, SupplierContactName = @contactName, SupplierAddress = @address, 
					SupplierCity = @city, SupplierProvince = @province, SupplierPostalCode = @postalCode, 
					SupplierPhone = @phone, SupplierEmail = @email, SupplierComments = @comments, 
					SupplierStatus = @status
				WHERE SupplierID = @id`;
			const request = new sql.Request();
			request
				.input("id", sql.Int, id)
				.input("companyName", sql.NVarChar, companyName)
				.input("contactName", sql.NVarChar, contactName)
				.input("address", sql.NVarChar, address)
				.input("city", sql.NVarChar, city)
				.input("province", sql.NVarChar, province)
				.input("postalCode", sql.NVarChar, postalCode)
				.input("phone", sql.NVarChar, phone)
				.input("email", sql.NVarChar, email)
				.input("comments", sql.NVarChar, comments)
				.input("status", sql.Int, status);
			await request.query(query);
			res.json({ id, ...req.body });
		} catch (error) {
			console.error("Error updating supplier:", error);
			res.status(500).json({ error: "Failed to update supplier" });
		}
	});

	server.get("/operators", async (req, res) => {
		try {
			await sql.connect(SQLConfig);
			console.log("Connected to DB - fetching operators.");
			const result = await sql.query("SELECT * FROM CDS_Driver");
			const operators = result.recordset.map((operator) => ({
				driverID: operator.DriverID,
				driverLastName: operator.DriverLastName,
				driverFirstName: operator.DriverFirstName,
				driverAddress: operator.DriverAddress,
				driverCity: operator.DriverCity,
				driverProvince: operator.DriverProvince,
				driverPostalCode: operator.DriverPostalCode,
				driverPhone: operator.DriverPhone,
				driverCell: operator.DriverCell,
				driverEmail: operator.DriverEmail,
				driverLicenceNum: operator.DriverLicenceNum,
				driverTextMsgNum: operator.DriverTextMsgNum,
				driverStatus: operator.DriverStatus,
				messagePreference: operator.MessagePreference,
			}));
			res.json(operators);
		} catch (error) {
			console.error("Error fetching operators:", error);
			res.status(500).json({ error: "Failed to fetch operators" });
		}
	});

	server.get("/operator/:id", async (req, res) => {
		const { id } = req.params;
		try {
			await sql.connect(SQLConfig);
			const result =
				await sql.query`SELECT * FROM CDS_Driver WHERE DriverID = ${id}`;
			if (result.recordset.length > 0) {
				const operator = result.recordset[0];
				res.json({
					driverID: operator.DriverID,
					driverLastName: operator.DriverLastName,
					driverFirstName: operator.DriverFirstName,
					driverAddress: operator.DriverAddress,
					driverCity: operator.DriverCity,
					driverProvince: operator.DriverProvince,
					driverPostalCode: operator.DriverPostalCode,
					driverPhone: operator.DriverPhone,
					driverCell: operator.DriverCell,
					driverEmail: operator.DriverEmail,
					driverLicenceNum: operator.DriverLicenceNum,
					driverTextMsgNum: operator.DriverTextMsgNum,
					driverStatus: operator.DriverStatus,
					messagePreference: operator.MessagePreference,
				});
			} else {
				res.status(404).json({ error: "Operator not found" });
			}
		} catch (error) {
			console.error("Error fetching operator by ID:", error);
			res.status(500).json({ error: "Failed to fetch operator by ID" });
		}
	});

	server.post("/operator", async (req, res) => {
		const {
			driverLastName,
			driverFirstName,
			driverAddress,
			driverCity,
			driverProvince,
			driverPostalCode,
			driverPhone,
			driverCell,
			driverEmail,
			driverLicenceNum,
			driverTextMsgNum,
			driverStatus,
			messagePreference,
		} = req.body;

		try {
			await sql.connect(SQLConfig);
			const query = `
            INSERT INTO CDS_Driver (DriverLastName, DriverFirstName, DriverAddress, DriverCity, DriverProvince, DriverPostalCode, DriverPhone, DriverCell, DriverEmail, DriverLicenceNum, DriverTextMsgNum, DriverStatus, MessagePreference)
            OUTPUT INSERTED.DriverID AS id
            VALUES (@driverLastName, @driverFirstName, @driverAddress, @driverCity, @driverProvince, @driverPostalCode, @driverPhone, @driverCell, @driverEmail, @driverLicenceNum, @driverTextMsgNum, @driverStatus, @messagePreference)
        `;
			const request = new sql.Request();
			request
				.input("driverLastName", sql.NVarChar, driverLastName)
				.input("driverFirstName", sql.NVarChar, driverFirstName)
				.input("driverAddress", sql.NVarChar, driverAddress)
				.input("driverCity", sql.NVarChar, driverCity)
				.input("driverProvince", sql.NVarChar, driverProvince)
				.input("driverPostalCode", sql.NVarChar, driverPostalCode)
				.input("driverPhone", sql.NVarChar, driverPhone)
				.input("driverCell", sql.NVarChar, driverCell)
				.input("driverEmail", sql.NVarChar, driverEmail)
				.input("driverLicenceNum", sql.NVarChar, driverLicenceNum)
				.input("driverTextMsgNum", sql.NVarChar, driverTextMsgNum)
				.input("driverStatus", sql.Int, driverStatus)
				.input("messagePreference", sql.NVarChar, messagePreference);

			const result = await request.query(query);
			const insertedId = result.recordset[0].id;
			res.json({ id: insertedId, ...req.body });
		} catch (error) {
			console.error("Error adding operator:", error);
			res.status(500).json({ error: "Failed to add operator" });
		}
	});

	server.put("/operator/:id", async (req, res) => {
		const { id } = req.params;
		const {
			driverLastName,
			driverFirstName,
			driverAddress,
			driverCity,
			driverProvince,
			driverPostalCode,
			driverPhone,
			driverCell,
			driverEmail,
			driverLicenceNum,
			driverTextMsgNum,
			driverStatus,
			messagePreference,
		} = req.body;

		try {
			await sql.connect(SQLConfig);
			const query = `
            UPDATE CDS_Driver
            SET 
                DriverLastName = @driverLastName,
                DriverFirstName = @driverFirstName,
                DriverAddress = @driverAddress,
                DriverCity = @driverCity,
                DriverProvince = @driverProvince,
                DriverPostalCode = @driverPostalCode,
                DriverPhone = @driverPhone,
                DriverCell = @driverCell,
                DriverEmail = @driverEmail,
                DriverLicenceNum = @driverLicenceNum,
                DriverTextMsgNum = @driverTextMsgNum,
                DriverStatus = @driverStatus,
                MessagePreference = @messagePreference
            WHERE DriverID = @id
        `;
			const request = new sql.Request();
			request
				.input("id", sql.Int, id)
				.input("driverLastName", sql.NVarChar, driverLastName)
				.input("driverFirstName", sql.NVarChar, driverFirstName)
				.input("driverAddress", sql.NVarChar, driverAddress)
				.input("driverCity", sql.NVarChar, driverCity)
				.input("driverProvince", sql.NVarChar, driverProvince)
				.input("driverPostalCode", sql.NVarChar, driverPostalCode)
				.input("driverPhone", sql.NVarChar, driverPhone)
				.input("driverCell", sql.NVarChar, driverCell)
				.input("driverEmail", sql.NVarChar, driverEmail)
				.input("driverLicenceNum", sql.NVarChar, driverLicenceNum)
				.input("driverTextMsgNum", sql.NVarChar, driverTextMsgNum)
				.input("driverStatus", sql.Int, driverStatus)
				.input("messagePreference", sql.NVarChar, messagePreference);

			await request.query(query);
			res.json({ id, ...req.body });
		} catch (error) {
			console.error("Error updating operator:", error);
			res.status(500).json({ error: "Failed to update operator" });
		}
	});

	server.listen(PORT, () => {
		console.log(
			`SQL Server: ${SERVER_NAME}\nDatabase: ${DATABASE_NAME}\nExpress server running on port ${PORT}...`,
		);
	});
})();
