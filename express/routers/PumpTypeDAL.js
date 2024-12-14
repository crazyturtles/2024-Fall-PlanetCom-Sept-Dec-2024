const express = require("express");
const sql = require("mssql/msnodesqlv8");

const pumpTypeRouter = express.Router();

pumpTypeRouter.get("/", async (req, res) => {
	try {
		const query =
			"SELECT PumpTypeID, PumpTypeName, PumpTypeHourlyRate, PumpTypePourRate, PumpTypeWashoutRate FROM CDS_PumpType WHERE PumpTypeStatus = 1";
		const data = await sql.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching pump types:", err.message);
		res.status(500).send("Failed to fetch pump types");
	}
});

module.exports = pumpTypeRouter;
