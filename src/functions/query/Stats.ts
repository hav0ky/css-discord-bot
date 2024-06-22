import query from '../db'

/**
 * Get the stats from database**
 * - Using the custom plugin that made for the panel
 */
const ApiStats = async (): Promise<ApiStats | null> => {
    try {
        const servers = await query.servers.count()
        const ranks = await query.ranks.count()

        return {
            ranks,
            servers,
        }
    } catch (e) {
        console.log('error')
        return null
    }
}

export interface ApiStats {
    servers: number
    ranks: number
}

export default ApiStats