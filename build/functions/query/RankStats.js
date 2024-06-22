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
// import { GetSteamUser } from 'steam-api-sdk'
const db_1 = __importDefault(require("../db"));
/**
 * Get the stats from ranks database**
 * - Using the ranks plugin
 */
const RankStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield db_1.default.ranks.count();
        const recent = yield db_1.default.ranks.recent_player_count();
        const top = yield db_1.default.ranks.getAll(1, 1);
        // const top_player = await GetSteamUser(top[0].steam)
        return {
            total,
            recent,
            // top: {
            //     steamid: top_player.steamid,
            //     name: top_player.personaname,
            //     avatar: top_player.avatar,
            //     rank: top[0].value
            // },
        };
    }
    catch (e) {
        console.log('error');
        return null;
    }
});
exports.default = RankStats;
