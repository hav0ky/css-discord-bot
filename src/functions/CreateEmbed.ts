import { EmbedBuilder } from 'discord.js';
import { Table } from 'embed-table';
import { PlayerInfo, SafeServerInfo } from './query/ServerQuery';

function truncateString(input: string): string {
    if (input.length > 10) {
        return input.slice(0, 10);
    }
    return input;
}

export function calculateKDRatio(kills: number, deaths: number) {
    if (deaths === 0) {
        if (kills === 0) {
            return 0.00.toFixed(2); // If both kills and deaths are 0
        }
        return kills.toFixed(2); // If deaths are 0, KD ratio is equal to kills
    }

    return (kills / deaths).toFixed(2); // Normal KD ratio calculation
}
// <t:1643093469:R>
const table = new Table({
    titles: ['Player', 'KD Ratio', 'Kills', 'Deaths'],
    titleIndexes: [0, 80, 100, 110],
    columnIndexes: [0, 40, 54, 63],
    start: '`',
    end: '`',
    padEnd: 4
});

const CreateEmbed = (server: SafeServerInfo) => {

    const embed = new EmbedBuilder()
        .setColor(0x000000)
        // .setTitle(process.env.TITLE!)
        // .setURL(process.env.DOMAIN!)
        // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription(`**${server.hostname}**`)
        // .setThumbnail(`https://raw.githubusercontent.com/hav0ky/stuff/main/maps/${server.map}.webp`)
        // .setThumbnail(`https://image.gametracker.com/images/maps/160x120/csgo/${server.map}.jpg`)
        .addFields(
            { name: 'Status', value: ':green_circle: Online', inline: true },
            { name: 'Address:Port', value: '`' + server.address + '`', inline: true },
            { name: 'Country', value: ':flag_in: IN', inline: true },
            { name: 'Game', value: server.game, inline: true },
            { name: 'Current Map', value: `${server.map}`, inline: true },
            { name: 'Players', value: `${(server.players as []).length}/${server.maxPlayers} (${server.playersPercentage}%)`, inline: true },
        )
        // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        // .setTimestamp()
        .setFooter({ text: 'Powered by proaim.cc | Game Server Monitor' })

    if ((server.players as []).length > 0) {
        (server.players as []).map((player: PlayerInfo) =>
            table.addRow([truncateString(player.playerName!), `${calculateKDRatio(Number(player.k), Number(player.d))}`, `${player.k}`, `${player.d}`])
        )
        embed.addFields(table.toField())
    }

    return embed
}

export default CreateEmbed