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
const CURRENT_VERSION = process.env.version;
/**
 * Get the status of the server **using RCON and the custom plugin command (css_query)**
 * - Using the custom plugin that made for the panel
 */
const PluginStatus = (ip, port, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const server = yield (0, valve_server_query_1.RCON)({
            ip,
            port,
            password,
            enableWarns: true,
            retries: 2,
            timeout: 2000,
        });
        server.authenticate();
        const status = yield server.exec('css_query');
        if (!status)
            return null;
        const parsedStatus = sanitizeJSON(status);
        const jsonStatus = JSON.parse(parsedStatus);
        const { pluginVersion } = jsonStatus.server;
        if (pluginVersion !== CURRENT_VERSION) {
            console.log(`[PluginStatus] The plugin version (${pluginVersion}) for ${ip}:${port} is outdated, the latest version is: ${CURRENT_VERSION}\n-> Download the latest version from: https://github.com/ShiNxz/CSS-Plugin`);
        }
        // console.log(jsonStatus)
        return jsonStatus;
    }
    catch (e) {
        if ((_a = e === null || e === void 0 ? void 0 : e.message) === null || _a === void 0 ? void 0 : _a.includes('Connection timeout')) {
            console.log(`getting Plugin RCON status: ${ip}:${port}: ${e}\nMake sure that the server is running and the RCON is enabled.`);
        }
        else
            console.log(`getting Plugin RCON status: ${ip}:${port}: ${e}\nMake sure that the plugin is installed and the RCON is enabled.\n-> Download: https://github.com/ShiNxz/CSS-Plugin`);
        return null;
    }
});
/**
 * This will replace any non-ASCII characters with a space
 */
const sanitizeJSON = (input) => input.replace(/[^\x20-\x7E]/g, ' ');
exports.default = PluginStatus;
