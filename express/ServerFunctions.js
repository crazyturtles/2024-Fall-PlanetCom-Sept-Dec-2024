const query = require("mssql/msnodesqlv8").query;
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

const parseDefaultParams = (json_data) => {
	const res = {};
	json_data.forEach((record) => {
		res[`${record.ParamName}`] = record.ParamValue;
	});
	return res;
};

const getCompanyDefault = async () => {
	const companysql = "select * from CDS_Company where CompanyID = 1";
	const defaultratessql = "select * from CDS_Parameter";
	return {
		companyresult: await query(`${companysql}`),
		defaultresult: await query(`${defaultratessql}`),
	};
};

const putCompanyDefault = async (req, res) => {
	try {
		const result = await query(`
      update CDS_Company\n
      set\n
      ${req.body.companysql}
      where CompanyID = 1;\n
      update CDS_Parameter\n
      set\n
      ParamValue = case ParamName\n
      ${req.body.defaultratessql}
      else ParamValue\n
      end
    `);
		res.json(result);
	} catch (err) {
		console.log(err.message);
		res.status(500).send(`Error: ${err.message}`);
	}
};

const getManageRates = async (req, res) => {
	const CustomerID = req.params.id;
	const customerratessql = `select * from CDS_Customer where CustomerID = ${CustomerID}`;
	const pourratessql = `select p.PourTypeID, p.PourTypeName, c.FlatRate from CDS_CustomerPourTypeRate as c join CDS_PourType as p on c.PourTypeID = p.PourTypeID where c.CustomerID = ${CustomerID}`;
	const pumpratesql = `select p.PumpTypeID, p.PumpTypeName, c.HourlyRate, c.PourRate from CDS_CustomerPumpTypeRate as c join CDS_PumpType as p on p.PumpTypeID = c.PumpTypeID where CustomerID = ${CustomerID}`;
	try {
		const customerRateInfo = await query(`${customerratessql}`);
		const pourRateInfo = await query(`${pourratessql}`);
		const pumpRateInfo = await query(`${pumpratesql}`);
		res.json({
			customerRateInfo: customerRateInfo.recordset,
			pourRateInfo: pourRateInfo.recordset,
			pumpRateInfo: pumpRateInfo.recordset,
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send(`Error: ${err.message}`);
	}
};

const putManageRates = async (req, res) => {
	const CustomerID = req.params.id;
	try {
		console.log(req.body);
		let queryArg = `
      update CDS_Customer\n
      set\n
      ${req.body.customerratessql}
      where CustomerID = ${CustomerID};\n
    `;
		if (req.body.pourTypeRateStringArgs.length > 0) {
			queryArg += `update CDS_CustomerPourTypeRate\n
      set\n
      FlatRate = case PourTypeID\n
      ${req.body.pourTypeRateStringArgs}
      else PourTypeID\n
      end
      where CustomerID = ${CustomerID};\n`;
		}
		if (req.body.pumpTypeRateStringArgsHourlyRate.length > 0) {
			queryArg += `update CDS_CustomerPumpTypeRate\n
      set\n
      HourlyRate = case PumpTypeID\n
      ${req.body.pumpTypeRateStringArgsHourlyRate}
      else PumpTypeID\n
      end
      where CustomerID = ${CustomerID};\n`;
		}
		if (req.body.pumpTypeRateStringArgsPourRate.length > 0) {
			queryArg += `update CDS_CustomerPumpTypeRate\n
      set\n
      PourRate = case PumpTypeID\n
      ${req.body.pumpTypeRateStringArgsPourRate}
      else PumpTypeID\n
      end
      where CustomerID = ${CustomerID};`;
		}
		const result = await query(queryArg);
		res.json(result);
	} catch (err) {
		console.log(err.message);
		res.status(500).send(`Error: ${err.message}`);
	}
};

const getDefaultRates = async (fields) => {
	try {
		const defaultratessql = "select * from CDS_Parameter";
		const response = await query(`${defaultratessql}`);
		const defaultRatesData = parseDefaultParams(response.recordset);

		if (!defaultRatesData || Object.keys(defaultRatesData).length === 0) {
			return fields.map(() => "0").join(",");
		}

		const values = fields
			.map((field) => {
				const lookupKey = DefaultRatesLookup[field];
				const value = defaultRatesData[lookupKey];
				return value !== undefined ? value : "0";
			})
			.join(",");

		return values;
	} catch (err) {
		console.error("Error getting default rates:", err);
		return fields.map(() => "0").join(",");
	}
};

module.exports = {
	parseDefaultParams,
	getCompanyDefault,
	putCompanyDefault,
	getManageRates,
	putManageRates,
	getDefaultRates,
};
