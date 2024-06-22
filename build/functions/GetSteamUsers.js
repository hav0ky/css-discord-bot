"use strict";
// import { From64ToUser } from 'steam-api-sdk'
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
const from64touser_1 = __importDefault(require("./steam/from64touser"));
/**
 * Get a duplicate-free version of an array of steam-64 ids and return steam users
 */
const GetSteamUsers = (steamIds) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueSteamIds = [...new Set(steamIds)]
        // Filter the non steam64 values (not numbers)
        .filter((steamid) => !isNaN(Number(steamid)));
    // If there are no valid steam64 ids, return an empty array
    if (!uniqueSteamIds.length)
        return [];
    // Get the steam profiles
    const profiles = yield (0, from64touser_1.default)(uniqueSteamIds);
    return profiles || [];
});
exports.default = GetSteamUsers;
