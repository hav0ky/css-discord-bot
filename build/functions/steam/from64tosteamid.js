"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_NUM = void 0;
const big_js_1 = __importDefault(require("big.js"));
exports.BASE_NUM = (0, big_js_1.default)('76561197960265728');
/**
 * Converts a Steam64 ID to a SteamID
 * @param steam64 The user Steam64 ID, Example: 76561198000000000
 * @returns array of 2 steam ids; Example: ['STEAM_0:0:2356325', 'STEAM_1:0:2356325']
 */
const Steam64ToID = (steam64) => {
    if (!steam64 || typeof steam64 !== 'string')
        return null;
    let v = exports.BASE_NUM, w = (0, big_js_1.default)(steam64), y = w.mod(2).toString();
    w = w.minus(y).minus(v);
    if (parseInt(w) < 1)
        return null;
    return [`STEAM_0:${y}:${w.div(2).toString()}`, `STEAM_1:${y}:${w.div(2).toString()}`];
};
exports.default = Steam64ToID;
