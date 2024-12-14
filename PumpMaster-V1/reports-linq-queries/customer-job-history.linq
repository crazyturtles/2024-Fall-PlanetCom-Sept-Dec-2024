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
        WHEN 0 THEN 'New'
        WHEN 10 THEN 'Pending'
        WHEN 20 THEN 'Confirmed'
        WHEN 40 THEN 'In Progress'
        WHEN 70 THEN 'Completed'
        WHEN 90 THEN 'Ready to Invoice'
        WHEN 100 THEN 'Invoiced'
        ELSE 'Unknown'
    END as 'Status'
FROM CDS_Job j
LEFT JOIN CDS_Unit u ON j.JobUnitID = u.UnitID
LEFT JOIN CDS_Driver d ON j.JobDriverID = d.DriverID
LEFT JOIN CDS_Supplier s ON j.JobSupplierID = s.SupplierID
LEFT JOIN CDS_JobPourType jpt ON j.JobID = jpt.JobID
LEFT JOIN CDS_PourType pt ON jpt.PourTypeID = pt.PourTypeID
WHERE j.JobCustomerID = 42
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
ORDER BY j.JobStartDate DESC;