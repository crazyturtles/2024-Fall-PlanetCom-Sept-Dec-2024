"use server";
const path = require("path");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const express = require("express");
const reportsRouter = require("./routers/ReportsDAL.js");
const jobRouter = require("./routers/JobDAL.js");
const customerRouter = require("./routers/CustomerDAL");
const pumpTypeRouter = require("./routers/PumpTypeDAL");
const loginRouter = require("./routers/LoginDAL");
const cookieParser = require("cookie-parser");
const verifyTokenRouter = require("./routers/VerifyToken");
const sendMessageRouter = require("./routers/SendMessage");

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const {
	validatePump,
	validateOperator,
	validateUnit,
	validateCompany,
	validateCustomer,
	validateTechnician,
	validateSupplier,
	validatePourType,
	validateJobType,
} = require("./Validation.js");
const ServerFunctions = require("./ServerFunctions.js");

let SERVER_NAME, DATABASE_NAME, NODE_PORT, EXPRESS_PORT;

try {
	SERVER_NAME = process.env.SERVER_NAME;
	DATABASE_NAME = process.env.DATABASE_NAME;
	NODE_PORT = process.env.NODE_PORT;
	EXPRESS_PORT = process.env.EXPRESS_PORT;

	console.log("\n=== Environment Configuration ===");
	console.log("SERVER_NAME:", SERVER_NAME);
	console.log("DATABASE_NAME:", DATABASE_NAME);
	console.log("NODE_PORT:", NODE_PORT);
	console.log("EXPRESS_PORT:", EXPRESS_PORT);

	if (!SERVER_NAME || !DATABASE_NAME || !NODE_PORT || !EXPRESS_PORT) {
		console.log(
			"Some environment variables missing, attempting to load from DatabaseConfig...",
		);
		const config = require("./DatabaseConfig");
		SERVER_NAME = SERVER_NAME || config.SERVER_NAME;
		DATABASE_NAME = DATABASE_NAME || config.DATABASE_NAME;
		NODE_PORT = NODE_PORT || config.NODE_PORT;
		EXPRESS_PORT = EXPRESS_PORT || config.EXPRESS_PORT;
	}

	if (!SERVER_NAME || !DATABASE_NAME || !NODE_PORT || !EXPRESS_PORT) {
		throw new Error("Missing required configuration values");
	}
} catch (error) {
	console.error("Configuration Error:", error.message);
}

const SQLConfig = {
	server: SERVER_NAME,
	database: DATABASE_NAME,
	options: {
		trustedConnection: true,
		enableArithAbort: true,
		trustServerCertificate: true,
	},
	driver: "msnodesqlv8",
};

const corsConfigs = {
	origin: `http://localhost:${NODE_PORT}`,
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	exposedHeaders: ["Set-Cookie"],
};

const TableLookUp = [
	["Unit", "CDS_Unit", "unit"],
	["Driver", "CDS_Driver", "operator"],
	["Supplier", "CDS_Supplier", "supplier"],
	["PourType", "CDS_PourType", "pourType"],
	["JobType", "CDS_JobType", "jobType"],
	["Technician", "CDS_Technician", "technician"],
	["PumpType", "CDS_PumpType", "pumpType"],
	["Customer", "CDS_Customer", "customer"],
	["Job", "CDS_Job", "job"],
];

(async () => {
	const server = express();
	server.use(cors(corsConfigs));
	server.use(express.json());
	server.use(cookieParser());
	const PORT = require("./DatabaseConfig").EXPRESS_PORT;

	const validators = {
		unit: validateUnit,
		operator: validateOperator,
		pump: validatePump,
		company: validateCompany,
		customer: validateCustomer,
		technician: validateTechnician,
		supplier: validateSupplier,
		pour: validatePourType,
		job: validateJobType,
	};

	const validateData = (data, model) => {
		const validator = validators[model];
		if (!validator) {
			throw new Error(`No validator found for model: ${model}`);
		}
		return validator(data);
	};

	await sql.connect(SQLConfig);

	server.use((req, res, next) => {
		res.header("Access-Control-Allow-Credentials", "true");
		next();
	});

	server.use("/reports", reportsRouter);
	server.use("/job", jobRouter);
	server.use("/customer", customerRouter);
	server.use("/pumpType", pumpTypeRouter);
	server.use("/auth", loginRouter);
	server.use(verifyTokenRouter);
	server.use("/send-message", sendMessageRouter);
	server.use("/", require("./routers/DefaultRatesRouter"));

	TableLookUp.forEach((lookup) => {
		server.get(`/${lookup[2]}/:id`, async (req, res) => {
			try {
				const escapedFields = req.query.fields
					.split(", ")
					.map((field) => (field.includes("-") ? `[${field}]` : field))
					.join(", ");

				const query = `select ${escapedFields} from ${lookup[1]} ${
					req.params.id !== "0" ? `where ${lookup[0]}ID = ${req.params.id}` : ""
				}`;

				const data = await sql.query(query);
				res.json(data.recordset);
			} catch (err) {
				res.status(500).send(`Error: ${err.message}`);
			}
		});

		server.post(`/${lookup[2]}/:id`, async (req, res) => {
			try {
				const hasDefaultRates =
					req.body.defaultValues && req.body.defaultValues.length > 0;

				const escapedFields = req.body.fields
					.split(", ")
					.map((field) => (field.includes("-") ? `[${field}]` : field))
					.join(", ");

				let defaultRatesValues = null;
				if (hasDefaultRates) {
					defaultRatesValues = await ServerFunctions.getDefaultRates(
						req.body.defaultValues,
					);
				}

				const query = `insert into ${lookup[1]} (${escapedFields}${
					hasDefaultRates
						? `, ${req.body.defaultValues
								.map((rate) => (rate.includes("-") ? `[${rate}]` : rate))
								.join(",")}`
						: ""
				}) values (${req.body.values}${
					hasDefaultRates ? `, ${defaultRatesValues}` : ""
				})`;

				const data = await sql.query(query);
				res.json(data.recordset);
			} catch (err) {
				res.status(500).send(`Error: ${err.message}`);
			}
		});

		server.put(`/${lookup[2]}/:id`, async (req, res) => {
			try {
				const fieldsArr = req.body.fields.split(", ");
				const valuesArr = req.body.values.split(", ");

				const query = `update ${lookup[1]} set
          ${fieldsArr.map((field, index) => {
						const escapedField = field.includes("-") ? `[${field}]` : field;
						return ` ${escapedField} = ${valuesArr[index]}`;
					})}
          where ${lookup[0]}ID = ${req.params.id}`;

				const data = await sql.query(query);
				res.json(data.recordset);
			} catch (err) {
				res.status(500).send(`Error: ${err.message}`);
			}
		});
	});

	server.listen(EXPRESS_PORT, () => {
		console.log(`\n=== Server Started ===
    SQL Server: ${SERVER_NAME}
    Database: ${DATABASE_NAME}
    Express port: ${EXPRESS_PORT}
    CORS origin: ${corsConfigs.origin}`);
	});
})();
