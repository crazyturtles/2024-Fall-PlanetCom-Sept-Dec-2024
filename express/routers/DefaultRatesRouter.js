const router = require("express").Router();
const query = require("mssql/msnodesqlv8").query;
const ServerFunctions = require("../ServerFunctions");

const DefaultRatesLookup = {
	RoadBan75Rate: "default-RoadBan75-rate",
	RoadBan90Rate: "default-RoadBan90-rate",
	SaturdayPourRate: "default-SaturdayPour-rate",
	SecondaryOperatorRate: "default-SecondaryOperator-rate",
	OnsiteQaRate: "default-OnsiteQa-rate",
	AdditionalDunnageRate: "default-AdditionalDunnage-rate",
	AdditionalLineRate: "default-AdditionalLine-rate",
	FlagPersonRate: "default-FlagPerson-rate",
	FuelSurchargeRate: "default-FuelSurcharge-rate",
	WashoutRate: "default-washout-rate",
	HourlyRate: "default-hourly-rate",
	PourRate: "default-pour-rate",
};

router.get("/company-information", async (req, res) => {
	try {
		const resonse = await ServerFunctions.getCompanyDefault();
		res.json({
			companyInfo: resonse.companyresult.recordset[0],
			defaultInfo: ServerFunctions.parseDefaultParams(
				resonse.defaultresult.recordset,
			),
		});
	} catch (err) {
		res.status(500).send(`Error: ${err.message}`);
	}
});

router.put("/company-information", ServerFunctions.putCompanyDefault);

router.get("/manage-rates/:id", ServerFunctions.getManageRates);

router.put("/manage-rates/:id", ServerFunctions.putManageRates);

module.exports = router;
