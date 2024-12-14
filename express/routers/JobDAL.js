const express = require("express");
const sql = require("mssql/msnodesqlv8");
const jobRouter = express.Router();

jobRouter.get("/", async (req, res) => {
	const dateParam = req.query.date;

	if (!dateParam) {
		return res.status(400).json({ error: "Date parameter is required" });
	}

	const dateFilter = `CAST(JobStartDate AS DATE) = '${dateParam}'`;

	const jobsQuery = `
        SELECT 
            CDS_Job.JobID, 
            CDS_Job.JobCompanyJobNum,
            JobStatus, 
            JobStartDate, 
            JobPumpTypeID, 
            JobUnitID, 
            JobDriverID, 
            JobTypeID, 
            JobCustomerID, 
            JobSiteAddress, 
            JobSiteArea, 
            JobSitePhone, 
            CustomerCompanyName,
            SupplierCompanyName,
            CONCAT(DriverFirstName, ' ', DriverLastName) AS DriverName,
            UnitNumber,
            PumpTypeName,
            JobTotalPoured,
            JobStartTime,
            JobColor,
            SupplierConfirmed,
            CustomerConfirmed,
			IsTextMessageSent
        FROM CDS_Job
        LEFT JOIN CDS_Customer ON CDS_Job.JobCustomerID = CDS_Customer.CustomerID
        LEFT JOIN CDS_Supplier ON CDS_Job.JobSupplierID = CDS_Supplier.SupplierID
        LEFT JOIN CDS_Driver ON CDS_Job.JobDriverID = CDS_Driver.DriverID
        LEFT JOIN CDS_Unit ON CDS_Job.JobUnitID = CDS_Unit.UnitID
        LEFT JOIN CDS_PumpType ON CDS_Job.JobPumpTypeID = CDS_PumpType.PumpTypeID
        WHERE ${dateFilter} 
            AND JobStartDate IS NOT NULL 
            AND JobStartDate <> ''
			AND JobStatus < 101
        ORDER BY JobStartTime;
    `;

	const pourTypesQuery = `
        SELECT 
            JobID, 
            PourTypeName 
        FROM CDS_JobPourType
        JOIN CDS_PourType ON CDS_JobPourType.PourTypeID = CDS_PourType.PourTypeID;
    `;

	try {
		const [jobsResult, pourTypesResult] = await Promise.all([
			sql.query(jobsQuery),
			sql.query(pourTypesQuery),
		]);

		res.json({
			jobs: jobsResult.recordset,
			pourTypes: pourTypesResult.recordset,
		});
	} catch (err) {
		console.error("Error fetching jobs or pour types:", err.message);
		res.status(500).send("Failed to fetch data");
	}
});

jobRouter.get("/all", async (req, res) => {
	const query = `
        SELECT 
            CDS_Job.JobID, 
            CDS_Job.JobCompanyJobNum,
            JobStatus, 
            JobStartDate, 
            JobPumpTypeID, 
            JobUnitID, 
            JobDriverID, 
            JobTypeID, 
            JobCustomerID, 
            JobSiteAddress, 
            JobSiteArea, 
            JobSitePhone, 
            CustomerCompanyName,
            SupplierCompanyName,
            PourTypeName,
            CONCAT(DriverFirstName, ' ', DriverLastName) AS DriverName,
            UnitNumber,
            PumpTypeName,
            JobTotalPoured,
            JobStartTime,
            SupplierConfirmed,
            CustomerConfirmed,
			IsTextMessageSent
        FROM CDS_Job
        LEFT JOIN CDS_Customer ON CDS_Job.JobCustomerID = CDS_Customer.CustomerID
        LEFT JOIN CDS_Supplier ON CDS_Job.JobSupplierID = CDS_Supplier.SupplierID
        LEFT JOIN CDS_JobPourType ON CDS_Job.JobID = CDS_JobPourType.JobID
        LEFT JOIN CDS_PourType ON CDS_JobPourType.PourTypeID = CDS_PourType.PourTypeID
        LEFT JOIN CDS_Driver ON CDS_Job.JobDriverID = CDS_Driver.DriverID
        LEFT JOIN CDS_Unit ON CDS_Job.JobUnitID = CDS_Unit.UnitID
        LEFT JOIN CDS_PumpType ON CDS_Job.JobPumpTypeID = CDS_PumpType.PumpTypeID
        WHERE JobStartDate IS NOT NULL 
            AND JobStartDate <> ''
        ORDER BY JobStartTime;
    `;

	try {
		const data = await sql.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching all jobs:", err.message);
		res.status(500).send("Failed to fetch all jobs");
	}
});

jobRouter.get("/search", async (req, res) => {
	const { ticket, customer } = req.query;

	if (!ticket && !customer) {
		return res
			.status(400)
			.json({ error: "Either ticket or customer parameter is required" });
	}

	let query = `
        SELECT 
            CDS_Job.JobID, 
            CDS_Job.JobCompanyJobNum,
            JobStatus, 
            CONVERT(VARCHAR, JobStartDate, 23) + ' ' + 
            CONVERT(VARCHAR, JobStartTime, 108) AS JobStartTime,
            JobPumpTypeID, 
            JobUnitID, 
            JobDriverID, 
            JobTypeID, 
            JobCustomerID, 
            JobSiteAddress, 
            JobSiteArea, 
            JobSitePhone, 
            CustomerCompanyName,
            SupplierCompanyName,
            PourTypeName,
            CONCAT(DriverFirstName, ' ', DriverLastName) AS DriverName,
            UnitNumber,
            PumpTypeName,
            JobTotalPoured,
            SupplierConfirmed,
            CustomerConfirmed
        FROM CDS_Job
        LEFT JOIN CDS_Customer ON CDS_Job.JobCustomerID = CDS_Customer.CustomerID
        LEFT JOIN CDS_Supplier ON CDS_Job.JobSupplierID = CDS_Supplier.SupplierID
        LEFT JOIN CDS_JobPourType ON CDS_Job.JobID = CDS_JobPourType.JobID
        LEFT JOIN CDS_PourType ON CDS_JobPourType.PourTypeID = CDS_PourType.PourTypeID
        LEFT JOIN CDS_Driver ON CDS_Job.JobDriverID = CDS_Driver.DriverID
        LEFT JOIN CDS_Unit ON CDS_Job.JobUnitID = CDS_Unit.UnitID
        LEFT JOIN CDS_PumpType ON CDS_Job.JobPumpTypeID = CDS_PumpType.PumpTypeID
        WHERE 1=1`;

	if (ticket) {
		query += ` AND CDS_Job.JobCompanyJobNum = '${ticket}'`;
	}

	if (customer) {
		query += ` AND CustomerCompanyName = '${customer}'`;
	}

	query += " ORDER BY JobStartDate DESC, JobStartTime DESC;";

	try {
		const data = await sql.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error searching jobs:", err.message);
		res.status(500).send("Failed to search jobs");
	}
});

jobRouter.get("/customerJob/:jobId", async (req, res) => {
	const { jobId } = req.params;

	if (!jobId) {
		return res.status(400).json({ error: "JobID parameter is required" });
	}

	const query = `
		SELECT
			CDS_Job.JobID,
			CDS_Job.JobCustomerID
		FROM CDS_Job
		WHERE JobID = @JobID;
	`;

	try {
		const request = new sql.Request();
		request.input("jobID", sql.Int, Number.parseInt(jobId));
		const result = await request.query(query);

		if (result.recordset.length === 0) {
			return res.status(404).json({ error: "No job found" });
		}

		res.json(result.recordset);
	} catch (err) {
		console.error("Error fetching job:", err.message);
		res.status(500).send("Failed to fetch job");
	}
});

jobRouter.get("/customerHistory/:customerId", async (req, res) => {
	const { customerId } = req.params;

	if (!customerId) {
		return res
			.status(400)
			.json({ error: "CustomerID parameter is required and must be a number" });
	}

	const query = `
        SELECT 
            CDS_Job.JobID, 
            CDS_Job.JobCompanyJobNum,
            JobStatus, 
            CONVERT(VARCHAR, JobStartDate, 23) + ' ' + 
            CONVERT(VARCHAR, JobStartTime, 108) AS JobStartTime,
            JobPumpTypeID, 
            JobUnitID, 
            JobDriverID, 
            JobTypeID, 
            JobCustomerID, 
            JobSiteAddress, 
            JobSiteArea, 
            JobSitePhone, 
            CustomerCompanyName,
            SupplierCompanyName,
            PourTypeName,
            CONCAT(DriverFirstName, ' ', DriverLastName) AS DriverName,
            UnitNumber,
            PumpTypeName,
            JobTotalPoured,
            SupplierConfirmed,
            CustomerConfirmed
        FROM CDS_Job
        LEFT JOIN CDS_Customer ON CDS_Job.JobCustomerID = CDS_Customer.CustomerID
        LEFT JOIN CDS_Supplier ON CDS_Job.JobSupplierID = CDS_Supplier.SupplierID
        LEFT JOIN CDS_JobPourType ON CDS_Job.JobID = CDS_JobPourType.JobID
        LEFT JOIN CDS_PourType ON CDS_JobPourType.PourTypeID = CDS_PourType.PourTypeID
        LEFT JOIN CDS_Driver ON CDS_Job.JobDriverID = CDS_Driver.DriverID
        LEFT JOIN CDS_Unit ON CDS_Job.JobUnitID = CDS_Unit.UnitID
        LEFT JOIN CDS_PumpType ON CDS_Job.JobPumpTypeID = CDS_PumpType.PumpTypeID
        WHERE CDS_Customer.CustomerID = @CustomerID
        ORDER BY JobStartDate DESC, JobStartTime DESC;
    `;

	try {
		const request = new sql.Request();
		request.input("CustomerID", sql.Int, Number.parseInt(customerId));
		const result = await request.query(query);

		if (result.recordset.length === 0) {
			return res
				.status(404)
				.json({ error: "No history found for the specified customer" });
		}

		res.json(result.recordset);
	} catch (err) {
		console.error("Error fetching customer history:", err.message);
		res.status(500).send("Failed to fetch customer history");
	}
});

jobRouter.get("/unit-status", async (req, res) => {
	const query = `
        SELECT 
            UnitID,
            UnitNumber
        FROM CDS_Unit
        ORDER BY UnitID;
    `;

	try {
		const data = await sql.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching unit IDs and numbers:", err.message);
		res.status(500).send("Failed to fetch unit IDs and numbers");
	}
});

jobRouter.post("/add-job", async (req, res) => {
	const data = req.body;
	console.log("data", data);
	const defaults = {
		JobCompanyJobNum: null,
		JobCustomerJobNum: null,
		JobStatus: 0,
		JobStartDate: null,
		JobPumpTypeID: 0,
		JobUnitID: null,
		JobDriverID: null,
		JobTypeID: 0,
		JobCustomerID: 0,
		JobSiteAddress: "",
		JobSiteArea: "",
		JobSitePhone: "",
		JobPourTypeOther: "",
		JobFlatRate: 0.0,
		JobDiscount: 0.0,
		JobPourRate: 0.0,
		JobHourlyRate: 0.0,
		JobStartTime: "1900-01-01T00:00:00",
		JobTotalHours: 0.0,
		JobTotalPoured: 0.0,
		SaturdayPourRate: 0.0,
		JobWashoutRate: 0.0,
		SecondaryOperatorRate: 0.0,
		OnsiteQaRate: 0.0,
		AdditionalDunnageRate: 0.0,
		AdditionalLineRate: 0.0,
		FlagPersonRate: 0.0,
		RoadBanRate: 0.0,
		SaturdayPourCharge: 0.0,
		OffsiteWashout: 0.0,
		SecondaryOperatorCharge: 0.0,
		OnsiteQaCharge: 0.0,
		AdditionalDunnageCharge: 0.0,
		AdditionalLineCharge: 0.0,
		FlagPersonCharge: 0.0,
		CustomerConfirmed: 0,
		WorkOrderNumber: "",
		FuelSurchargeCharge: 0.0,
		FuelSurchargeRate: 0.0,
		JobSupplierID: 0,
		JobCustomerPO: "",
		JobComments: "",
		JobReviewedForInvoicing: 0,
		SupplierConfirmed: 0,
		RoadBanCharge: 0.0,
		RoadBanPercent: 0.0,
		FlatRatePourTypeId: 0,
		JobPourTime: "1900-01-01 00:00:00",
		JobColor: -1,
		JobConfirmedDate: null,
		JobMapLocation: "",
	};

	const convertTimeToDatabaseFormat = (time) => {
		if (!time) return null;
		return `1900-01-01 ${time}:00`;
	};

	const inputData = {
		...defaults,
		...data,
		JobStartTime: convertTimeToDatabaseFormat(data.JobStartTime),
		JobPourTime: convertTimeToDatabaseFormat(data.JobPourTime),
	};

	const query = `
   INSERT INTO CDS_Job (
      JobCompanyJobNum,
      JobCustomerJobNum,
      JobStatus,
      JobStartDate,
      JobPumpTypeID,
      JobUnitID,
      JobDriverID,
      JobTypeID,
      JobCustomerID,
      JobSiteAddress,
      JobSiteArea,
      JobSitePhone,
      JobPourTypeOther,
      JobFlatRate,
      JobDiscount,
      JobPourRate,
      JobHourlyRate,
      JobStartTime,
      JobTotalHours,
      JobTotalPoured,
      SaturdayPourRate,
      JobWashoutRate,
      SecondaryOperatorRate,
      OnsiteQaRate,
      AdditionalDunnageRate,
      AdditionalLineRate,
      FlagPersonRate,
      RoadBanRate,
      SaturdayPourCharge,
      OffsiteWashout,
      SecondaryOperatorCharge,
      OnsiteQaCharge,
      AdditionalDunnageCharge,
      AdditionalLineCharge,
      FlagPersonCharge,
      CustomerConfirmed,
      WorkOrderNumber,
      FuelSurchargeCharge,
      FuelSurchargeRate,
      JobSupplierID,
      JobCustomerPO,
      JobComments,
      JobReviewedForInvoicing,
      SupplierConfirmed,
      RoadBanCharge,
      RoadBanPercent,
      FlatRatePourTypeId,
      JobPourTime,
      JobColor,
      JobConfirmedDate,
      JobMapLocation
   )  OUTPUT INSERTED.JobID
       VALUES (
      @JobCompanyJobNum,
      @JobCustomerJobNum,
      @JobStatus,
      @JobStartDate,
      @JobPumpTypeID,
      COALESCE(@JobUnitID, ''),
      @JobDriverID,
      @JobTypeID,
      @JobCustomerID,
      @JobSiteAddress,
      @JobSiteArea,
      @JobSitePhone,
      @JobPourTypeOther,
      @JobFlatRate,
      @JobDiscount,
      @JobPourRate,
      @HourlyRate,
      @JobStartTime,
      @JobTotalHours,
      @JobTotalPoured,
      @SaturdayPourRate,
      @JobWashoutRate,
      @SecondaryOperatorRate,
      @OnsiteQaRate,
      @AdditionalDunnageRate,
      @AdditionalLineRate,
      @FlagPersonRate,
      @RoadBanRate,
      @IsSaturdayPourEnabled,
      @IsOffsiteWashoutEnabled,
      @IsSecondaryOperatorEnabled,
      @IsOnsiteQAEnabled,
      @IsAdditionalDunnageEnabled,
      @IsAdditionalLineEnabled,
      @IsFlagPersonEnabled,
      @CustomerConfirmed,
      @WorkOrderNumber,
      @IsCarbonLevyEnabled,
      @CarbonLevyRate,
      @JobSupplierID,
      @JobCustomerPO,
      @JobComments,
      @JobReviewedForInvoicing,
      @SupplierConfirmed,
      @RoadBanCharge,
      @RoadBanPercent,
      @FlatRatePourTypeId,
      @JobPourTime,
      @JobColor,
      @JobConfirmedDate,
      @JobMapLocation
   );
   `;

	try {
		const request = new sql.Request();

		for (const [key, value] of Object.entries(inputData)) {
			if (key === "JobUnitID" && Array.isArray(value)) {
				const singleValue = value[0];
				request.input(key, sql.Int, singleValue);
			} else if (value === null) {
				request.input(key, sql.NVarChar, value);
			} else if (key === "JobStartDate") {
				request.input(key, sql.DateTime, value);
			} else if (key === "JobStartTime" || key === "JobPourTime") {
				const adjustedTime = new Date(value);
				adjustedTime.setHours(
					adjustedTime.getHours() - 7,
					adjustedTime.getMinutes() - 33,
				);
				request.input(key, sql.DateTime, adjustedTime);
			} else if (key === "JobConfirmedDate") {
				const adjustedTime = new Date(value);
				adjustedTime.setHours(
					adjustedTime.getHours() - 7,
					adjustedTime.getMinutes() - 33,
				);
				request.input(key, sql.DateTime, adjustedTime);
			} else if (key === "JobColor") {
				request.input(key, sql.VarChar, value);
			} else {
				request.input(key, sql.VarChar, value);
			}
		}

		const result = await request.query(query);

		if (result.recordset && result.recordset.length > 0) {
			const newJobId = result.recordset[0].JobID;
			res.status(201).json({
				success: true,
				message: "Job created successfully",
				JobID: newJobId,
			});
		} else {
			throw new Error("Failed to retrieve JobID after job creation.");
		}
	} catch (error) {
		console.error("Error during job creation:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to create job",
			error: error.message || "An unexpected error occurred",
		});
	}
});

jobRouter.get("/job-count/:JobStartDate", async (req, res) => {
	const { JobStartDate } = req.params;

	const query = `
		SELECT COUNT(JobID) AS JobCount 
		FROM CDS_Job 
		WHERE CAST(JobStartDate AS DATE) = @JobStartDate 
		AND JobStatus != 101
	`;

	try {
		const request = new sql.Request();
		request.input("JobStartDate", sql.Date, JobStartDate);

		const result = await request.query(query);

		res.json({
			success: true,
			jobCount: result.recordset[0]?.JobCount || 0,
		});
	} catch (err) {
		console.error("Error during job count:", err.message);
		res.status(500).json({
			success: false,
			message: "Failed to count jobs",
			error: err.message || "An unexpected error occurred",
		});
	}
});

jobRouter.post("/add-cribber", async (req, res) => {
	const { CribberText } = req.body;

	if (!CribberText) {
		return res.status(400).json({ error: "JobID and CribberID are required" });
	}

	const query = `
		INSERT INTO CDS_LookupCribber (CribberText)
		VALUES (@CribberText);
	`;

	try {
		const request = new sql.Request();
		request.input("CribberText", sql.NVarChar, CribberText);

		await request.query(query);

		res.status(201).json({ message: "Cribber added successfully" });
	} catch (err) {
		console.error("Error adding cribber:", err.message);
		res.status(500).json({ message: "Failed to add cribber" });
	}
});

jobRouter.delete("/delete-cribber/:cribberText", async (req, res) => {
	const { cribberText } = req.params;

	if (!cribberText) {
		return res.status(400).json({ message: "Cribber text is required." });
	}

	try {
		const deleteQuery = `
		DELETE FROM CDS_LookupCribber WHERE CribberText = @CribberText;
	  `;
		const fetchQuery = `
		SELECT CribberText FROM CDS_LookupCribber;
	  `;

		const request = new sql.Request();
		request.input("CribberText", sql.NVarChar, cribberText);

		const deleteResult = await request.query(deleteQuery);
		if (deleteResult.rowsAffected[0] === 0) {
			return res.status(404).json({ message: "Cribber not found." });
		}

		const result = await request.query(fetchQuery);
		res.status(200).json(result.recordset);
	} catch (err) {
		console.error("Error deleting cribber:", err.message);
		res.status(500).json({ message: "Failed to delete cribber." });
	}
});

jobRouter.patch("/:jobId/washing", async (req, res) => {
	console.log("PATCH /:jobId/washing called");
	console.log("Params:", req.params);
	console.log("Body:", req.body);
	const { jobId } = req.params;
	const { status } = req.body;

	if (!jobId || status !== 30) {
		return res.status(400).json({ error: "Invalid JobID or status." });
	}

	try {
		const query = `
            UPDATE CDS_Job
            SET 
                JobStatus = @Status,
                JobStatusDateTime = GETDATE()
            WHERE JobID = @JobID
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		request.input("Status", sql.Int, status);

		await request.query(query);
		res.status(200).json({ message: "Job status updated to washing." });
	} catch (err) {
		console.error("Error updating job status to washing:", err.message);
		res.status(500).send("Failed to update job status to washing.");
	}
});

jobRouter.patch("/:jobId/complete", async (req, res) => {
	console.log("PATCH /:jobId/complete called");
	console.log("Params:", req.params);
	console.log("Body:", req.body);
	const { jobId } = req.params;
	const { status } = req.body;

	if (!jobId || status !== 40) {
		return res.status(400).json({ error: "Invalid JobID or status." });
	}

	try {
		const query = `
            UPDATE CDS_Job
            SET 
                JobStatus = @Status,
                JobStatusDateTime = GETDATE()
            WHERE JobID = @JobID
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		request.input("Status", sql.Int, status);

		await request.query(query);
		res.status(200).json({ message: "Job status updated to complete." });
	} catch (err) {
		console.error("Error updating job status to complete:", err.message);
		res.status(500).send("Failed to update job status to complete.");
	}
});

jobRouter.patch("/:jobId/cancel", async (req, res) => {
	console.log("PATCH /:jobId/cancel called");
	console.log("Params:", req.params);
	const { jobId } = req.params;
	const status = 70;

	if (!jobId) {
		return res.status(400).json({ error: "JobID is required." });
	}

	try {
		const query = `
            UPDATE CDS_Job
            SET 
                JobStatus = @Status,
                JobStatusDateTime = GETDATE()
            WHERE JobID = @JobID
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		request.input("Status", sql.Int, status);

		await request.query(query);
		res.status(200).json({ message: "Job status updated to cancelled." });
	} catch (err) {
		console.error("Error updating job status to cancelled:", err.message);
		res.status(500).send("Failed to cancel the job.");
	}
});

jobRouter.patch("/:jobId/reset", async (req, res) => {
	console.log("PATCH /:jobId/reset called");
	console.log("Params:", req.params);
	console.log("Body:", req.body);
	const { jobId } = req.params;
	const { status } = req.body;

	if (!jobId || status !== 0) {
		return res.status(400).json({ error: "Invalid JobID or status." });
	}

	try {
		const query = `
            UPDATE CDS_Job
            SET 
                JobStatus = @Status
            WHERE JobID = @JobID
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		request.input("Status", sql.Int, status);

		await request.query(query);
		res.status(200).json({ message: "Job status reset" });
	} catch (err) {
		console.error("Error resetting job status:", err.message);
		res.status(500).send("Failed to reset job status.");
	}
});

jobRouter.get("/operators", async (req, res) => {
	try {
		const query = `
            SELECT 
                DriverID AS id, 
                CONCAT(DriverFirstName, ' ', DriverLastName) AS name
            FROM CDS_Driver
            ORDER BY DriverFirstName, DriverLastName;
        `;
		const data = await sql.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching operators:", err.message);
		res.status(500).send("Failed to fetch operators");
	}
});

jobRouter.patch("/:id/update-message-status", async (req, res) => {
	const { id } = req.params;
	const { isTextMessageSent } = req.body;

	if (!id) {
		return res.status(400).json({ error: "JobID is required." });
	}

	try {
		const query = `
            UPDATE CDS_Job
            SET IsTextMessageSent = @IsTextMessageSent
            WHERE JobID = @JobID
        `;

		const request = new sql.Request();
		request.input("IsTextMessageSent", sql.Bit, isTextMessageSent ? 1 : 0);
		request.input("JobID", sql.Int, id);

		const result = await request.query(query);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ error: "Job not found." });
		}

		res.status(200).json({ message: "Message status updated successfully." });
	} catch (error) {
		console.error("Error updating message status:", error);
		res.status(500).json({ error: "Failed to update message status." });
	}
});

jobRouter.get("/operators/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const query = `
            SELECT 
                DriverID, 
                DriverTextMsgNum,
                DriverTextMsgDomain,
				DriverEmail,
				MessagePreference
            FROM CDS_Driver
            WHERE DriverID = @DriverID;
        `;
		const request = new sql.Request();
		request.input("DriverID", sql.Int, id);

		const data = await request.query(query);

		if (data.recordset.length === 0) {
			return res.status(404).json({ message: "Operator not found" });
		}

		res.json(data.recordset[0]);
	} catch (err) {
		console.error("Error fetching operator:", err.message);
		res.status(500).json({ message: "Failed to fetch operator" });
	}
});

jobRouter.patch("/:jobId/assign-operator", async (req, res) => {
	const { jobId } = req.params;
	const { operatorId } = req.body;

	try {
		const query = `
            UPDATE CDS_Job
            SET JobDriverID = @OperatorID
            WHERE JobID = @JobID;
        `;

		const request = new sql.Request();
		request.input("OperatorID", sql.Int, operatorId);
		request.input("JobID", sql.Int, jobId);

		await request.query(query);

		res.status(200).json({ message: "Operator assigned successfully" });
	} catch (err) {
		console.error("Error assigning operator:", err.message);
		res.status(500).json({ message: "Failed to assign operator" });
	}
});

jobRouter.get("/units", async (req, res) => {
	try {
		const query = `
            SELECT 
                UnitID AS id, 
                UnitNumber AS number
            FROM CDS_Unit
            ORDER BY UnitNumber;
        `;
		const data = await sql.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching units:", err.message);
		res.status(500).send("Failed to fetch units");
	}
});

jobRouter.patch("/:jobId/assign-unit", async (req, res) => {
	const { jobId } = req.params;
	const { unitId } = req.body;

	if (!jobId || !unitId) {
		return res.status(400).json({ error: "JobID and UnitID are required" });
	}

	try {
		const query = `
            UPDATE CDS_Job
            SET JobUnitID = @UnitID,
                JobStatus = 20
            WHERE JobID = @JobID;
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		request.input("UnitID", sql.Int, unitId);

		await request.query(query);

		res.status(200).json({ message: "Unit assigned successfully" });
	} catch (err) {
		console.error("Error assigning unit:", err.message);
		res.status(500).send("Failed to assign unit");
	}
});

jobRouter.patch("/:jobId/postpone", async (req, res) => {
	const { jobId } = req.params;
	const { JobStartDate, JobStatus } = req.body;

	if (!jobId || !JobStartDate || JobStatus !== 60) {
		return res.status(400).json({
			error: "Invalid JobID, JobStartDate, or JobStatus. JobStatus must be 60.",
		});
	}

	try {
		const query = `
		  UPDATE CDS_Job
		  SET 
			JobStartDate = @JobStartDate,
			JobStatus = @JobStatus
		  WHERE JobID = @JobID
	  `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		request.input("JobStartDate", sql.DateTime, new Date(JobStartDate));
		request.input("JobStatus", sql.Int, JobStatus);

		await request.query(query);
		res.status(200).json({ message: "Job postponed successfully." });
	} catch (err) {
		console.error("Error postponing job:", err.message);
		res.status(500).send("Failed to postpone job.");
	}
});

jobRouter.patch("/:jobId/confirm-customer", async (req, res) => {
	const { jobId } = req.params;

	try {
		const query = `
            UPDATE CDS_Job
            SET CustomerConfirmed = 1
            WHERE JobID = @JobID AND CustomerConfirmed = 0;
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);

		const result = await request.query(query);

		if (result.rowsAffected[0] === 0) {
			return res
				.status(400)
				.json({ message: "Customer already confirmed or Job not found." });
		}

		res.status(200).json({ message: "Customer confirmed successfully." });
	} catch (err) {
		console.error("Error confirming customer:", err.message);
		res.status(500).json({ message: "Failed to confirm customer." });
	}
});

jobRouter.patch("/:jobId/confirm-supplier", async (req, res) => {
	const { jobId } = req.params;

	try {
		const query = `
            UPDATE CDS_Job
            SET SupplierConfirmed = 1
            WHERE JobID = @JobID AND SupplierConfirmed = 0;
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);

		const result = await request.query(query);

		if (result.rowsAffected[0] === 0) {
			return res
				.status(400)
				.json({ message: "Supplier already confirmed or Job not found." });
		}

		res.status(200).json({ message: "Supplier confirmed successfully." });
	} catch (err) {
		console.error("Error confirming supplier:", err.message);
		res.status(500).json({ message: "Failed to confirm supplier." });
	}
});

jobRouter.patch("/:jobId/operator-confirm", async (req, res) => {
	const { jobId } = req.params;

	try {
		const query = `
            UPDATE CDS_Job
            SET JobStatus = 25, JobStatusDateTime = GETDATE()
            WHERE JobID = @JobID;
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);

		const result = await request.query(query);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: "Job not found." });
		}

		res.status(200).json({ message: "Operator confirmed successfully." });
	} catch (error) {
		console.error("Error confirming operator:", error);
		res.status(500).json({ message: "Failed to confirm operator." });
	}
});

jobRouter.patch("/:jobId/confirm-job", async (req, res) => {
	const { jobId } = req.params;

	try {
		const query = `
            UPDATE CDS_Job
            SET JobStatus = 10, JobStatusDateTime = GETDATE()
            WHERE JobID = @JobID;

            SELECT JobColor FROM CDS_Job WHERE JobID = @JobID;
        `;

		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);

		const result = await request.query(query);
		const updatedColor = result.recordset[0]?.JobColor;

		res.status(200).json({
			JobID: jobId,
			JobStatus: 10,
			JobColor: updatedColor,
		});
	} catch (err) {
		console.error("Error confirming job:", err.message);
		res.status(500).json({ message: "Failed to confirm job." });
	}
});

jobRouter.get("/:jobId", async (req, res) => {
	const { jobId } = req.params;

	if (!jobId) {
		return res.status(400).json({ error: "JobID parameter is required" });
	}

	const query = `
        SELECT
            JobCompanyJobNum,
            JobCustomerJobNum,
            JobStatus,
            FORMAT(JobStartDate, 'yyyy-MM-ddTHH:mm:ss') AS JobStartDate,
            JobPumpTypeID,
            JobUnitID,
            JobDriverID,
            JobTypeID,
            JobCustomerID,
            JobSiteAddress,
            JobSiteArea,
            JobSitePhone,
            JobPourTypeOther,
            JobFlatRate,
            JobDiscount,
			JobPourRate,
            JobHourlyRate,
            FORMAT(JobStartTime, 'HH:mm') AS JobStartTime,
			JobTotalHours,
            JobTotalPoured,
            SaturdayPourRate,
            JobWashoutRate,
            SecondaryOperatorRate,
            OnsiteQaRate,
            AdditionalDunnageRate,
            AdditionalLineRate,
            FlagPersonRate,
            RoadBanRate,
            RoadBanPercent,
            SaturdayPourCharge,
            OffsiteWashout,
            SecondaryOperatorCharge,
            OnsiteQaCharge,
            AdditionalDunnageCharge,
            AdditionalLineCharge,
            FlagPersonCharge,
			CustomerConfirmed,
            SupplierConfirmed,
			WorkOrderNumber,
			FuelSurchargeCharge,
			FuelSurchargeRate,
			JobSupplierID,
			JobCustomerPO,
			JobComments,
            FORMAT(JobPourTime, 'HH:mm') AS JobPourTime,
            JobDriverID,
            JobUnitID,
            JobMapLocation,
            JobConfirmedDate,
			JobColor
        FROM CDS_Job
        WHERE JobID = @JobID;
    `;
	try {
		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		const result = await request.query(query);

		if (result.recordset.length === 0) {
			return res.status(404).json({ error: "Job not found" });
		}

		res.json(result.recordset[0]);
	} catch (err) {
		console.error("Error fetching job by JobID:", err.message);
		res
			.status(500)
			.json({ error: "Failed to fetch job with the specified JobID" });
	}
});

jobRouter.get("/dropdown/pourtypes/:jobId", async (req, res) => {
	const { jobId } = req.params;

	if (!jobId) {
		return res.status(400).json({ error: "JobID parameter is required" });
	}

	const pourQuery = `
        SELECT 
            pt.PourTypeID,
            pt.PourTypeName
        FROM CDS_PourType pt
    `;

	const selectedPourTypesQuery = `
        SELECT 
            pt.PourTypeID,
            pt.PourTypeName
        FROM CDS_JobPourType jpt
        JOIN CDS_PourType pt ON pt.PourTypeID = jpt.PourTypeID
        WHERE jpt.JobID = ${jobId}
    `;

	try {
		const request = new sql.Request();
		const pourTypes = await request.query(pourQuery);
		const selectedPourTypes = await request.query(selectedPourTypesQuery);

		res.json({
			pourTypes: pourTypes.recordset,
			selectedPourTypes: selectedPourTypes.recordset,
		});
	} catch (err) {
		console.error("Error fetching pour types:", err.message);
		res.status(500).send("Failed to fetch pour types");
	}
});

jobRouter.put("/update-JobPourType/:jobId", async (req, res) => {
	const { jobId } = req.params;
	const { PourTypeIDs } = req.body;
	console.log("PourTypeIDs", PourTypeIDs);

	if (!jobId) {
		return res.status(400).json({ error: "JobID parameter is required" });
	}

	if (!Array.isArray(PourTypeIDs) || PourTypeIDs.length === 0) {
		return res
			.status(400)
			.json({ error: "At least one PourTypeID is required" });
	}

	const query = `
        DELETE FROM CDS_JobPourType WHERE JobID = @JobID;  
        ${PourTypeIDs.map(
					(_, idx) => `
            INSERT INTO CDS_JobPourType (JobID, PourTypeID) 
            VALUES (@JobID, @PourTypeID${idx});`,
				).join(" ")}
    `;

	try {
		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);

		PourTypeIDs.forEach((ptId, idx) => {
			request.input(`PourTypeID${idx}`, sql.Int, ptId);
		});

		await request.query(query);

		res.status(200).json({ message: "Job pour types updated successfully" });
	} catch (err) {
		console.error("Error updating job pour types:", err.message);
		res.status(500).send("Failed to update job pour types");
	}
});

jobRouter.get("/dropdown/pumptypes", async (req, res) => {
	const query = `
        SELECT PumpTypeID AS id, 
        PumpTypeName AS name
        FROM CDS_PumpType
    `;

	try {
		const request = new sql.Request();
		const data = await request.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching pump types:", err.message);
		res.status(500).send("Failed to fetch pump types");
	}
});

jobRouter.get("/dropdown/jobtypes", async (req, res) => {
	const query = `
        SELECT 
            JobTypeID AS id,
            JobTypeText AS name
        FROM CDS_JobType;`;

	try {
		const data = await sql.query(query);
		res.json(data.recordset);
	} catch (err) {
		console.error("Error fetching job types:", err.message);
		res.status(500).send("Failed to fetch job types");
	}
});

jobRouter.get("/dropdown/customer", async (req, res) => {
	const query = `
        SELECT
            CustomerID,
            CustomerCompanyName,
            CustomerDefaultHourlyRate,
            SaturdayPourRate,
	        WashoutRate,
	        SecondaryOperatorRate,
	        OnsiteQaRate,
	        AdditionalDunnageRate,
	        AdditionalLineRate,
	        FlagPersonRate,
	        RoadBan75Rate,
	        RoadBan90Rate,
	        FuelSurchargeRate,
	        Discount,
	        FlatRate,
            CustomerComments
        FROM CDS_Customer
        ORDER BY CustomerCompanyName;
    `;

	try {
		const request = new sql.Request();
		const result = await request.query(query);
		res.status(200).json(result.recordset);
	} catch (err) {
		console.error("Error fetching customers:", err.message);
		res.status(500).send("Failed to fetch customers");
	}
});

jobRouter.get("/dropdown/customerSearch", async (req, res) => {
	const search = req.query.search || "";

	console.log("Search term:", search);
	if (!search.trim()) {
		return res.status(400).json({ error: "Search term is required" });
	}

	const query = `
        SELECT
            CustomerID,
            CustomerCompanyName,
            CustomerDefaultHourlyRate,
            SaturdayPourRate,
            WashoutRate,
            SecondaryOperatorRate,
            OnsiteQaRate,
            AdditionalDunnageRate,
            AdditionalLineRate,
            FlagPersonRate,
            RoadBan75Rate,
            RoadBan90Rate,
            FuelSurchargeRate,
            Discount,
            FlatRate,
            CustomerComments
        FROM CDS_Customer
		WHERE CustomerCompanyName LIKE @CustomerCompanyName
        ORDER BY CustomerCompanyName;
    `;

	try {
		const pool = await sql.connect();
		console.log("Database connected");

		const result = await pool
			.request()
			.input("CustomerCompanyName", sql.VarChar, `${search}%`)
			.query(query);

		res.json(result.recordset || []);
	} catch (err) {
		console.error("Error fetching customers:", err.message);
		res.status(500).json({
			error: "Failed to fetch customers",
			message: err.message,
		});
	}
});

jobRouter.get("/dropdown/supplierSearch", async (req, res) => {
	const search = req.query.search || "";

	console.log("Search term:", search);
	if (!search.trim()) {
		return res.status(400).json({ error: "Search term is required" });
	}
	const query = `
        SELECT
            SupplierID,
            SupplierCompanyName
        FROM CDS_Supplier
		WHERE SupplierCompanyName LIKE @SupplierCompanyName
        ORDER BY SupplierCompanyName;
    `;

	const searchTerm = `${search.trim()}%`;
	console.log("Search term for LIKE query:", searchTerm);

	try {
		const pool = await sql.connect();
		console.log("Database connected");

		const result = await pool
			.request()
			.input("SupplierCompanyName", sql.VarChar, searchTerm)
			.query(query);

		//console.log("SQL result:", result.recordset);

		res.json(result.recordset || []);
	} catch (err) {
		console.error("Error fetching suppliers:", err.message);
		res.status(500).json({
			error: "Failed to fetch suppliers",
			message: err.message,
		});
	}
});

jobRouter.get("/dropdown/supplier", async (req, res) => {
	console.log("Fetching all suppliers");

	const query = `
        SELECT
            SupplierID,
            SupplierCompanyName
        FROM CDS_Supplier
        ORDER BY SupplierCompanyName;
    `;

	try {
		const pool = await sql.connect();
		console.log("Database connected");

		const result = await pool.request().query(query);

		//console.log("SQL result:", result.recordset);

		res.json(result.recordset || []);
	} catch (err) {
		console.error("Error fetching suppliers:", err.message);
		res.status(500).json({
			error: "Failed to fetch suppliers",
			message: err.message,
		});
	}
});

jobRouter.get("/lookup/cribber", async (req, res) => {
	const query = `
        SELECT CribberText
        FROM CDS_LookupCribber;
    `;

	try {
		const request = new sql.Request();
		const result = await request.query(query);
		res.status(200).json(result.recordset);
	} catch (err) {
		console.error("Error fetching cribber data:", err.message);
		res.status(500).send("Failed to fetch cribber data");
	}
});

jobRouter.get("/customer/comments/:id", async (req, res) => {
	const customerID = req.params.id;
	const query = `
        SELECT CustomerComments
        FROM CDS_Customer
        WHERE CustomerID = @CustomerID;
    `;

	try {
		const request = new sql.Request();
		request.input("CustomerID", sql.Int, customerID);
		const result = await request.query(query);
		const comments = result.recordset[0]?.CustomerComments || "";
		res.status(200).json({ CustomerComments: comments });
	} catch (err) {
		console.error("Error fetching customer comments:", err.message);
		res.status(500).send("Failed to fetch customer comments");
	}
});

jobRouter.put("/customer/comments/:id", async (req, res) => {
	const customerID = req.params.id;
	const { CustomerComments } = req.body;

	if (!customerID || CustomerComments === undefined) {
		return res.status(400).send("Customer ID and comments are required.");
	}

	const query = `
        UPDATE CDS_Customer
        SET CustomerComments = @CustomerComments
        WHERE CustomerID = @CustomerID;
    `;

	try {
		const request = new sql.Request();
		request.input("CustomerID", sql.Int, customerID);
		request.input("CustomerComments", sql.NVarChar(sql.MAX), CustomerComments);
		const result = await request.query(query);

		if (result.rowsAffected[0] > 0) {
			res.status(200).send("Customer comments updated successfully.");
		} else {
			res.status(404).send("Customer not found.");
		}
	} catch (err) {
		console.error("Error updating customer comments:", err.message);
		res.status(500).send("Failed to update customer comments.");
	}
});

jobRouter.put("/delete/:jobId", async (req, res) => {
	const { jobId } = req.params;

	if (!jobId) {
		return res.status(400).json({ error: "JobID parameter is required" });
	}

	//Update job status to -10 (soft delete)
	const query = `
        UPDATE CDS_Job
        SET JobStatus = 101
        WHERE JobID = @JobID;
    `;

	try {
		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);

		const result = await request.query(query);

		if (result.rowsAffected[0] === 0) {
			return res
				.status(404)
				.json({ error: "Job not found or already deleted" });
		}

		res.status(200).json({
			message: `Job with JobID ${jobId} successfully marked as deleted`,
		});
	} catch (err) {
		console.error("Error updating job status to 101:", err.message);
		res.status(500).json({ error: "Failed to update job status to 101" });
	}
});

function handleOptionalBit(value) {
	return value === undefined || value === null ? null : value ? 1 : 0;
}

jobRouter.put("/:jobId", async (req, res) => {
	const { jobId } = req.params;
	const {
		JobCompanyJobNum,
		JobStatus,
		JobStartDate,
		JobPumpTypeID,
		JobUnitID,
		JobDriverID,
		JobTypeID,
		JobCustomerID,
		JobSupplierID,
		JobSiteAddress,
		JobSiteArea,
		JobSitePhone,
		JobTotalPoured,
		JobStartTime,
		JobPourTypeOther,
		JobFlatRate,
		JobDiscount,
		CarbonLevyRate,
		SaturdayPourRate,
		WashoutRate,
		SecondaryOperatorRate,
		OnsiteQaRate,
		AdditionalDunnageRate,
		AdditionalLineRate,
		FlagPersonRate,
		RoadBanRate,
		HourlyRate,
		IsSaturdayPourEnabled,
		IsOffsiteWashoutEnabled,
		IsSecondaryOperatorEnabled,
		IsOnsiteQAEnabled,
		IsAdditionalDunnageEnabled,
		IsAdditionalLineEnabled,
		IsFlagPersonEnabled,
		IsCarbonLevyEnabled,
		RoadBanSelection,
		CustomerConfirmed,
		WorkOrderNumber,
		JobPourTime,
		SupplierConfirmed,
		JobCustomerPO,
		JobCustomerJobNum,
		JobMapLocation,
		JobComments,
		RoadBanPercent,
		JobPourRate,
		JobTotalHours,
		JobConfirmedDate,
		JobColor,
	} = req.body;

	const query = `
        UPDATE CDS_Job
        SET 
            JobCompanyJobNum = @JobCompanyJobNum,
            JobStatus = @JobStatus,
            JobStartDate = @JobStartDate,
            JobPumpTypeID = @JobPumpTypeID,
            JobUnitID = @JobUnitID,
            JobDriverID = @JobDriverID,
            JobTypeID = @JobTypeID,
            JobCustomerID = @JobCustomerID,
            JobSupplierID = @JobSupplierID,
            JobSiteAddress = @JobSiteAddress,
            JobSiteArea = @JobSiteArea,
            JobSitePhone = @JobSitePhone,
            JobPourTypeOther = @JobPourTypeOther,
            JobFlatRate = @JobFlatRate,
            JobDiscount = @JobDiscount,
            JobHourlyRate = @HourlyRate,
            JobPourRate = @JobPourRate, 
            JobStartTime = @JobStartTime,
            JobTotalHours = @JobTotalHours,
            JobTotalPoured = @JobTotalPoured,
            SaturdayPourRate = @SaturdayPourRate,
            JobWashoutRate = @WashoutRate,
            SecondaryOperatorRate = @SecondaryOperatorRate,
            OnsiteQaRate = @OnsiteQaRate,
            AdditionalDunnageRate = @AdditionalDunnageRate,
            AdditionalLineRate = @AdditionalLineRate,
            FlagPersonRate = @FlagPersonRate,
            RoadBanRate = @RoadBanRate,
            SaturdayPourCharge = @IsSaturdayPourEnabled,
            OffsiteWashout = @IsOffsiteWashoutEnabled,
            SecondaryOperatorCharge = @IsSecondaryOperatorEnabled,
            OnsiteQaCharge = @IsOnsiteQAEnabled,
            AdditionalDunnageCharge = @IsAdditionalDunnageEnabled,
            AdditionalLineCharge = @IsAdditionalLineEnabled,
            FlagPersonCharge = @IsFlagPersonEnabled,
            RoadBanCharge = @RoadBanSelection,
            FuelSurchargeCharge = @IsCarbonLevyEnabled,
            CustomerConfirmed = @CustomerConfirmed,
            WorkOrderNumber = @WorkOrderNumber,
            JobPourTime = @JobPourTime,
            SupplierConfirmed = @SupplierConfirmed,
            JobCustomerPO = @JobCustomerPO,
            JobCustomerJobNum = @JobCustomerJobNum,
            JobMapLocation = @JobMapLocation,
            JobComments = @JobComments,
            RoadBanPercent = @RoadBanPercent,
            FuelSurchargeRate = @CarbonLevyRate,
            JobConfirmedDate = @JobConfirmedDate,
			JobColor = @JobColor
        WHERE JobID = @JobID;
    `;

	try {
		const request = new sql.Request();
		request.input("JobID", sql.Int, jobId);
		request.input("JobCompanyJobNum", sql.VarChar, JobCompanyJobNum);
		request.input("JobStatus", sql.Int, JobStatus);
		request.input("JobStartDate", sql.DateTime, new Date(JobStartDate));
		request.input("JobPumpTypeID", sql.Int, JobPumpTypeID);
		request.input("JobUnitID", sql.Int, JobUnitID);
		request.input("JobDriverID", sql.Int, JobDriverID);
		request.input("JobTypeID", sql.Int, JobTypeID);
		request.input("JobCustomerID", sql.Int, JobCustomerID);
		request.input("JobSupplierID", sql.Int, JobSupplierID);
		request.input("JobSiteAddress", sql.VarChar, JobSiteAddress);
		request.input("JobSiteArea", sql.VarChar, JobSiteArea);
		request.input("JobSitePhone", sql.VarChar, JobSitePhone);
		request.input("JobStartTime", sql.Time, JobStartTime);
		request.input("JobPourTime", sql.Time, JobPourTime);
		request.input("JobPourTypeOther", sql.VarChar, JobPourTypeOther);
		request.input("JobFlatRate", sql.Decimal, JobFlatRate);
		request.input("JobDiscount", sql.Decimal(18, 2), JobDiscount);
		request.input("CarbonLevyRate", sql.Decimal(18, 2), CarbonLevyRate);
		request.input("SaturdayPourRate", sql.Decimal, SaturdayPourRate);
		request.input("WashoutRate", sql.Decimal, WashoutRate);
		request.input("SecondaryOperatorRate", sql.Decimal, SecondaryOperatorRate);
		request.input("OnsiteQaRate", sql.Decimal, OnsiteQaRate);
		request.input("AdditionalDunnageRate", sql.Decimal, AdditionalDunnageRate);
		request.input("AdditionalLineRate", sql.Decimal, AdditionalLineRate);
		request.input("FlagPersonRate", sql.Decimal, FlagPersonRate);
		request.input("RoadBanRate", sql.Decimal, RoadBanRate);
		request.input("HourlyRate", sql.Decimal, HourlyRate);
		request.input("JobPourRate", sql.Decimal, JobPourRate);
		request.input("JobTotalHours", sql.Decimal, JobTotalHours);
		request.input("JobTotalPoured", sql.Decimal, JobTotalPoured);
		request.input(
			"IsSaturdayPourEnabled",
			sql.Bit,
			handleOptionalBit(IsSaturdayPourEnabled),
		);
		request.input(
			"IsOffsiteWashoutEnabled",
			sql.Bit,
			handleOptionalBit(IsOffsiteWashoutEnabled),
		);
		request.input(
			"IsSecondaryOperatorEnabled",
			sql.Bit,
			handleOptionalBit(IsSecondaryOperatorEnabled),
		);
		request.input(
			"IsOnsiteQAEnabled",
			sql.Bit,
			handleOptionalBit(IsOnsiteQAEnabled),
		);
		request.input(
			"IsAdditionalDunnageEnabled",
			sql.Bit,
			handleOptionalBit(IsAdditionalDunnageEnabled),
		);
		request.input(
			"IsAdditionalLineEnabled",
			sql.Bit,
			handleOptionalBit(IsAdditionalLineEnabled),
		);
		request.input(
			"IsFlagPersonEnabled",
			sql.Bit,
			handleOptionalBit(IsFlagPersonEnabled),
		);
		request.input(
			"IsCarbonLevyEnabled",
			sql.Bit,
			handleOptionalBit(IsCarbonLevyEnabled),
		);
		request.input("RoadBanSelection", sql.VarChar, RoadBanSelection);
		request.input(
			"CustomerConfirmed",
			sql.Bit,
			handleOptionalBit(CustomerConfirmed),
		);
		request.input("WorkOrderNumber", sql.VarChar, WorkOrderNumber);
		request.input("SupplierConfirmed", sql.Bit, SupplierConfirmed);
		request.input("JobCustomerPO", sql.VarChar, JobCustomerPO);
		request.input("JobCustomerJobNum", sql.VarChar, JobCustomerJobNum);
		request.input("JobMapLocation", sql.VarChar, JobMapLocation);
		request.input("JobComments", sql.VarChar, JobComments);
		request.input("RoadBanPercent", sql.Int, RoadBanPercent);
		request.input("JobConfirmedDate", sql.DateTime, JobConfirmedDate);
		request.input("JobColor", sql.VarChar, JobColor);

		await request.query(query);
		res.status(200).send("Job updated successfully.");
	} catch (err) {
		console.error("Error updating job:", err.message);
		res.status(500).send("Failed to update job.");
	}
});

module.exports = jobRouter;
