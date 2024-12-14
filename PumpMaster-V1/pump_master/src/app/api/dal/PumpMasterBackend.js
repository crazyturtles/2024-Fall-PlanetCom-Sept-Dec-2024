"use server";

const sql = require("mssql/msnodesqlv8");
//const express = require("express");

//const app = express();
const config = {
	server: "localhost",
	database: "PumpMasterDB",
	options: {
		trustedConnection: true, // Set to true if using Windows Authentication
		trustServerCertificate: true, // Set to true if using self-signed certificates
	},
	driver: "msnodesqlv8", // Required if using Windows Authentication
};

export const getJob = async () => {
	try {
		await sql.connect(config);
		const result = await sql.query`
            SELECT JobTypeID AS id, JobTypeText AS jobType FROM CDS_JobType
        `;
		return result.recordset;
	} catch (err) {
		console.error("Error during SQL query:", err.message);
		throw new Error("SQL initialization failed: " + err.message);
	}
};

export const getLogin = async (username, password) => {
	try {
		await sql.connect(config);
		const result =
			await sql.query`SELECT Username, PasswordHash FROM PM_Users Where ${username} = Username AND PasswordHash = ${password}`;
		return result.recordset;
	} catch (err) {
		console.error("Error during SQL query:", err.message);
		throw new Error("SQL initialization failed: " + err.essage);
	}
};

export const addJob = async (jobData) => {
	try {
		await sql.connect(config);
		const { jobType } = jobData;

		await sql.query`
                INSERT INTO CDS_JobType (
					JobTypeText
				) VALUES (
				 	${jobType}
				)`;

		return { message: "Job added successfully" };
	} catch (err) {
		throw new Error(err.message);
	}
};

export const updateJob = async (Jobid, jobData) => {
	try {
		await sql.connect(config);
		const { jobType } = jobData;

		await sql.query`
            UPDATE CDS_JobType
            SET JobTypeText = ${jobType}
            WHERE JobTypeID = ${Jobid}
        `;

		return { message: "Job updated successfully" };
	} catch (err) {
		console.error("Error during job update:", err.message);
		throw new Error(err.message);
	}
};
