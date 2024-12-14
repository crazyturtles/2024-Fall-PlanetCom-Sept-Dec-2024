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

DECLARE @StartDate datetime = CONVERT(datetime, '01-Sep-2024', 105)
DECLARE @EndDate datetime = CONVERT(datetime, '30-Sep-2024', 105)

SELECT 
    u.UnitNumber as Unit,
    COALESCE(SUM(COALESCE(j.JobTotalPoured, 0)), 0) as Total_Pumped
FROM 
    CDS_Unit u
    LEFT JOIN CDS_Job j ON u.UnitID = j.JobUnitID
        AND j.JobStartDate BETWEEN @StartDate AND @EndDate
WHERE 
    u.UnitStatus = 1
GROUP BY 
    u.UnitNumber
ORDER BY 
    u.UnitNumber;