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
const axios_1 = __importDefault(require("axios"));
const from64tosteamid_1 = __importDefault(require("./from64tosteamid"));
/**
 * Converts a Steam64 ID to a User Object
 * @param steam64 The user Steam64 ID, Example: 76561198000000000 OR Array of Steam64 IDs
 * @param delay The delay between each request (default: 100ms)
 * @returns User Object or null if not found
 */
function From64ToUser(steam64_1) {
    return __awaiter(this, arguments, void 0, function* (steam64, delay = 100) {
        if (!steam64)
            throw new Error('Invalid Steam64 ID');
        const fetchUsers = (ids) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield SteamFetch(ids);
                if (!data.length)
                    throw new Error('Invalid Steam64 ID');
                const users = data
                    .map((p) => (Object.assign(Object.assign({}, p), { steamIds: (0, from64tosteamid_1.default)(p.steamid) })))
                    .filter((u) => !!u);
                return users;
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
        const fetchUsersBatch = (users) => __awaiter(this, void 0, void 0, function* () {
            const allUsers = [];
            const batchSize = 100;
            // Function to fetch a single batch
            function fetchBatch(startIndex) {
                return __awaiter(this, void 0, void 0, function* () {
                    const endIndex = Math.min(startIndex + batchSize, users.length);
                    const userBatch = users.slice(startIndex, endIndex);
                    const fetchedUsers = yield fetchUsers(userBatch);
                    allUsers.push(...fetchedUsers);
                });
            }
            // Loop through the users array in increments of batchSize
            for (let i = 0; i < users.length; i += batchSize) {
                yield fetchBatch(i);
                if (delay)
                    yield new Promise((r) => setTimeout(r, delay));
            }
            return allUsers;
        });
        if (Array.isArray(steam64)) {
            if (steam64.length > 100) {
                return yield fetchUsersBatch(steam64);
            }
            else {
                return yield fetchUsers(steam64);
            }
        }
        else {
            const users = yield fetchUsers([steam64]);
            if (!users.length)
                throw new Error('Could not find user');
            return users[0];
        }
    });
}
/**
 * Steam Fetch function to fetch data from the Steam API using Axios
 * @update 2022-07-11: Added support for multiple API keys and random API key selection
 * @param users string or array of strings of Steam64 IDs
 * @returns fetch response
 */
const SteamFetch = (users) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&format=json&steamids=${Array.isArray(users) ? users.join(',') : users}`;
    try {
        const { data } = yield axios_1.default.get(url);
        return data.response.players;
    }
    catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
});
exports.default = From64ToUser;
