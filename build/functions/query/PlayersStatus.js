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
const valve_server_query_1 = require("@fabricio-191/valve-server-query");
/**
 * Get the server players **using RCON** and pull the players list
 * - Using the SimpleAdmin RCON command (css_players)
 */
const PlayerStatus = (ip, port, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = yield (0, valve_server_query_1.RCON)({
            ip,
            port,
            password,
        });
        server.authenticate();
        const playersString = yield server.exec('css_players');
        // Split the string into lines
        const lines = playersString.split('\n');
        // Define the regular expression to match player details
        const playerRegex = /\[#(\d+)\] "(.*?)" \(IP Address: "(.*?)" SteamID64: "(.*?)"\)/;
        // Initialize an empty array to hold the player objects
        const players = [];
        // Iterate over each line
        for (const line of lines) {
            // If the line matches the player details regex
            const match = line.match(playerRegex);
            if (match) {
                // Extract the player details
                const [, id, name, ipAddress, steamId64] = match;
                // If the player has a SteamID, add them to the array
                if (steamId64) {
                    players.push({
                        id: parseInt(id),
                        name,
                        ipAddress,
                        steamId64,
                    });
                }
            }
        }
        server.destroy();
        // Filter out empty names (bots)
        return players;
    }
    catch (e) {
        console.log(`Error getting RCON status: ${ip}:${port}`, e);
        return null;
    }
});
exports.default = PlayerStatus;
