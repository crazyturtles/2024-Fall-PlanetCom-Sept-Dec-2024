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
    COALESCE(sc.Title, 'Uncategorized') as Category,
    i.PartNumber as [Part #],
    i.Description as [Part Description],
    i.QuantityOnHand as Qty,
    i.PartCost as Cost
FROM CDS_Inventory i
LEFT JOIN CDS_ServiceCategory sc ON i.PartCategoryID = sc.ServiceCategoryID
ORDER BY 
    Category,
    i.PartNumber;