const express = require("express");
const router = express.Router();
const sql = require("mssql/msnodesqlv8");

router.get("/customers", async (req, res) => {
	try {
		const result = await sql.query(`
           SELECT 
               CustomerID,
               CustomerFirstName + ' ' + CustomerLastName as CustomerName
           FROM CDS_Customer 
           WHERE CustomerStatus = 1 
               AND CustomerType = 1
           ORDER BY CustomerLastName, CustomerFirstName
       `);
		res.json(result.recordset);
	} catch (error) {
		res.status(500).json({
			error: "An error occurred while fetching the customers list",
			details: error.message,
		});
	}
});

router.get("/job-history", async (req, res) => {
	try {
		const customerId = req.query.customerId;
		const unitSent = req.query.unitSent;

		const request = new sql.Request();
		request.input("customerId", sql.Int, customerId);
		request.input("unitSent", sql.VarChar, unitSent);

		const result = await request.query(`
            WITH HistoricalUnits AS (
                SELECT 
                    j.JobID,
                    COALESCE(
                        (SELECT TOP 1 UnitNumber 
                         FROM CDS_Unit 
                         WHERE UnitID = j.JobUnitID
                         AND (j.JobStartDate >= UnitPipeLastChanged OR UnitPipeLastChanged IS NULL)
                         ORDER BY UnitPipeLastChanged DESC),
                        u.UnitNumber
                    ) as HistoricalUnitNumber
                FROM CDS_Job j
                LEFT JOIN CDS_Unit u ON j.JobUnitID = u.UnitID
            )
            SELECT 
                c.CustomerFirstName + ' ' + c.CustomerLastName as 'Customer',
                FORMAT(j.JobStartDate, 'dd-MMM-yyyy') as 'Job Date',
                FORMAT(j.JobPourTime, 'h:mmtt') as 'Pour Time',
                hu.HistoricalUnitNumber as 'Unit Sent',
                d.DriverFirstName + ' ' + d.DriverLastName as 'Operator',
                j.JobSitePhone as 'Site Phone',
                j.JobSiteAddress as 'Site Address',
                j.JobSiteArea as 'Site Area',
                s.SupplierCompanyName as 'Supplier',
                STRING_AGG(pt.PourTypeName, ', ') as 'Pour Types',
                CASE j.JobStatus
                    WHEN 0 THEN 'Pending'
                    WHEN 10 THEN 'Confirmed'
                    WHEN 20 THEN 'Scheduled'
                    WHEN 25 THEN 'Operator Confirmed'
                    WHEN 30 THEN 'Cleaning'
                    WHEN 40 THEN 'Complete'
                    WHEN 60 THEN 'Postponed'
                    WHEN 70 THEN 'Cancelled'
                    WHEN 80 THEN 'Ready for Invoicing'
                    WHEN 90 THEN 'Invoiced'
                    WHEN 100 THEN 'Not for Invoicing'
                    ELSE 'Unknown'
                END as 'Status'
            FROM CDS_Job j
            JOIN HistoricalUnits hu ON j.JobID = hu.JobID
            JOIN CDS_Customer c ON j.JobCustomerID = c.CustomerID
            LEFT JOIN CDS_Driver d ON j.JobDriverID = d.DriverID
            LEFT JOIN CDS_Supplier s ON j.JobSupplierID = s.SupplierID
            LEFT JOIN CDS_JobPourType jpt ON j.JobID = jpt.JobID
            LEFT JOIN CDS_PourType pt ON jpt.PourTypeID = pt.PourTypeID
            WHERE j.JobCustomerID = @customerId
            AND (@unitSent IS NULL OR hu.HistoricalUnitNumber LIKE '%' + @unitSent + '%')
            GROUP BY 
                c.CustomerFirstName,
                c.CustomerLastName,
                j.JobID,
                j.JobStartDate,
                j.JobPourTime,
                hu.HistoricalUnitNumber,
                d.DriverFirstName,
                d.DriverLastName,
                j.JobSitePhone,
                j.JobSiteAddress,
                j.JobSiteArea,
                s.SupplierCompanyName,
                j.JobStatus
            ORDER BY j.JobStartDate DESC
        `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching job history:", error);
		res.status(500).json({
			error: "An error occurred while fetching the job history",
			details: error.message,
		});
	}
});

router.get("/inventory-list", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT 
                COALESCE(sc.Title, 'Uncategorized') as Category,
                i.PartNumber as [Part #],
                i.Description as [Part Description],
                i.QuantityOnHand as Qty,
                i.PartCost as Cost
            FROM CDS_Inventory i
            LEFT JOIN CDS_ServiceCategory sc ON i.PartCategoryID = sc.ServiceCategoryID
            ORDER BY 
                Category,
                i.PartNumber
                `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching inventory list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the inventory list",
			details: error.message,
		});
	}
});

router.get("/customer-job-history/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const request = new sql.Request();
		request.input("id", sql.Int, id);

		const result = await sql.query(`
            SELECT 
                FORMAT(j.JobStartDate, 'dd-MMM-yyyy') as 'Job Date',
                FORMAT(j.JobPourTime, 'h:mmtt') as 'Pour Time',
                u.UnitNumber as 'Unit Sent',
                d.DriverFirstName + ' ' + d.DriverLastName as 'Operator',
                j.JobSitePhone as 'Site Phone',
                j.JobSiteAddress as 'Site Address',
                j.JobSiteArea as 'Site Area',
                s.SupplierCompanyName as 'Supplier',
                STRING_AGG(pt.PourTypeName, ', ') as 'Pour Types',
                CASE j.JobStatus
                    WHEN 0 THEN 'Pending'
                    WHEN 10 THEN 'Confirmed'
                    WHEN 20 THEN 'Scheduled'
                    WHEN 25 THEN 'Operator Confirmed'
                    WHEN 30 THEN 'Cleaning'
                    WHEN 40 THEN 'Complete'
                    WHEN 60 THEN 'Postponed'
                    WHEN 70 THEN 'Cancelled'
                    WHEN 80 THEN 'Ready for Invoicing'
                    WHEN 90 THEN 'Invoiced'
                    WHEN 100 THEN 'Not for Invoicing'
                    ELSE 'Unknown'
                END as 'Status'
            FROM CDS_Job j
            LEFT JOIN CDS_Unit u ON j.JobUnitID = u.UnitID
            LEFT JOIN CDS_Driver d ON j.JobDriverID = d.DriverID
            LEFT JOIN CDS_Supplier s ON j.JobSupplierID = s.SupplierID
            LEFT JOIN CDS_JobPourType jpt ON j.JobID = jpt.JobID
            LEFT JOIN CDS_PourType pt ON jpt.PourTypeID = pt.PourTypeID
            WHERE j.JobCustomerID = @id
            GROUP BY 
                j.JobID,
                j.JobStartDate,
                j.JobPourTime,
                u.UnitNumber,
                d.DriverFirstName,
                d.DriverLastName,
                j.JobSitePhone,
                j.JobSiteAddress,
                j.JobSiteArea,
                s.SupplierCompanyName,
                j.JobStatus
            ORDER BY j.JobStartDate DESC
            `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching inventory list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the inventory list",
			details: error.message,
		});
	}
});

router.get("/customer-job-count", async (req, res) => {
	try {
		const customerId = req.query.customerId;

		if (!customerId) {
			return res.status(400).json({ error: "Customer ID is required" });
		}

		const request = new sql.Request();
		request.input("customerId", sql.Int, customerId);

		const result = await request.query(`
            SELECT
                c.CustomerID,
                c.CustomerCompanyName,
                COUNT(j.JobID) as JobCount
            FROM CDS_Customer c
            LEFT JOIN CDS_Job j ON c.CustomerID = j.JobCustomerID
            WHERE c.CustomerID = @customerId
            GROUP BY 
                c.CustomerID, 
                c.CustomerCompanyName
        `);

		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching customer job count:", error);
		res.status(500).json({
			error: "An error occurred while fetching the customer job count",
			details: error.message,
		});
	}
});

router.get("/amount-pumped-since-pipe-change", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT 
                CDS_Unit.UnitNumber as Unit,
                qry.boompoured as Total_Poured,
                FORMAT(qry.boomchanged, 'dd-MMM-yyyy') as Pipe_Changed,
                qry.deckpoured as Deck_Total_Poured,
                FORMAT(qry.deckchanged, 'dd-MMM-yyyy') as Deck_Pipe_Changed,
                CASE 
                    WHEN CDS_Unit.UnitStatus = 1 THEN 'A'
                    ELSE 'I'
                END AS Status,
                COALESCE(CDS_PumpType.PumpTypeName + '-' + CDS_Unit.UnitNumber, CDS_Unit.UnitNumber) as SortKey
            FROM qryUnitAmountPouredSincePipeChange qry
            INNER JOIN CDS_Unit ON qry.JobUnitID = CDS_Unit.UnitID
            LEFT JOIN CDS_PumpType ON CDS_Unit.UnitPumpTypeID = CDS_PumpType.PumpTypeID 
            WHERE CDS_Unit.UnitStatus = 1
            ORDER BY CDS_Unit.UnitID ASC,
                CDS_PumpType.PumpTypeName + '-' + CDS_Unit.UnitNumber ASC;
        `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching pipe change data:", error);
		res.status(500).json({
			error: "An error occurred while fetching the pipe change data",
			details: error.message,
		});
	}
});

router.get("/customer-list", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT 
                C.CustomerCompanyName AS CompanyName,
                CONCAT (C.CustomerFirstName, '  ', C.CustomerLastName) AS Contact,
                C.CustomerPhone AS Phone,
                C.CustomerEmail AS Email
                FROM CDS_Customer C
                WHERE C.CustomerStatus = 1
                ORDER BY C.CustomerCompanyName
            `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching customer list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the customer list",
			details: error.message,
		});
	}
});

router.get("/pumptype-list", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT
            pt.PumpTypeName AS Name, 
            pt.PumpTypeHourlyRate AS HourlyRate
            FROM CDS_PumpType pt
            WHERE pt.PumpTypeStatus = 1;
            `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching pump type list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the pump type list",
			details: error.message,
		});
	}
});

router.get("/pourtype-list", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT
            p.PourTypeName AS Name, 
            p.PourTypeComments AS Comments
            FROM CDS_PourType p
            WHERE p.PourTypeStatus = 1
            ORDER BY p.PourTypeName
            `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching pour type list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the pour type list",
			details: error.message,
		});
	}
});

router.get("/supplier-list", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT
                s.SupplierCompanyName AS CompanyName,
                s.SupplierContactName AS Contact,
                s.SupplierPhone AS Phone,
                s.SupplierEmail AS Email
                FROM CDS_Supplier s
                WHERE s.SupplierStatus = 1
                ORDER BY CompanyName
            `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching supplier list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the supplier list",
			details: error.message,
		});
	}
});

router.get("/unit-list", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT
                u.UnitNumber AS UnitNumber, 
                CONCAT(d.DriverFirstName, ' ', d.DriverLastName) AS Driver, 
                u.UnitMileage AS Mileage, 
                u.UnitMileageDate AS MileageDate, 
                u.UnitHourlyRate AS HourlyRate, 
                u.UnitPourRate AS PourRate
                FROM CDS_Unit u
                JOIN CDS_Driver d ON u.UnitDriverID = d.DriverID
                WHERE u.UnitStatus = 1;

            `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching unit list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the unit list",
			details: error.message,
		});
	}
});

router.get("/customer-pumpTypeRates", async (req, res) => {
	try {
		const result = await sql.query(`
            WITH CustomerPumpRates AS (
                -- Get the most recent rate for each customer-pump type combination
                SELECT 
                    c.CustomerID,
                    c.CustomerCompanyName,
                    pt.PumpTypeName,
                    -- Use the job-specific rates if they exist, otherwise use standard pump type rates
                    COALESCE(j.JobHourlyRate, pt.PumpTypeHourlyRate) as PumpTypeHourlyRate,
                    COALESCE(j.JobPourRate, pt.PumpTypePourRate) as PumpTypePourRate,
                    ROW_NUMBER() OVER (
                        PARTITION BY c.CustomerID, pt.PumpTypeID 
                        ORDER BY j.JobStartDate DESC
                    ) as RowNum
                FROM CDS_Customer c
                CROSS JOIN CDS_PumpType pt
                LEFT JOIN CDS_Job j ON c.CustomerID = j.JobCustomerID 
                    AND j.JobPumpTypeID = pt.PumpTypeID
                WHERE 
                    c.CustomerStatus = 1  -- Only active customers
                    AND pt.PumpTypeStatus = 1  -- Only active pump types
            )
            SELECT 
                CustomerCompanyName,
                PumpTypeName,
                PumpTypeHourlyRate,
                PumpTypePourRate
            FROM CustomerPumpRates
            WHERE RowNum = 1  -- Get only the most recent rate
            ORDER BY 
                CustomerCompanyName,
                PumpTypeName;
        `);

		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching customer pump type rates:", error);
		res.status(500).json({
			error: "An error occurred while fetching the customer pump type rates",
			details: error.message,
		});
	}
});

router.get("/operator-list", async (req, res) => {
	try {
		const result = await sql.query(`
            SELECT
                CONCAT (d.DriverFirstName, '' , d.DriverLastName) AS OperatorName,
                d.DriverPhone AS Phone,
                d.DriverCell AS Cell,
                d.DriverTextMsgNum AS TextMsgNum,
                d.DriverEmail AS Email
                FROM CDS_Driver d
                Where d.DriverStatus = 1
                Order BY OperatorName
            `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching operator list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the operator list",
			details: error.message,
		});
	}
});

router.get("/job-forecast", async (req, res) => {
	try {
		const startDate = new Date(req.query.startDate);
		const endDate = new Date(req.query.endDate);
		if (Number.isNaN(startDate) || Number.isNaN(endDate)) {
			return res.status(400).json({ error: "Invalid date format" });
		}

		const request = new sql.Request();
		request.input("StartDate", sql.Date, startDate);
		request.input("EndDate", sql.Date, endDate);

		const result = await request.query(`
            SELECT 
                c.CustomerCompanyName,
                ISNULL(SUM(CASE WHEN j.JobStatus IN (0, 10) THEN 1 ELSE 0 END), 0) AS PendingJobCount,
                ISNULL(SUM(CASE WHEN j.JobStatus IN (20, 40) THEN 1 ELSE 0 END), 0) AS ConfirmedJobCount,
                ISNULL(SUM(CASE WHEN j.JobStatus IN (70, 90, 100) THEN 1 ELSE 0 END), 0) AS CompletedJobCount,
                ISNULL(COUNT(j.JobID), 0) AS TotalJobCount
            FROM 
                CDS_Customer c
            LEFT JOIN 
                CDS_Job j ON c.CustomerID = j.JobCustomerID 
                    AND j.JobConfirmedDate >= @StartDate
                    AND j.JobStartDate <= @EndDate
            GROUP BY 
                c.CustomerCompanyName
            HAVING 
                COUNT(j.JobID) > 0
            ORDER BY 
                c.CustomerCompanyName;
        `);

		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching job forecast list:", error);
		res.status(500).json({
			error: "An error occurred while fetching the job forecast list",
			details: error.message,
		});
	}
});

router.get("/job-details/:jobId", async (req, res) => {
	try {
		const { jobId } = req.params;
		const query = `
            SELECT 
                u.UnitNumber as AssignedUnit,
                CONCAT(d.DriverFirstName, ' ', d.DriverLastName) as AssignedOperator,
                j.JobCompanyJobNum as TicketNo,
                c.CustomerCompanyName as Customer,
                FORMAT(j.JobStartDate, 'MMMM dd, yyyy') as JobDate,
                FORMAT(j.JobStartTime, 'h:mm tt') as TimeOnSite,
                FORMAT(j.JobPourTime, 'h:mm tt') as ConcreteOnsite,
                s.SupplierCompanyName as Supplier,
                j.JobCustomerPO as CustomerPO,
                j.JobCustomerJobNum as CustomerJobNo,
                CAST(j.JobSiteAddress as VARCHAR(MAX)) as SiteAddress,     
                j.JobSiteArea as SiteSubdivArea,     
                '' as SiteCityTown,     
                CAST(j.JobSitePhone as VARCHAR(MAX)) as SiteContactPhone,
                j.JobMapLocation as MapLocation,
                CAST(j.JobComments as VARCHAR(MAX)) as Comments,
                jt.JobTypeText as JobType,
                pt.PumpTypeName as PumpTypeRequired,
                STRING_AGG(ptype.PourTypeName, ', ') as PourTypes
            FROM CDS_Job j
                LEFT JOIN CDS_Unit u ON j.JobUnitID = u.UnitID
                LEFT JOIN CDS_Driver d ON j.JobDriverID = d.DriverID
                LEFT JOIN CDS_Customer c ON j.JobCustomerID = c.CustomerID
                LEFT JOIN CDS_Supplier s ON j.JobSupplierID = s.SupplierID
                LEFT JOIN CDS_JobType jt ON j.JobTypeID = jt.JobTypeID
                LEFT JOIN CDS_PumpType pt ON j.JobPumpTypeID = pt.PumpTypeID
                LEFT JOIN CDS_JobPourType jpt ON j.JobID = jpt.JobID
                LEFT JOIN CDS_PourType ptype ON jpt.PourTypeID = ptype.PourTypeID
                WHERE j.JobID = @jobId
            GROUP BY                  
                u.UnitNumber,                 
                d.DriverFirstName, d.DriverLastName,                 
                j.JobCompanyJobNum,                 
                c.CustomerCompanyName,                 
                j.JobStartDate,                 
                j.JobStartTime,                 
                j.JobPourTime,                 
                s.SupplierCompanyName,                 
                j.JobCustomerPO,                 
                j.JobCustomerJobNum,     
                CAST(j.JobSiteAddress as VARCHAR(MAX)),                      
                j.JobSiteArea,                      
                CAST(j.JobSitePhone as VARCHAR(MAX)),                 
                j.JobMapLocation,                 
                CAST(j.JobComments as VARCHAR(MAX)),                 
                jt.JobTypeText,                 
                pt.PumpTypeName
        `;

		const request = new sql.Request();
		request.input("jobId", sql.Int, jobId);
		const result = await request.query(query);

		if (result.recordset.length === 0) {
			return res.status(404).json({ error: "Job not found" });
		}

		res.json(result.recordset[0]);
	} catch (error) {
		console.error("Error fetching job details:", error);
		res.status(500).json({ error: "Failed to fetch job details" });
	}
});

router.get("/amount-pumped-by-pump-and-date", async (req, res) => {
	try {
		const startDate = req.query.startDate;
		const endDate = req.query.endDate;

		if (!startDate || !endDate) {
			return res
				.status(400)
				.json({ error: "Start date and end date are required" });
		}

		const request = new sql.Request();
		request.input("startDate", sql.Date, startDate);
		request.input("endDate", sql.Date, endDate);

		const result = await request.query(`
            SELECT 
                u.UnitNumber as Unit,
                FORMAT(COALESCE(SUM(j.JobTotalPoured), 0), 'N2') as TotalPumped
            FROM CDS_Unit u
            LEFT JOIN CDS_Job j ON u.UnitID = j.JobUnitID
            WHERE j.JobStartDate BETWEEN @startDate AND @endDate
            GROUP BY u.UnitNumber
            ORDER BY u.UnitNumber
        `);

		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching amount pumped data:", error);
		res.status(500).json({
			error: "An error occurred while fetching the amount pumped data",
			details: error.message,
		});
	}
});

router.get("/amount-pumped-by-job-type", async (req, res) => {
	try {
		const startDate = req.query.startDate;
		const endDate = req.query.endDate;

		if (!startDate || !endDate) {
			return res
				.status(400)
				.json({ error: "Start date and end date are required" });
		}

		const request = new sql.Request();
		request.input("startDate", sql.Date, startDate);
		request.input("endDate", sql.Date, endDate);

		const query = `
           WITH JobStats AS (
               SELECT 
                   jt.JobTypeText,
                   c.CustomerCompanyName,
                   ISNULL(pt.PumpTypeName, '?') as PumpType,
                   j.JobTotalPoured,
                   j.JobTotalHours,
                   j.JobHourlyRate,
                   ISNULL(j.JobFlatRate, 0) as JobFlatRate,
                   ROW_NUMBER() OVER (PARTITION BY jt.JobTypeText ORDER BY c.CustomerCompanyName) as RowNum
               FROM CDS_Job j
               INNER JOIN CDS_JobType jt ON j.JobTypeID = jt.JobTypeID
               INNER JOIN CDS_Customer c ON j.JobCustomerID = c.CustomerID
               LEFT JOIN CDS_PumpType pt ON j.JobPumpTypeID = pt.PumpTypeID
               WHERE j.JobStartDate BETWEEN @startDate AND @endDate
           ),
           MainData AS (
               SELECT 
                   CASE WHEN RowNum = 1 THEN JobTypeText ELSE '' END as JobType,
                   CustomerCompanyName as Customer,
                   PumpType as [PumpType],
                   FORMAT(JobTotalPoured, 'N2') as Meters,
                   FORMAT(JobTotalHours, 'N2') as Hours, 
                   FORMAT(JobHourlyRate, 'C2') as [HourlyRate],
                   FORMAT(JobFlatRate, 'C2') as [FlatRate],
                   1 as SortOrder,
                   JobTypeText as SortJobType
               FROM JobStats

               UNION ALL

               SELECT 
                   'Job Type Count: ' + JobTypeText, 
                   CAST(COUNT(*) as varchar),
                   '',
                   FORMAT(SUM(JobTotalPoured), 'N2'),
                   FORMAT(SUM(JobTotalHours), 'N2'),
                   FORMAT(AVG(JobHourlyRate), 'C2'),
                   FORMAT(AVG(JobFlatRate), 'C2'),
                   2,
                   JobTypeText
               FROM JobStats
               GROUP BY JobTypeText

               UNION ALL

               SELECT
                   'Grand Total Count:',
                   CAST(COUNT(DISTINCT JobTypeText) as varchar),
                   '',
                   FORMAT(SUM(JobTotalPoured), 'N2'),
                   FORMAT(SUM(JobTotalHours), 'N2'),
                   FORMAT(AVG(JobHourlyRate), 'C2'), 
                   FORMAT(AVG(JobFlatRate), 'C2'),
                   3,
                   ''
               FROM JobStats
           )
           SELECT 
               JobType,
               Customer,
               [PumpType],
               Meters,
               Hours,
               [HourlyRate],
               [FlatRate]
           FROM MainData
           ORDER BY SortOrder, SortJobType, Customer;
       `;

		const result = await request.query(query);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching job type data:", error);
		res.status(500).json({ error: "Failed to fetch job type data" });
	}
});

module.exports = router;
