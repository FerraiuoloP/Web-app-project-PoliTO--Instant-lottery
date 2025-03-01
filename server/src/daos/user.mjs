import db from "../db/db.mjs"

import crypto from "crypto"



//Performs the operations related to the user
class UserDAO {

    /**
 * Checks if username and password are correct.
 * @param username 
 * @param plainPassword 
 * @returns true if the username and password are correct (user authenticated), false otherwise
 */
    async checkLoginData(username, plainPassword) {
        try {
            const row = await new Promise((resolve, reject) => {
                const sql = "SELECT username, password, salt FROM user WHERE username = ?";
                db.get(sql, [username], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!row || row.username !== username || !row.salt) {
                return false;
            }

            const hashedPassword = crypto.scryptSync(plainPassword, row.salt, 32);
            const passwordHex = Buffer.from(row.password, "hex");

            if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
                return false;
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
  * Get a user object from the database based on the username.
  * @param username 
  * @returns User object with username and points
  */
    async getUserByUsername(username) {
        try {
            const row = await new Promise((resolve, reject) => {
                const sql = "SELECT username, points FROM user WHERE username = ?";
                db.get(sql, [username], (err, row) => {
                    if (err) reject(err);
                    else if (!row) reject(new Error("User not found"));
                    else resolve(row);
                });
            });

            return { username: row.username, points: row.points };
        } catch (error) {
            throw error;
        }
    }




}
export default UserDAO
