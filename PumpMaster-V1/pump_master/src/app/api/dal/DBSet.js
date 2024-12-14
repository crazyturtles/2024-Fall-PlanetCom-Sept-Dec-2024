export class DBSet extends Array {
	constructor(tableNamne) {
		super();
		this.tableNamne = tableNamne;
	}

	async selectOne(entity) {
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
	}

	// async select

	// where = async (callBackFunction) => {
	//     callBackFunction()
	//     const sqlQuery = "";

	// }

	addOrUpdate(entity) {
		this.push(entity);
		return entity;
	}

	delete(entity) {
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
	}
}
