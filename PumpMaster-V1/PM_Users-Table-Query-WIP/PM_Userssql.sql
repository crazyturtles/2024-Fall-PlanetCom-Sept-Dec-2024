Use PumpMasterDB
 
 drop table PM_Users
 drop table PM_Roles

CREATE TABLE SessionTokens (
    TokenId INT PRIMARY KEY IDENTITY(1,1), -- Use IDENTITY for auto-increment in SQL Server
    Token NVARCHAR(MAX),
    UserId INT,
    ExpirationTime DATETIME,
    IsValid BIT DEFAULT 1
);

-- Creating PM_Roles table
CREATE TABLE PM_Roles (
    RoleTypeID INT PRIMARY KEY IDENTITY(1,1), -- Use IDENTITY for auto-increment
    RoleDescription VARCHAR(255) NOT NULL,
    PermissionLevel INT NOT NULL,
    Exclusions NVARCHAR(MAX) -- Use NVARCHAR(MAX) for text fields in SQL Server
);

-- Creating PM_Users table
CREATE TABLE PM_Users (
    UserID INT PRIMARY KEY IDENTITY(1,1), -- Use IDENTITY for auto-increment
    username VARCHAR(255) NOT NULL UNIQUE,
    hashedPassword VARCHAR(255) NOT NULL,
    RoleTypeID INT NOT NULL,
    EmployeeID INT,
	FirstName Varchar(30),
	LastName Varchar(30),
    FOREIGN KEY (RoleTypeID) REFERENCES PM_Roles(RoleTypeID)
);

CREATE TABLE FailedLogins (
  ID INT PRIMARY KEY IDENTITY(1,1),
  Username NVARCHAR(255),
  IPAddress NVARCHAR(45),
  AttemptTime DATETIME,
  Success BIT
);


INSERT INTO PM_Roles (RoleDescription, PermissionLevel, Exclusions)
VALUES ('Admin', 4, NULL);
DECLARE @AdminRoleTypeID INT;

-- Get the RoleTypeID for the Admin role
SELECT @AdminRoleTypeID = RoleTypeID
FROM PM_Roles
WHERE RoleDescription = 'Admin';

-- Insert into PM_Users
INSERT INTO PM_Users (username, hashedPassword, RoleTypeID, EmployeeID)
VALUES ('admin','$2y$10$v1QD9g5uqk7vY/qaxub1suXUvpUL3JdZt3RMTAoKI1N.xvyAtCe0S', @AdminRoleTypeID, NULL);

INSERT INTO PM_Roles (RoleDescription, PermissionLevel)
VALUES ('Technician', 1), ('Operator', 1),('Dispatch',3),('Accounting',1)

select * from PM_Roles
select * from PM_Users
select * from SessionTokens;