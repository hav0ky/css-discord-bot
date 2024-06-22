import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import type { DB_Count, SA_Rank } from '../../types/db/plugin'
import db from '../../lib/mysql'

interface SA_RanksDB extends SA_Rank, RowDataPacket { }

const Ranks = {
    getAll: async (page: number, limit: number): Promise<SA_Rank[]> => {
        try {
            const [rows] = await db.query<SA_RanksDB[]>(
                `SELECT * FROM \`in_ranks\` ORDER BY \`value\` DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`
            )
            return rows
        } catch (err) {
            console.log(`[DB] Error while getting all ranks: ${err}`)
            return []
        }
    },
    getById: async (rankId: number): Promise<SA_Rank | null> => {
        try {
            const [rows] = await db.query<SA_RanksDB[]>('SELECT * FROM `in_ranks` WHERE id = ?', [rankId])
            if (!rows.length || rows.length < 1) return null
            return rows[0]
        } catch (err) {
            console.log(`[DB] Error while getting all mutes: ${err}`)
            return null
        }
    },
    recent_player_count: async (): Promise<number> => {
        try {
            const [rows] = await db.query<DB_Count[]>('SELECT COUNT(*) FROM `in_ranks` WHERE `lastconnect` >= UNIX_TIMESTAMP() - (24 * 60 * 60);')
            return rows?.[0]?.['COUNT(*)']
        } catch (err) {
            console.log(`[DB] Error while getting recent players: ${err}`)
            return 0
        }
    },
    // create: async (props: Partial<SA_Rank>): Promise<number | null> => {
    //     try {
    //         const keys = Object.keys(props)
    //         const values = Object.values(props)

    //         const [rows] = await db.query<ResultSetHeader>(
    //             `INSERT INTO \`sa_mutes\` (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
    //             values
    //         )

    //         return rows.insertId
    //     } catch (err) {
    //         console.log(`[DB] Error while creating mutes: ${err}`)
    //         return null
    //     }
    // },
    update: async (id: number, props: Partial<SA_Rank>): Promise<boolean> => {
        try {
            const keys = Object.keys(props)

            const [rows] = await db.query<ResultSetHeader>(
                `UPDATE \`in_ranks\` SET ${keys.map((f) => `${f} = ?`).join(', ')} WHERE steam = ?`,
                [...Object.values(props), id]
            )

            return rows.affectedRows > 0
        } catch (err) {
            console.log(`[DB] Error while updating mutes: ${err}`)
            return false
        }
    },
    delete: async (rankId: number): Promise<boolean> => {
        try {
            const [rows] = await db.query<ResultSetHeader>('DELETE FROM `in_ranks` WHERE steam = ?', [rankId])

            return rows.affectedRows > 0
        } catch (err) {
            console.log(`[DB] Error while deleting mute: ${err}`)
            return false
        }
    },
    count: async (): Promise<number> => {
        try {
            const [rows] = await db.query<DB_Count[]>('SELECT COUNT(*) FROM `in_ranks`')
            return rows?.[0]?.['COUNT(*)']
        } catch (err) {
            console.log(`[DB] Error while counting mutes: ${err}`)
            return 0
        }
    },
}

export default Ranks
