import db from "../db/db.mjs"
//Performs the operations related to the lottery that are same for every user (e.g. getting the last draw, getting the next draw, getting the leaderboard)
class LotteryDao {

    /**
     * Get the result of last game that was played
     * @returns Object with last game data: timestamp, number_1, number_2, number_3, number_4, number_5
     */
    static async getLastGame() {
        try {
            const row = await new Promise((resolve, reject) => {
                const sql = "SELECT * FROM game WHERE played = 1 ORDER BY timestamp DESC LIMIT 1";
                db.get(sql, (err, row) => {
                    if (err) reject("DB error");
                    else resolve(row);
                });
            });

            if (!row) {
                return [];
            }
            return {
                timestamp: row.timestamp, number_1: row.number_1, number_2: row.number_2, number_3: row.number_3, number_4: row.number_4, number_5: row.number_5,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get the timestamp of the next game
     * @returns Object with the timestamp of the next game
     */
    static async getNextGame() {
        try {
            const row = await new Promise((resolve, reject) => {
                const sql = "SELECT timestamp FROM game WHERE played = 0 ORDER BY timestamp DESC LIMIT 1";
                db.get(sql, [], (err, row) => {
                    if (err) reject("DB error");
                    else resolve(row);
                });
            });

            return row ? { timestamp: row.timestamp } : { timestamp: null };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get the leaderboard with the top 3 users with the most points
     * @returns Object with the top 3 users and their points
     */
    static async getLeaderboard() {
        try {
            const row = await new Promise((resolve, reject) => {
                const sql = "SELECT username, points FROM user ORDER BY points DESC LIMIT 3";
                db.all(sql, [], (err, row) => {
                    if (err) reject("DB error");
                    else resolve(row);
                });
            });

            return row;
        } catch (error) {
            throw error;
        }
    }






}
export default LotteryDao