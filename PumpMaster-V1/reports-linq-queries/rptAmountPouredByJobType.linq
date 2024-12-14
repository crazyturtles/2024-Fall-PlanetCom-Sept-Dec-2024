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
    WHERE j.JobStartDate BETWEEN '2024-09-01' AND '2024-09-30'
),
MainData AS (
    SELECT 
        CASE WHEN RowNum = 1 THEN JobTypeText ELSE '' END as JobType,
        CustomerCompanyName as Customer,
        PumpType as [Pump Type],
        FORMAT(JobTotalPoured, 'N2') as Meters,
        FORMAT(JobTotalHours, 'N2') as Hours, 
        FORMAT(JobHourlyRate, 'C2') as [Hourly Rate],
        FORMAT(JobFlatRate, 'C2') as [Flat Rate],
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
    [Pump Type],
    Meters,
    Hours,
    [Hourly Rate],
    [Flat Rate]
FROM MainData
ORDER BY SortOrder, SortJobType, Customer;