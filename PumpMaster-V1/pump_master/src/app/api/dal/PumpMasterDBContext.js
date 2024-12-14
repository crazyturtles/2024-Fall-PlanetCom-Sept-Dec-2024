"use server";

const expressPort = require("../../../express/DatabaseConfig").EXPRESS_PORT;

module.exports = class PumpMasterDBContext {
	PumpMasterDBContext() {
		Array.prototype.select = async (entity) => {
			if (this.find(entity) !== undefined) {
				return this.find(entity);
			}
			try {
				return fetch(
					`http://localhost:${expressPort}/${entity.name}` +
						`${new URLSearchParams({
							sql: `select top(1) from ${entity.table} where ${entity.primaryKey} = ${entity.id}`,
						})}`,
					{ method: "GET" },
				).then((res) => {
					if (res.json().recordset.length == 0) {
						return null;
					}
					return res.json();
				});
			} catch (err) {
				(err) => console.error(err.message);
				return null;
			}
		};

		Array.prototype.where = async (callBackFunction) => {
			callBackFunction();
			const sqlQuery = "";
		};

		Array.prototype.addOrUpdate = function (entity) {
			this.push(entity);
			return entity;
		};
		Array.prototype.delete = function (entity) {
			const stagingEntityIndex = this.findIndex((element) => {
				element.id == entity.id;
			});
			if (stagingEntityIndex != -1) {
				this[stagingEntityIndex].deleteFlag = true;
				return this[stagingEntityIndex];
			}
			entity.deleteFlag = true;
			this.push(entity);
			return entity;
		};
		// Array.prototype.update = (entity) => {};

		this.companyInfo = [];
		this.parameters = [];
		this.suppliers = [];
	}

	async saveChanges() {
		//SQL logic, talks to the Express server.

		let sqlQuery = "begin tran";
		//Table Level
		for (const dbSet in Object.getOwnPropertyNames(PumpMasterDBContext).filter(
			(field) => field !== "length" && field !== "prototype",
		)) {
			if (dbSet.length > 0) {
				//Initiate INSERT statement
				sqlQuery = sqlQuery + `insert into ${dbSet[0].table} (`;

				//Column level.
				for (const column in dbSet[0].getColumns()) {
					sqlQuery = sqlQuery + ` ${column},`;
				}
				sqlQuery = sqlQuery + ")\nvalues\n";

				//Row level, add or update only
				for (const record in dbSet.filter((record) => !record.deleteFlag)) {
					sqlQuery = sqlQuery + "(";
					//Column level
					for (const value in record
						.getColumns()
						.map((column) => record[column])) {
						sqlQuery = sqlQuery + ` ${value}`;
					}
					sqlQuery = sqlQuery + "),\n";
				}
				sqlQuery = sqlQuery.slice(0, -2);
				sqlQuery = sqlQuery + ";";

				//Initiate DELETE statement
				sqlQuery =
					sqlQuery +
					`delete from ${dbSet[0].table} where ${dbSet[0].primaryKey} in (`;
				for (const record in dbSet.filter((record) => record.deleteFlag)) {
					sqlQuery = sqlQuery + `${dbSet[0].id}, `;
				}
				sqlQuery = sqlQuery + ");";
			}
		}
		sqlQuery = sqlQuery + "end tran";
		try {
			fetch(`http://localhost:${expressPort}/${entity.name}`, {
				method: "POST",
				body: {
					sql: sqlQuery,
				},
			});
		} catch (err) {
			console.error(err.message);
		}
	}

	async;
};
