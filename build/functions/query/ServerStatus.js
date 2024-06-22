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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const valve_server_query_1 = require("@fabricio-191/valve-server-query");
const PlayersStatus_1 = __importDefault(require("./PlayersStatus"));
/**
 * Get server info **using the source-query package**
 * @param ip Server IP
 * @param port Server port
 * @returns ServerInfo
 * @returns null if the server is offline or the query fails
 */
const GetServerInfo = (ip, port, rcon) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = yield (0, valve_server_query_1.Server)({
            ip,
            port,
            timeout: 2000,
        });
        const info = yield server.getInfo();
        server.disconnect();
        const { name, map, game, players, VAC, version } = info;
        const serverPlayers = rcon ? yield (0, PlayersStatus_1.default)(ip, port, rcon) : null;
        const serverPlayersWithoutIP = serverPlayers
            ? serverPlayers === null || serverPlayers === void 0 ? void 0 : serverPlayers.map((player) => {
                const { ipAddress } = player, rest = __rest(player, ["ipAddress"]);
                return rest;
            })
            : null;
        return {
            name,
            map,
            players: players.online,
            serverPlayers: serverPlayersWithoutIP,
            maxPlayers: players.max,
            VAC,
            version,
            game,
        };
    }
    catch (e) {
        return null;
    }
});
exports.default = GetServerInfo;
