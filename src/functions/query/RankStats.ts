// import { GetSteamUser } from 'steam-api-sdk'
import query from '../db'
/**
 * Get the stats from ranks database**
 * - Using the ranks plugin
 */
const RankStats = async (): Promise<RankStats | null> => {
    try {
        const total = await query.ranks.count()
        const recent = await query.ranks.recent_player_count()
        const top = await query.ranks.getAll(1, 1)
        // const top_player = await GetSteamUser(top[0].steam)
        return {
            total,
            recent,
            // top: {
            //     steamid: top_player.steamid,
            //     name: top_player.personaname,
            //     avatar: top_player.avatar,
            //     rank: top[0].value
            // },
        }
    } catch (e) {
        console.log('error')
        return null
    }
}

export interface RankStats {
    total: number
    recent: number
    // top: {
    //     steamid: string,
    //     name: string,
    //     avatar: string,
    //     rank: number
    // }
}

export default RankStats