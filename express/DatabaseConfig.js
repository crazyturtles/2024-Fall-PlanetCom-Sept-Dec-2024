// module.exports = {
// 	SERVER_NAME: "CRAZYTURTLES//ROHAN",
// 	DATABASE_NAME: "PumpMasterDB",
// 	EXPRESS_PORT: 3001,
// 	NODE_PORT: 3000,
// };

require("dotenv").config();

module.exports = {
	SERVER_NAME: process.env.SERVER_NAME,
	DATABASE_NAME: process.env.DATABASE_NAME || "PumpMasterDB",
	EXPRESS_PORT: process.env.EXPRESS_PORT || 3001,
	NODE_PORT: process.env.NODE_PORT || 3000,
};
