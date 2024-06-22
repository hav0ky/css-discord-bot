"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const db = (0, promise_1.createPool)({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '3306'),
});
let isReady = false;
db.on('connection', (connection) => __awaiter(void 0, void 0, void 0, function* () {
    if (isReady)
        return;
    isReady = true;
    console.log(`[DB] Connected to database`);
    // try {
    // 	connection.query(
    // 		`CREATE TABLE IF NOT EXISTS \`${process.env.DB_DATABASE}\`.\`sa_admins_groups\` (\`id\` VARCHAR(50) NOT NULL, \`name\` TEXT NOT NULL , \`flags\` TEXT NOT NULL , \`immunity\` varchar(64) NOT NULL DEFAULT '0' ,\`created\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE = InnoDB;`
    // 	)
    // 	// connection.query(
    // 	// 	`ALTER TABLE \`${process.env.DB_DATABASE}\`.\`sa_mutes\` ADD COLUMN IF NOT EXISTS \`unmute_reason\` TEXT NULL DEFAULT NULL AFTER \`reason\`, ADD COLUMN IF NOT EXISTS \`comment\` TEXT NULL DEFAULT NULL AFTER \`unmute_reason\`;`
    // 	// )
    // 	// connection.query(
    // 	// 	`ALTER TABLE \`${process.env.DB_DATABASE}\`.\`sa_bans\` ADD COLUMN IF NOT EXISTS \`unban_reason\` TEXT NULL DEFAULT NULL AFTER \`reason\`, ADD COLUMN IF NOT EXISTS \`comment\` TEXT NULL DEFAULT NULL AFTER \`unban_reason\`;`
    // 	// )
    // 	// connection.query(
    // 	// 	`ALTER TABLE \`sa_mutes\` CHANGE \`type\` \`type\` ENUM('GAG','MUTE','SILENCE','') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'GAG';`
    // 	// )
    // } catch (err) {
    // 	console.log(`[DB] Error while creating tables: ${err}`)
    // }
}));
exports.default = db;
