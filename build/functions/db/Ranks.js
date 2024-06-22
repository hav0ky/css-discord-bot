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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("../../lib/mysql"));
const Ranks = {
    getAll: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysql_1.default.query(`SELECT * FROM \`in_ranks\` ORDER BY \`value\` DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`);
            return rows;
        }
        catch (err) {
            console.log(`[DB] Error while getting all ranks: ${err}`);
            return [];
        }
    }),
    getById: (rankId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysql_1.default.query('SELECT * FROM `in_ranks` WHERE id = ?', [rankId]);
            if (!rows.length || rows.length < 1)
                return null;
            return rows[0];
        }
        catch (err) {
            console.log(`[DB] Error while getting all mutes: ${err}`);
            return null;
        }
    }),
    recent_player_count: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const [rows] = yield mysql_1.default.query('SELECT COUNT(*) FROM `in_ranks` WHERE `lastconnect` >= UNIX_TIMESTAMP() - (24 * 60 * 60);');
            return (_a = rows === null || rows === void 0 ? void 0 : rows[0]) === null || _a === void 0 ? void 0 : _a['COUNT(*)'];
        }
        catch (err) {
            console.log(`[DB] Error while getting recent players: ${err}`);
            return 0;
        }
    }),
    // create: async (props: Partial<SA_Rank>): Promise<number | null> => {
    //     try {
    //         const keys = Object.keys(props)
    //         const values = Object.values(props)
    //         const [rows] = await db.query<ResultSetHeader>(
    //             `INSERT INTO \`sa_mutes\` (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
    //             values
    //         )
    //         return rows.insertId
    //     } catch (err) {
    //         console.log(`[DB] Error while creating mutes: ${err}`)
    //         return null
    //     }
    // },
    update: (id, props) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keys = Object.keys(props);
            const [rows] = yield mysql_1.default.query(`UPDATE \`in_ranks\` SET ${keys.map((f) => `${f} = ?`).join(', ')} WHERE steam = ?`, [...Object.values(props), id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            console.log(`[DB] Error while updating mutes: ${err}`);
            return false;
        }
    }),
    delete: (rankId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysql_1.default.query('DELETE FROM `in_ranks` WHERE steam = ?', [rankId]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            console.log(`[DB] Error while deleting mute: ${err}`);
            return false;
        }
    }),
    count: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const [rows] = yield mysql_1.default.query('SELECT COUNT(*) FROM `in_ranks`');
            return (_a = rows === null || rows === void 0 ? void 0 : rows[0]) === null || _a === void 0 ? void 0 : _a['COUNT(*)'];
        }
        catch (err) {
            console.log(`[DB] Error while counting mutes: ${err}`);
            return 0;
        }
    }),
};
exports.default = Ranks;
