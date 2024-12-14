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

SELECT
pt.PumpTypeName, pt.PumpTypeHourlyRate
FROM CDS_PumpType pt