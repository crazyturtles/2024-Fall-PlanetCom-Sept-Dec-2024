const express = require("express");
const router = express.Router();
const sql = require("mssql/msnodesqlv8");

router.get("/", async (req, res) => {
	if (req.query.sql !== undefined) {
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

router.post("/", async (req, res) => {
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
          UnitNumber, UnitPumpTypeID, UnitDriverID, UnitMake, 
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

router.get("/all", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

		await request.query(query);

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

router.get("/pump-types", async (req, res) => {
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

router.get("/operators", async (req, res) => {
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

module.exports = router;
