"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Servers_1 = __importDefault(require("./Servers"));
const Ranks_1 = __importDefault(require("./Ranks"));
const query = {
    servers: Servers_1.default,
    ranks: Ranks_1.default
};
exports.default = query;
