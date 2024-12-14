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
	c.CustomerID,
	c.CustomerCompanyName,
	COUNT(j.JobID) as jobCount
FROM CDS_Customer c
LEFT JOIN CDS_Job j ON c.CustomerID = j.JobCustomerID
WHERE c.CustomerID = 42
GROUP BY c.CustomerID, c.CustomerCompanyName