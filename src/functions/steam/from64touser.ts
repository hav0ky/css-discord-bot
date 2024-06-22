import type { IExtendedSteamUser, ISteamUser, ISteamUserResponse } from './types'
import axios from 'axios'
import Steam64ToID from './from64tosteamid'

// Function overloads
async function From64ToUser(steam64: string, delay?: number): Promise<IExtendedSteamUser>
async function From64ToUser(steam64: string[], delay?: number): Promise<IExtendedSteamUser[]>

/**
 * Converts a Steam64 ID to a User Object
 * @param steam64 The user Steam64 ID, Example: 76561198000000000 OR Array of Steam64 IDs
 * @param delay The delay between each request (default: 100ms)
 * @returns User Object or null if not found
 */
async function From64ToUser(
    steam64: string | string[],
    delay = 100
): Promise<IExtendedSteamUser | IExtendedSteamUser[]> {
    if (!steam64) throw new Error('Invalid Steam64 ID')

    const fetchUsers = async (ids: string[]): Promise<IExtendedSteamUser[]> => {
        try {
            const data = await SteamFetch(ids)
            if (!data.length) throw new Error('Invalid Steam64 ID')

            const users: IExtendedSteamUser[] = data
                .map((p: ISteamUser) => ({
                    ...p,
                    steamIds: Steam64ToID(p.steamid),
                }))
                .filter((u): u is IExtendedSteamUser => !!u)

            return users
        } catch (error) {
            console.error(error)
            return []
        }
    }

    const fetchUsersBatch = async (users: string[]): Promise<IExtendedSteamUser[]> => {
        const allUsers: IExtendedSteamUser[] = [];
        const batchSize = 100;

        // Function to fetch a single batch
        async function fetchBatch(startIndex: number): Promise<void> {
            const endIndex = Math.min(startIndex + batchSize, users.length);
            const userBatch = users.slice(startIndex, endIndex);
            const fetchedUsers = await fetchUsers(userBatch);
            allUsers.push(...fetchedUsers);
        }

        // Loop through the users array in increments of batchSize
        for (let i = 0; i < users.length; i += batchSize) {
            await fetchBatch(i);
            if (delay) await new Promise((r) => setTimeout(r, delay))
        }

        return allUsers;
    }


    if (Array.isArray(steam64)) {
        if (steam64.length > 100) {
            return await fetchUsersBatch(steam64)
        } else {
            return await fetchUsers(steam64)
        }
    } else {
        const users = await fetchUsers([steam64])
        if (!users.length) throw new Error('Could not find user')

        return users[0] as IExtendedSteamUser
    }
}

/**
 * Steam Fetch function to fetch data from the Steam API using Axios
 * @update 2022-07-11: Added support for multiple API keys and random API key selection
 * @param users string or array of strings of Steam64 IDs
 * @returns fetch response
 */
const SteamFetch = async (users: string | string[]): Promise<ISteamUserResponse['data']['response']['players']> => {

    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&format=json&steamids=${Array.isArray(users) ? users.join(',') : users
        }`

    try {
        const { data } = await axios.get<ISteamUserResponse['data']>(url)
        return data.response.players
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error as any}`)
    }
}

export default From64ToUser
