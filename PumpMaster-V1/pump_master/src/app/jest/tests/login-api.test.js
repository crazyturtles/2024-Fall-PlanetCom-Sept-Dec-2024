import request from "supertest";
import express from "express";
import loginRouter from "../../../../../../express/routers/LoginDAL";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sql from "mssql/msnodesqlv8";
import cookieParser from "cookie-parser";

global.setImmediate = (fn) => setTimeout(fn, 0);

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("mssql/msnodesqlv8", () => ({
	connect: jest.fn().mockResolvedValue({}),
	Request: jest.fn(),
	query: jest.fn(),
	VarChar: jest.fn(),
	Int: jest.fn(),
	DateTime: jest.fn(),
	Bit: jest.fn(),
}));

describe("Login API", () => {
	let app;
	let mockRequest;

	beforeEach(async () => {
		mockRequest = { input: jest.fn().mockReturnThis(), query: jest.fn() };
		sql.Request.mockReturnValue(mockRequest);

		app = express();
		app.use(cookieParser());
		app.use(express.json());
		app.use("/auth", loginRouter);

		process.env.JWT_SECRET = "test-secret";
		bcrypt.compare.mockResolvedValue(true);
		bcrypt.hash.mockResolvedValue("hashedpass");
		jwt.sign.mockReturnValue("mock-token");
		jwt.verify.mockReturnValue({ username: "testuser" });

		await sql.connect();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("successfully logs in user", async () => {
		mockRequest.query
			.mockResolvedValueOnce({ recordset: [{ FailedAttempts: 0 }] })
			.mockResolvedValueOnce({
				recordset: [
					{
						username: "testuser",
						hashedPassword: "hashedpass",
						RoleDescription: "admin",
						PermissionLevel: 1,
						UserID: 1,
					},
				],
			})
			.mockResolvedValueOnce({ rowsAffected: [1] });

		const response = await request(app)
			.post("/auth/login")
			.send({ username: "testuser", password: "pass" });

		expect(response.status).toBe(200);
	});

	test("returns 401 for invalid credentials", async () => {
		mockRequest.query
			.mockResolvedValueOnce({ recordset: [{ FailedAttempts: 0 }] })
			.mockResolvedValueOnce({ recordset: [] });

		const response = await request(app)
			.post("/auth/login")
			.send({ username: "wrong", password: "wrong" });

		expect(response.status).toBe(401);
	});

	test("returns 429 after too many failed attempts", async () => {
		mockRequest.query.mockResolvedValue({ recordset: [{ FailedAttempts: 5 }] });

		const response = await request(app)
			.post("/auth/login")
			.send({ username: "testuser", password: "pass" });

		expect(response.status).toBe(429);
	});

	test("returns 400 if credentials missing", async () => {
		const response = await request(app).post("/auth/login").send({});
		expect(response.status).toBe(400);
	});

	test("returns permission level for valid token", async () => {
		mockRequest.query.mockResolvedValue({
			recordset: [{ PermissionLevel: 1 }],
		});

		const response = await request(app)
			.get("/auth/permission")
			.set("Cookie", ["authToken=mock-token"]);

		expect(response.status).toBe(200);
	});

	test("successfully creates new user", async () => {
		mockRequest.query
			.mockResolvedValueOnce({ recordset: [] })
			.mockResolvedValueOnce({ rowsAffected: [1] });

		const response = await request(app).post("/auth/create-user").send({
			username: "newuser",
			password: "pass123",
			roleTypeId: 1,
		});

		expect(response.status).toBe(201);
	});
});
