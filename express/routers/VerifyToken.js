const express = require("express");
const { jwtVerify } = require("jose");
const sql = require("mssql/msnodesqlv8");
const router = express.Router();

// Assuming JWT_SECRET is your environment variable containing the secret key
const secret = process.env.JWT_SECRET;

// Verify the token with the added database check
router.post("/api/verify-token", async (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res.status(400).json({ message: "Token is required." });
	}

	try {
		// Connect to the database
		await sql.connect(SQLConfig);

		// Query to check if the token exists and is valid
		const result = await sql.query`
        SELECT * FROM SessionTokens WHERE token = ${token} AND IsValid = 1`;

		// Check if the token was found and is valid
		if (result.recordset.length === 0) {
			return res.status(401).json({ message: "Token not found or expired." });
		}

		// If the token is valid, return a success response
		res.status(200).json({ message: "Token is valid." });
	} catch (err) {
		console.error("Error verifying token:", err.message);
		res.status(500).json({ message: "Server error: " + err.message });
	}
});

// Logout route
router.post("/api/auth/logout", async (req, res) => {
	const token = req.cookies.authToken;

	if (!token) {
		return res.status(400).json({ message: "No token provided" });
	}

	// Remove token from SessionTokens table to invalidate session
	try {
		const request = new sql.Request();
		request.input("token", sql.NVarChar, token); // Correct way to pass parameters
		await request.query("DELETE FROM SessionTokens WHERE token = @token");
		res.clearCookie("authToken"); // Clear the cookie
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.error("Error during logout:", error.message);
		res.status(500).json({ message: "Error during logout" });
	}
});

module.exports = router;
