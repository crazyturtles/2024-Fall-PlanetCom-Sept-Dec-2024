const express = require("express");
const sql = require("mssql/msnodesqlv8");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config("../.env");

const SQLConfig = {
	server: process.env.SERVER_NAME,
	database: process.env.DATABASE_NAME,
	options: {
		trustedConnection: true,
		enableArithAbort: true,
		trustServerCertificate: true,
	},
	driver: "msnodesqlv8",
};

const loginRouter = express.Router();
module.exports.SQLConfig = SQLConfig;

const verifyToken = (req, res, next) => {
	const token =
		req.cookies.authToken ||
		req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(400).json({ message: "Invalid or expired token." });
	}
};

loginRouter.get("/permission", verifyToken, async (req, res) => {
	try {
		const { username } = req.user;
		await sql.connect(SQLConfig);

		const query = `
      SELECT r.PermissionLevel
      FROM PM_Users u
      JOIN PM_Roles r ON u.RoleTypeID = r.RoleTypeID
      WHERE u.Username = @username
    `;
		const request = new sql.Request();
		request.input("username", sql.VarChar, username);
		const result = await request.query(query);

		if (result.recordset.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		const { PermissionLevel } = result.recordset[0];
		res.status(200).json({ permissionLevel: PermissionLevel });
	} catch (err) {
		console.error("Error fetching permission level:", err.message);
		res.status(500).json({ message: "Error fetching permission level" });
	}
});

loginRouter.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const clientIP = req.ip;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required." });
	}

	try {
		await sql.connect(SQLConfig);

		// Check for failed attempts
		const checkAttemptsQuery = `
      SELECT COUNT(*) AS FailedAttempts
      FROM FailedLogins
      WHERE Username = @username AND IPAddress = @ipAddress
        AND Success = 0 AND AttemptTime > DATEADD(MINUTE, -15, GETDATE())
    `;
		const checkRequest = new sql.Request();
		checkRequest.input("username", sql.VarChar, username);
		checkRequest.input("ipAddress", sql.VarChar, clientIP);
		const checkResult = await checkRequest.query(checkAttemptsQuery);

		if (checkResult.recordset[0].FailedAttempts >= 5) {
			return res.status(429).json({
				message: "Too many failed attempts. Please try again in 15 minutes.",
			});
		}

		// Attempt login
		const query = `
      SELECT u.*, r.RoleDescription, r.PermissionLevel
      FROM PM_Users u
      JOIN PM_Roles r ON u.RoleTypeID = r.RoleTypeID
      WHERE u.username = @username
    `;
		const request = new sql.Request();
		request.input("username", sql.VarChar, username);
		const result = await request.query(query);

		if (result.recordset.length === 0) {
			await logFailedAttempt(username, clientIP, false);
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const user = result.recordset[0];
		const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);

		if (!isPasswordMatch) {
			await logFailedAttempt(username, clientIP, false);
			return res.status(401).json({ message: "Invalid credentials" });
		}

		await logFailedAttempt(username, clientIP, true);

		const token = jwt.sign(
			{
				username: user.username,
				role: user.RoleDescription,
				permissionLevel: user.PermissionLevel,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" },
		);

		// Set CORS headers
		res.header("Access-Control-Allow-Origin", "http://localhost:3000");
		res.header("Access-Control-Allow-Credentials", "true");
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

		// Set cookie
		res.cookie("authToken", token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
			maxAge: 3600000 * 12, // 12 hours
		});

		// Store token in database
		const insertTokenQuery = `
      INSERT INTO SessionTokens (token, userid, expirationTime, isValid) 
      VALUES (@token, @userId, @expirationTime, 1)
    `;

		request.input("token", sql.VarChar, token);
		request.input("userId", sql.Int, user.UserID);
		const expirationTime = new Date(Date.now() + 3600000 * 12); //12 hours again?
		request.input("expirationTime", sql.DateTime, expirationTime);
		await request.query(insertTokenQuery);

		res.json({
			message: "Login successful",
			token,
			user: {
				username: user.username,
				role: user.RoleDescription,
				permissionLevel: user.PermissionLevel,
			},
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ message: "Server error: " + err.message });
	}
});

// Helper function to log login attempts
async function logFailedAttempt(username, ipAddress, success) {
	try {
		const logQuery = `
      INSERT INTO FailedLogins (Username, IPAddress, AttemptTime, Success)
      VALUES (@username, @ipAddress, GETDATE(), @success)
    `;
		const logRequest = new sql.Request();
		logRequest.input("username", sql.VarChar, username);
		logRequest.input("ipAddress", sql.VarChar, ipAddress);
		logRequest.input("success", sql.Bit, success);
		await logRequest.query(logQuery);
	} catch (err) {
		console.error("Error logging failed attempt:", err);
	}
}

/**
 * Route to handle logout
 */
loginRouter.post("/logout", async (req, res) => {
	console.log("Logout request received");
	const token = req.cookies.authToken;

	if (!token) {
		return res.status(400).json({ message: "No token provided." });
	}

	try {
		await sql.connect(SQLConfig);

		// Delete the token from the SessionTokens table
		await sql.query`
      DELETE FROM SessionTokens WHERE token = ${token}
    `;

		// Clear the cookie
		res.clearCookie("authToken", {
			httpOnly: true,
			secure: true, // Only true in production (HTTPS)
			sameSite: "strict", // For cross-origin requests (adjust as necessary)
			path: "/", // Make sure the cookie is available across all routes
		});

		res.status(200).json({ message: "Logged out successfully" });
	} catch (err) {
		console.error("Error during logout:", err.message);
		res.status(500).json({ message: "Server error: " + err.message });
	}
});

/**
 * Route to get all roles
 */
loginRouter.get("/roles", async (req, res) => {
	try {
		await sql.connect(SQLConfig);
		const result = await sql.query`
            SELECT RoleTypeID, RoleDescription 
            FROM PM_Roles 
            ORDER BY RoleDescription`;

		res.json(result.recordset);
	} catch (err) {
		console.error("Error fetching roles:", err);
		res.status(500).json({ message: "Error fetching roles" });
	}
});

/**
 * Route to create new user
 */
loginRouter.post("/create-user", async (req, res) => {
	const { username, firstName, lastName, roleTypeId, employeeId, password } =
		req.body;

	// Validation
	if (!username || !password || !roleTypeId) {
		return res
			.status(400)
			.json({ message: "Username, password, and role are required" });
	}

	try {
		await sql.connect(SQLConfig);

		// Check if username already exists
		const userCheck = await sql.query`
            SELECT username 
            FROM PM_Users 
            WHERE username = ${username}`;

		if (userCheck.recordset.length > 0) {
			return res.status(400).json({ message: "Username already exists" });
		}

		// Hash password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create new user
		const request = new sql.Request();
		request.input("username", sql.VarChar, username);
		request.input("hashedPassword", sql.VarChar, hashedPassword);
		request.input("roleTypeId", sql.Int, roleTypeId);
		request.input("employeeId", sql.Int, employeeId || null);
		request.input("firstName", sql.VarChar, firstName || null);
		request.input("lastName", sql.VarChar, lastName || null);

		const insertQuery = `
            INSERT INTO PM_Users (
                username, 
                hashedPassword, 
                RoleTypeID, 
                EmployeeID,
                FirstName,
                LastName
            )
            VALUES (
                @username,
                @hashedPassword,
                @roleTypeId,
                @employeeId,
                @firstName,
                @lastName
            )`;

		await request.query(insertQuery);

		res.status(201).json({ message: "User created successfully" });
	} catch (err) {
		console.error("Error creating user:", err);
		res.status(500).json({ message: "Error creating user: " + err.message });
	}
});

loginRouter.get("/validate-token", async (req, res) => {
	const token =
		req.cookies.authToken ||
		req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		// Verify the token signature and decode its payload
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Connect to the database
		await sql.connect(SQLConfig);

		// Check if the token exists in the SessionTokens table and is valid
		const request = new sql.Request();
		request.input("token", sql.VarChar, token);

		const query = `
		SELECT token, expirationTime, isValid 
		FROM SessionTokens 
		WHERE token = @token
	  `;
		const result = await request.query(query);

		if (result.recordset.length === 0) {
			return res.status(401).json({ message: "Invalid token." });
		}

		const sessionToken = result.recordset[0];

		// Check if the token is still valid
		if (!sessionToken.isValid) {
			return res.status(401).json({ message: "Token has been invalidated." });
		}

		// Check if the token has expired
		const now = new Date();
		const expirationTime = new Date(sessionToken.expirationTime);
		if (now > expirationTime) {
			return res.status(401).json({ message: "Token has expired." });
		}

		// Token is valid
		res.status(200).json({ message: "Token is valid.", user: decoded });
	} catch (err) {
		console.error("Token validation error:", err.message);
		res.status(400).json({ message: "Invalid or expired token." });
	}
});

/**
 * Route for protected resource
 */
loginRouter.get("/protected", verifyToken, (req, res) => {
	res.json({ message: "This is a protected route.", user: req.user });
});

loginRouter.get("/verify", verifyToken, (req, res) => {
	res.json({
		username: req.user.username,
		role: req.user.role,
		permissionLevel: req.user.permissionLevel,
	});
});

module.exports = loginRouter;
