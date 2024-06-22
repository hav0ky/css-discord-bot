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
const Servers = {
    getAll: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysql_1.default.query('SELECT * FROM `sa_servers`');
            return rows;
        }
        catch (err) {
            console.log(`[DB] Error while getting all servers: ${err}`);
            return [];
        }
    }),
    getAllSafe: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysql_1.default.query('SELECT id, hostname, address FROM `sa_servers`');
            return rows;
        }
        catch (err) {
            console.log(`[DB] Error while getting all servers: ${err}`);
            return [];
        }
    }),
    getById: (serverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysql_1.default.query('SELECT * FROM `sa_servers` WHERE id = ?', [serverId]);
            if (!rows.length || rows.length < 1)
                return null;
            return rows[0];
        }
        catch (err) {
            console.log(`[DB] Error while getting all servers: ${err}`);
            return null;
        }
    }),
    update: (id, props) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keys = Object.keys(props);
            const values = Object.values(props);
            const [rows] = yield mysql_1.default.query(`UPDATE \`sa_servers\` SET ${keys.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`, [...values, id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            console.log(`[DB] Error while updating server: ${err}`);
            throw err;
        }
    }),
    delete: (serverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysql_1.default.query('DELETE FROM `sa_servers` WHERE id = ?', [serverId]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            console.log(`[DB] Error while deleting server: ${err}`);
            throw err;
        }
    }),
    count: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const [rows] = yield mysql_1.default.query('SELECT COUNT(*) FROM `sa_servers`');
            return (_a = rows === null || rows === void 0 ? void 0 : rows[0]) === null || _a === void 0 ? void 0 : _a['COUNT(*)'];
        }
        catch (err) {
            console.log(`[DB] Error while counting admins: ${err}`);
            return 0;
        }
    }),
};
exports.default = Servers;
