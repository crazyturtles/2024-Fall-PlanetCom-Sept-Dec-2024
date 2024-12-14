<Query Kind="SQL">
  <Connection>
    <ID>d5373ccd-5b0e-4de6-a149-78413dbd844a</ID>
    <NamingServiceVersion>2</NamingServiceVersion>
    <Persist>true</Persist>
    <Server>.\SQLExpress01</Server>
    <AllowDateOnlyTimeOnly>true</AllowDateOnlyTimeOnly>
    <DeferDatabasePopulation>true</DeferDatabasePopulation>
    <Database>PumpMasterDB</Database>
    <DriverData>
      <LegacyMFA>false</LegacyMFA>
    </DriverData>
  </Connection>
</Query>

DECLARE @StartDate DATE = '2024-10-01';  -- Start date for the range
DECLARE @EndDate DATE = '2024-12-01';    -- End date for the range

--common table expression
WITH MonthList AS (
    SELECT 
        DATEADD(MONTH, number, @StartDate) AS MonthDate
    FROM 
        master..spt_values
		--used to generate sequences of numbers
    WHERE 
        type = 'P' 
		--corresponds to number used for generating month dates
        AND DATEADD(MONTH, number, @StartDate) <= @EndDate
)
--helps to simplify complex queries 

SELECT 
    c.CustomerCompanyName,
    YEAR(m.MonthDate) AS JobYear,
    MONTH(m.MonthDate) AS JobMonth,
    SUM(CASE WHEN j.JobStatus = 10 THEN 1 ELSE 0 END) AS PendingJobCount,
    SUM(CASE WHEN j.JobStatus = 20 THEN 1 ELSE 0 END) AS ConfirmedJobCount,
    SUM(CASE WHEN j.JobStatus = 70 THEN 1 ELSE 0 END) AS CompletedJobCount
FROM 
    MonthList m
CROSS JOIN 
    CDS_Customer c  -- Ensure all customers are included for each month
LEFT JOIN 
    CDS_Job j ON c.CustomerID = j.JobCustomerID 
               AND YEAR(j.JobConfirmedDate) = YEAR(m.MonthDate)
               AND MONTH(j.JobConfirmedDate) = MONTH(m.MonthDate)
               AND j.JobConfirmedDate >= @StartDate
               AND j.JobStartDate <= @EndDate
GROUP BY 
    c.CustomerCompanyName,
    YEAR(m.MonthDate),
    MONTH(m.MonthDate)
ORDER BY 
    c.CustomerCompanyName,
    JobYear,
    JobMonth;
