<Query Kind="SQL">
  <Connection>
    <ID>0d149c16-c1e2-4c36-8320-2fa92e497a4b</ID>
    <NamingServiceVersion>2</NamingServiceVersion>
    <Persist>true</Persist>
    <Server>crazyturtles</Server>
    <AllowDateOnlyTimeOnly>true</AllowDateOnlyTimeOnly>
    <DeferDatabasePopulation>true</DeferDatabasePopulation>
    <Database>PumpMasterDB</Database>
    <DriverData>
      <LegacyMFA>false</LegacyMFA>
    </DriverData>
  </Connection>
</Query>

DECLARE @JobTypeID int
DECLARE @JobTypeText varchar(50)

DECLARE job_type_cursor CURSOR FOR 
    SELECT 
        jt.JobTypeID,
        jt.JobTypeText
    FROM CDS_Job j
    INNER JOIN CDS_JobType jt ON j.JobTypeID = jt.JobTypeID
    WHERE j.JobStartDate >= CONVERT(datetime, '01-Sep-2024', 103)  
    AND j.JobStartDate <= CONVERT(datetime, '30-Sep-2024', 103)
    GROUP BY jt.JobTypeID, jt.JobTypeText
    ORDER BY COUNT(*) DESC;

OPEN job_type_cursor

FETCH NEXT FROM job_type_cursor INTO @JobTypeID, @JobTypeText

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Main detail rows
    SELECT 
        CASE 
            WHEN ROW_NUMBER() OVER(ORDER BY c.CustomerCompanyName) = 1 
            THEN @JobTypeText 
            ELSE ''
        END as [Job Type],
        c.CustomerCompanyName as [Customer],
        ISNULL(pt.PumpTypeName, '') as [Pump Type],
        CAST(j.JobTotalPoured as decimal(10,2)) as [Meters],
        CAST(j.JobTotalHours as decimal(10,2)) as [Hours],
        CAST(ISNULL(j.JobHourlyRate, 0) as decimal(10,2)) as [Hourly Rate],
        CAST(ISNULL(j.JobFlatRate, 0) as decimal(10,2)) as [Flat Rate]
    FROM CDS_Job j
    INNER JOIN CDS_JobType jt ON j.JobTypeID = jt.JobTypeID
    INNER JOIN CDS_Customer c ON j.JobCustomerID = c.CustomerID
    LEFT JOIN CDS_Unit u ON j.JobUnitID = u.UnitID
    LEFT JOIN CDS_PumpType pt ON u.UnitPumpTypeID = pt.PumpTypeID
    WHERE j.JobStartDate >= CONVERT(datetime, '01-Sep-2024', 103)  
    AND j.JobStartDate <= CONVERT(datetime, '30-Sep-2024', 103)
    AND j.JobTypeID = @JobTypeID;

    SELECT 
        COUNT(*) as [Job Type Count],
        CAST(SUM(JobTotalPoured) as decimal(10,2)) as [Total Meters],
        CAST(SUM(JobTotalHours) as decimal(10,2)) as [Total Hours],
        CAST(SUM(JobHourlyRate * JobTotalHours) / NULLIF(SUM(JobTotalHours), 0) as decimal(10,2)) as [Avg Hourly Rate],
        CAST(SUM(JobFlatRate) / NULLIF(COUNT(*), 0) as decimal(10,2)) as [Avg Flat Rate]
    FROM CDS_Job
    WHERE JobStartDate >= CONVERT(datetime, '01-Sep-2024', 103)  
    AND JobStartDate <= CONVERT(datetime, '30-Sep-2024', 103)
    AND JobTypeID = @JobTypeID;

    FETCH NEXT FROM job_type_cursor INTO @JobTypeID, @JobTypeText
END

CLOSE job_type_cursor
DEALLOCATE job_type_cursor