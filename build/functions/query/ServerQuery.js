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
// import { From64ToUser } from 'steam-api-sdk'
const PluginStatus_1 = __importDefault(require("./PluginStatus"));
const db_1 = __importDefault(require("../db"));
const ServerStatus_1 = __importDefault(require("./ServerStatus"));
const GetSteamUsers_1 = __importDefault(require("../GetSteamUsers"));
/**
 * * The main function to query a server, includes the chat logs and the players
 * * The function will check if the server has a rcon password (= if the server uses our plugin, the plugin will reload the password in the db)
 * * if it does, it will use the plugin to get the players and the server info
 * * if it doesn't, it will send a regular query to the server with source-query.
 *
 * @param serverId The server id
 * @param advanced Return advanced server info? (admins, chat messages, logs, etc.)
 */
const ServerQuery = (serverId, advanced) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const dbServer = yield db_1.default.servers.getById(serverId);
    if (!dbServer)
        throw new Error('Server not found');
    const { hostname, address, rcon } = dbServer;
    const [ip, port] = address.split(':');
    // If the server has a rcon password, use our plugin to get the players and the server info
    if (rcon) {
        const { server, players } = (yield (0, PluginStatus_1.default)(ip, Number(port), rcon)) || {};
        if (!server || !players)
            throw new Error('Server not found');
        const steamPlayers = yield (0, GetSteamUsers_1.default)(players.map((p) => p.s64));
        const newPlayers = yield Promise.all(players.map((player) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, s64, s, k, d, t } = player;
            const steam = steamPlayers.find((p) => p.steamid === s64);
            return {
                id,
                playerName: steam === null || steam === void 0 ? void 0 : steam.personaname,
                avatar: steam ? steam.avatar : '',
                s64,
                k,
                d,
                s,
                t
            };
        })));
        const info = {
            id: serverId,
            hostname,
            address,
            map: server.map,
            players: newPlayers,
            maxPlayers: server.mP,
            playersPercentage: Math.round((players.length / server.mP) * 100),
            vac: null,
            game: 'Counter-Strike 2'
        };
        return info;
    }
    else {
        const info = yield (0, ServerStatus_1.default)(ip, Number(port), rcon);
        if (!info)
            throw new Error('Server not found');
        const steamPlayers = yield (0, GetSteamUsers_1.default)(((_a = info.serverPlayers) === null || _a === void 0 ? void 0 : _a.map((player) => player.steamId64)) || []);
        const players = info.serverPlayers
            ? yield Promise.all((_b = info.serverPlayers) === null || _b === void 0 ? void 0 : _b.map((player) => __awaiter(void 0, void 0, void 0, function* () {
                const { id, name, steamId64 } = player;
                const steam = steamPlayers.find((p) => p.steamid === steamId64);
                return {
                    userId: id,
                    steam64: steamId64,
                    playerName: steam ? steam.personaname : name,
                    avatar: steam ? steam.avatar : '',
                    ping: 0,
                };
            })))
            : info.players;
        const results = {
            id: serverId,
            hostname,
            address,
            playersPercentage: Math.round((info.players / info.maxPlayers) * 100),
            map: info.map,
            players: players,
            maxPlayers: info.maxPlayers,
            vac: info.VAC,
            game: info.game
        };
        return results;
    }
});
exports.default = ServerQuery;
