import { createPool } from 'mysql2/promise'

const db = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '3306'),
})

let isReady = false

db.on('connection', async (connection) => {
    if (isReady) return
    isReady = true

    console.log(`[DB] Connected to database`)

    // try {
    // 	connection.query(
    // 		`CREATE TABLE IF NOT EXISTS \`${process.env.DB_DATABASE}\`.\`sa_admins_groups\` (\`id\` VARCHAR(50) NOT NULL, \`name\` TEXT NOT NULL , \`flags\` TEXT NOT NULL , \`immunity\` varchar(64) NOT NULL DEFAULT '0' ,\`created\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE = InnoDB;`
    // 	)

    // 	// connection.query(
    // 	// 	`ALTER TABLE \`${process.env.DB_DATABASE}\`.\`sa_mutes\` ADD COLUMN IF NOT EXISTS \`unmute_reason\` TEXT NULL DEFAULT NULL AFTER \`reason\`, ADD COLUMN IF NOT EXISTS \`comment\` TEXT NULL DEFAULT NULL AFTER \`unmute_reason\`;`
    // 	// )

    // 	// connection.query(
    // 	// 	`ALTER TABLE \`${process.env.DB_DATABASE}\`.\`sa_bans\` ADD COLUMN IF NOT EXISTS \`unban_reason\` TEXT NULL DEFAULT NULL AFTER \`reason\`, ADD COLUMN IF NOT EXISTS \`comment\` TEXT NULL DEFAULT NULL AFTER \`unban_reason\`;`
    // 	// )

    // 	// connection.query(
    // 	// 	`ALTER TABLE \`sa_mutes\` CHANGE \`type\` \`type\` ENUM('GAG','MUTE','SILENCE','') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'GAG';`
    // 	// )
    // } catch (err) {
    // 	console.log(`[DB] Error while creating tables: ${err}`)
    // }
})

export default db
