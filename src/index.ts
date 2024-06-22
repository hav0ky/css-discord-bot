import { ActivityType, Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { TextChannel } from 'discord.js';
import 'dotenv/config'
import cron from 'node-cron';

import GetAllServers from "./functions/GetServers";
import CreateEmbed from "./functions/CreateEmbed";
import { LastUpdated, TitleEmbed } from "./functions/CustomEmbeds";
// import GetAllServers from "./functions/GetServers";
// import query from "./functions/db";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

function AddServerName<T>(array: EmbedBuilder[], firstElement: EmbedBuilder, lastElement: EmbedBuilder): EmbedBuilder[] {
    array.unshift(firstElement); // Add element to the beginning
    array.push(lastElement);     // Add element to the end
    return array;
}

client.on("ready", async () => {
    console.log('Ready event');
    const initial_servers = await GetAllServers()

    client.user?.setPresence({
        activities: [{ name: process.env.DOMAIN!, type: ActivityType.Watching }],
        status: 'dnd',
    });

    const initial_embeds = AddServerName(initial_servers.map(server => CreateEmbed(server!)), TitleEmbed(), LastUpdated())
    const message = await (client.channels.cache.get(process.env.CHANNEL_ID!) as TextChannel).send({
        embeds: initial_embeds
    })
    // .then((msg) => msg.edit('hello'))

    cron.schedule('*/3 * * * *', async () => {
        const new_servers = await GetAllServers()
        const new_embeds = AddServerName(new_servers.map(server => CreateEmbed(server!)), TitleEmbed(), LastUpdated())
        message.edit({ embeds: new_embeds })
        // console.log('edited')
    })
})

client.login(process.env.TOKEN)