"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastUpdated = exports.TitleEmbed = void 0;
const discord_js_1 = require("discord.js");
function getDiscordTimestamp(date = new Date(), style = 'R') {
    const unixTimestamp = Math.floor(date.getTime() / 1000); // Convert to Unix timestamp in seconds
    return `<t:${unixTimestamp}:${style}>`;
}
const TitleEmbed = () => {
    return new discord_js_1.EmbedBuilder()
        .setColor(0x000000)
        .setTitle(process.env.TITLE)
        .setURL(process.env.DOMAIN);
};
exports.TitleEmbed = TitleEmbed;
const LastUpdated = () => {
    const date = new Date();
    return new discord_js_1.EmbedBuilder()
        .setColor(0x000000)
        .setDescription('Last updated: ' + getDiscordTimestamp(date));
};
exports.LastUpdated = LastUpdated;
