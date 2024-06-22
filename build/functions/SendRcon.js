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
exports.SendGlobalCommand = void 0;
const valve_server_query_1 = require("@fabricio-191/valve-server-query");
const db_1 = __importDefault(require("./db"));
const SendRcon = (serverId, command) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbServer = yield db_1.default.servers.getById(Number(serverId));
        if (!dbServer)
            throw new Error('Server not found');
        const { address, rcon } = dbServer;
        const [ip, port] = address.split(':');
        if (!rcon)
            throw new Error('Server has no rcon password');
        const server = yield (0, valve_server_query_1.RCON)({
            ip,
            port: Number(port),
            password: rcon,
            enableWarns: true,
            retries: 2,
            timeout: 2000,
        });
        server.authenticate();
        const status = yield server.exec(command);
        if (!status)
            return 'No response from server';
        return status;
    }
    catch (error) {
        console.log(`Error while sending rcon command: ${error}`);
        throw error;
    }
});
const SendGlobalCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    const servers = yield db_1.default.servers.getAll();
    const responses = yield Promise.all(servers.map((server) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield SendRcon(server.id, command);
            return { server: server.hostname, response };
        }
        catch (error) {
            return { server: server.hostname, response: error };
        }
    })));
    return responses;
});
exports.SendGlobalCommand = SendGlobalCommand;
exports.default = SendRcon;
