import { EmbedBuilder } from 'discord.js';

function getDiscordTimestamp(date = new Date(), style = 'R') {
    const unixTimestamp = Math.floor(date.getTime() / 1000); // Convert to Unix timestamp in seconds
    return `<t:${unixTimestamp}:${style}>`;
}

export const TitleEmbed = () => {
    return new EmbedBuilder()
        .setColor(0x000000)
        .setTitle(process.env.TITLE!)
        .setURL('https://' + process.env.DOMAIN!)
}

export const LastUpdated = () => {
    const date = new Date()
    return new EmbedBuilder()
        .setColor(0x000000)
        .setDescription('Last updated: ' + getDiscordTimestamp(date))
}