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
const db_1 = __importDefault(require("../functions/db"));
const ServerQuery_1 = __importDefault(require("../functions/query/ServerQuery"));
const GetAllServers = () => __awaiter(void 0, void 0, void 0, function* () {
    const dbServers = yield db_1.default.servers.getAll();
    const servers = yield Promise.all(dbServers.map((server) => __awaiter(void 0, void 0, void 0, function* () {
        const { id: serverId } = server;
        const serverInfo = yield (0, ServerQuery_1.default)(serverId, true).catch((e) => {
            console.log(`Error while querying server: ${serverId}, error: ${e}`);
        });
        if (!serverInfo)
            return null;
        return serverInfo;
    })));
    const mappedServers = servers.filter((server) => server !== null);
    return mappedServers;
});
exports.default = GetAllServers;
