import { RCON } from '@fabricio-191/valve-server-query'

const CURRENT_VERSION = process.env.version

/**
 * Get the status of the server **using RCON and the custom plugin command (css_query)**
 * - Using the custom plugin that made for the panel
 */
const PluginStatus = async (ip: string, port: number, password: string): Promise<PluginStatus | null> => {
	try {
		const server = await RCON({
			ip,
			port,
			password,
			enableWarns: true,
			retries: 2,
			timeout: 2000,
		})

		server.authenticate()

		const status = await server.exec('css_query')
		if (!status) return null

		const parsedStatus = sanitizeJSON(status)

		const jsonStatus = JSON.parse(parsedStatus) as PluginStatus
		const { pluginVersion } = jsonStatus.server

		if (pluginVersion !== CURRENT_VERSION) {
			console.log(
				`[PluginStatus] The plugin version (${pluginVersion}) for ${ip}:${port} is outdated, the latest version is: ${CURRENT_VERSION}\n-> Download the latest version from: https://github.com/ShiNxz/CSS-Plugin`
			)
		}
		// console.log(jsonStatus)
		return jsonStatus
	} catch (e) {
		if ((e as any)?.message?.includes('Connection timeout')) {
			console.log(
				`getting Plugin RCON status: ${ip}:${port}: ${e}\nMake sure that the server is running and the RCON is enabled.`
			)
		} else
			console.log(
				`getting Plugin RCON status: ${ip}:${port}: ${e}\nMake sure that the plugin is installed and the RCON is enabled.\n-> Download: https://github.com/ShiNxz/CSS-Plugin`
			)
		return null
	}
}

/**
 * This will replace any non-ASCII characters with a space
 */
const sanitizeJSON = (input: string) => input.replace(/[^\x20-\x7E]/g, ' ')

export interface PluginServer {
	map: string
	players: number
	mP: number
	// maps: string[]
	pluginVersion: string
}

export interface PluginPlayer {
	id: number
	// playerName: string
	// ipAddress: string
	// accountId: '908937898'
	// steamId2: 'STEAM_0:0:454468949'
	// steamId3: '[U:1:908937898]'
	s64: string
	// ping: number
	t: number
	// clanName: string
	k: string
	d: string
	// assists: string
	// headshots: string
	// damage: string
	s: number
	// roundScore: number
	// roundsWon: number
	// mvps: number
	// time: number // currently doesnt work
	// avatar: string
}

export interface PluginStatus {
	server: PluginServer
	players: PluginPlayer[]
}

export default PluginStatus
