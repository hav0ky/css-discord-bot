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
const discord_js_1 = require("discord.js");
require("dotenv/config");
const node_cron_1 = __importDefault(require("node-cron"));
const GetServers_1 = __importDefault(require("./functions/GetServers"));
const CreateEmbed_1 = __importDefault(require("./functions/CreateEmbed"));
const CustomEmbeds_1 = require("./functions/CustomEmbeds");
// import GetAllServers from "./functions/GetServers";
// import query from "./functions/db";
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages]
});
function AddServerName(array, firstElement, lastElement) {
    array.unshift(firstElement); // Add element to the beginning
    array.push(lastElement); // Add element to the end
    return array;
}
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Ready event');
    const initial_servers = yield (0, GetServers_1.default)();
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        activities: [{ name: 'proaim.cc', type: discord_js_1.ActivityType.Watching }],
        status: 'dnd',
    });
    const initial_embeds = AddServerName(initial_servers.map(server => (0, CreateEmbed_1.default)(server)), (0, CustomEmbeds_1.TitleEmbed)(), (0, CustomEmbeds_1.LastUpdated)());
    const message = yield client.channels.cache.get(process.env.CHANNEL_ID).send({
        embeds: initial_embeds
    });
    // .then((msg) => msg.edit('hello'))
    node_cron_1.default.schedule('*/3 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const new_servers = yield (0, GetServers_1.default)();
        const new_embeds = AddServerName(new_servers.map(server => (0, CreateEmbed_1.default)(server)), (0, CustomEmbeds_1.TitleEmbed)(), (0, CustomEmbeds_1.LastUpdated)());
        message.edit({ embeds: new_embeds });
        // console.log('edited')
    }));
}));
client.login(process.env.TOKEN);
