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

SELECT DISTINCT
    u.UnitNumber as Unit,
    ISNULL((
        SELECT SUM(CONVERT(decimal(18,2), JobTotalPoured))
        FROM CDS_Job j2
        WHERE j2.JobUnitID = u.UnitID
        AND j2.JobStatus = 100
        AND (
            (u.UnitPipeLastChanged IS NOT NULL AND j2.JobStartDate >= u.UnitPipeLastChanged)
            OR (u.UnitPipeLastChanged IS NULL)
        )
    ), 0) as Total_Poured,
    CASE 
        WHEN u.UnitPipeLastChanged IS NULL THEN 'null'
        ELSE FORMAT(u.UnitPipeLastChanged, 'dd-MMM-yyyy')
    END as Pipe_Changed,
    ISNULL((
        SELECT SUM(CONVERT(decimal(18,2), JobTotalPoured))
        FROM CDS_Job j2
        WHERE j2.JobUnitID = u.UnitID
        AND j2.JobStatus = 100
        AND (
            (u.DeckPipeLastChanged IS NOT NULL AND j2.JobStartDate >= u.DeckPipeLastChanged)
            OR (u.DeckPipeLastChanged IS NULL)
        )
    ), 0) as Deck_Total_Poured,
    CASE 
        WHEN u.DeckPipeLastChanged IS NULL THEN 'null'
        ELSE FORMAT(u.DeckPipeLastChanged, 'dd-MMM-yyyy')
    END as Deck_Pipe_Changed
FROM 
    CDS_Unit u
    LEFT JOIN CDS_Job j ON u.UnitID = j.JobUnitID
WHERE 
    u.UnitStatus = 1  -- Active units
GROUP BY 
    u.UnitID,
    u.UnitNumber,
    u.UnitPipeLastChanged,
    u.DeckPipeLastChanged
ORDER BY 
    u.UnitNumber;