import query from "../functions/db"
import ServerQuery, { SafeServerInfo } from "../functions/query/ServerQuery"

const GetAllServers = async () => {
    const dbServers = await query.servers.getAll()

    const servers: (SafeServerInfo | null)[] = await Promise.all(
        dbServers.map(async (server) => {
            const { id: serverId } = server

            const serverInfo = await ServerQuery(serverId, true).catch((e) => {
                console.log(`Error while querying server: ${serverId}, error: ${e}`)
            })

            if (!serverInfo) return null

            return serverInfo
        })
    )

    const mappedServers = servers.filter((server) => server !== null)

    return mappedServers
}

export default GetAllServers