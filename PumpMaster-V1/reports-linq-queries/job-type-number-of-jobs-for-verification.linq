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
    jt.JobTypeText as 'Job Type',
    COUNT(*) as 'Number of Jobs'
FROM CDS_Job j
INNER JOIN CDS_JobType jt ON j.JobTypeID = jt.JobTypeID
WHERE j.JobStartDate >= CONVERT(datetime, '01-Sep-2024', 103)  
AND j.JobStartDate <= CONVERT(datetime, '30-Sep-2024', 103)
GROUP BY jt.JobTypeText
ORDER BY COUNT(*) DESC;