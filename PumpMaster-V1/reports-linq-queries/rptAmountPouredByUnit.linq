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

SELECT 
   u.UnitNumber as Unit,
   FORMAT(COALESCE(SUM(j.JobTotalPoured), 0), 'N2') as 'Total Pumped'
FROM CDS_Unit u
LEFT JOIN CDS_Job j ON u.UnitID = j.JobUnitID
WHERE j.JobStartDate BETWEEN '2024-10-01' AND '2024-10-31'
GROUP BY u.UnitNumber
ORDER BY u.UnitNumber