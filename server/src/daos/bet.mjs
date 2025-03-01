import db from '../db/db.mjs';
import dayjs from 'dayjs';

//Performs the operations related to the bets
class BetDAO {


    /**
     * Place a bet on the current game with the given numbers
     * @param numbersArray array of numbers to place a bet on
     * @param username username of the user placing the bet
     * @returns true if the bet was placed successfully
     */
    static async placeBet(numbersArray, username) {
        // if (numbersArray.length > 3 || numbersArray.length === 0) {
        //     throw new Error("Place a bet with 1 to 3 numbers");
        // }
        const pointsPaid = numbersArray.length * 5;
        try {
            // start transaction (for updating the user points and inserting the bet)
            await new Promise((resolve, reject) => {
                db.run("BEGIN TRANSACTION", (err) => {
                    if (err) reject("DB transaction error");
                    else resolve();
                });
            });
            //get the current game
            const game = await new Promise((resolve, reject) => {
                const sql = "SELECT game_id, timestamp FROM game WHERE played = 0 ORDER BY timestamp DESC LIMIT 1";
                db.get(sql, [], (err, row) => {
                    if (err) reject("DB transaction error");
                    else resolve(row);
                });
            });

            if (!game) {
                throw new Error("No games available");
            }
            const currentTime = dayjs().valueOf();
            //if there is no game available to place a bet on
            if (game.timestamp - currentTime < 0) {
                throw new Error("No game available");
            }

            // check if the user has already placed a bet for this game
            const existingBet = await new Promise((resolve, reject) => {
                const sql1 = "SELECT * FROM bet WHERE game_id = ? AND username = ?";
                db.get(sql1, [game.game_id, username], (err, row) => {
                    if (err) reject("DB error");
                    else resolve(row);
                });
            });
            if (existingBet) {
                throw new Error("Duplicate bet");
            }

            // get user points and check if he has enough
            const sql3 = "SELECT points FROM user WHERE username = ?";
            const row = await new Promise((resolve, reject) => {
                db.get(sql3, [username], (err, row) => {
                    if (err) reject("DB transaction error");
                    else resolve(row);
                });
            });

            if (!row || row.points < pointsPaid) {
                throw new Error("Not enough points");
            }

            //insert the bet
            const sql2 = "INSERT INTO bet (game_id, username, number_1, number_2, number_3) VALUES (?,?,?,?,?)";
            await new Promise((resolve, reject) => {
                db.run(sql2, [game.game_id, username, numbersArray[0] || null, numbersArray[1] || null, numbersArray[2] || null], (err) => {
                    if (err) reject("DB transaction error");
                    else resolve();
                });
            });



            // update user points
            const sql4 = "UPDATE user SET points = points - ? WHERE username = ?";
            await new Promise((resolve, reject) => {
                db.run(sql4, [pointsPaid, username], (err) => {
                    if (err) reject("DB transaction error");
                    else resolve();
                });
            });


            // confirm transaction if everything is ok
            await new Promise((resolve, reject) => {
                db.run("COMMIT", (err) => {
                    if (err) reject("DB transaction error");
                    else resolve();
                });
            });

            return true;
        } catch (error) {
            //rollback if error
            await new Promise((resolve, reject) => {
                db.run("ROLLBACK", (err) => {
                    if (err) reject("DB rollback error");
                    else resolve();
                });
            });

            throw error;
        }
    }

    /**
     * Delete the bet on the current game placed by the user and refund the points
     * @param username username of the user placing the bet
     * @returns true if the bet was deleted successfully
     */
    static async deleteBet(username) {
        try {
            // start transaction (for updating the user points and deleting the bet)
            await new Promise((resolve, reject) => {
                db.run("BEGIN TRANSACTION", (err) => {
                    if (err) reject("DB transaction error");
                    else resolve();
                });
            });
            //get the current game
            const game = await new Promise((resolve, reject) => {
                const sql = "SELECT game_id, timestamp FROM game WHERE played = 0 ORDER BY timestamp DESC LIMIT 1";
                db.get(sql, [], (err, row) => {
                    if (err) reject("DB transaction error");
                    else if (!row) reject("No game found");
                    else resolve(row);
                });
            });

            //assure that the it is not too late to delete the bet
            const currentTime = dayjs().valueOf();
            if (game.timestamp - currentTime < 0) {
                throw new Error("It is too late to delete the bet");
            }

            // check if the user has  placed a bet for this game
            const bet = await new Promise((resolve, reject) => {
                const sql1 = "SELECT * FROM bet WHERE game_id = ? AND username = ?";
                db.get(sql1, [game.game_id, username], (err, row) => {
                    if (err) reject("DB error1");
                    else if (!row) reject("No bet found");
                    else resolve(row);
                })
            });

            //refund user points
            const pointsPaid = (bet.number_1 ? 5 : 0) + (bet.number_2 ? 5 : 0) + (bet.number_3 ? 5 : 0);
            const sql3 = "UPDATE user SET points = points + ? WHERE username = ?";
            await new Promise((resolve, reject) => {
                db.run(sql3, [pointsPaid, username], (err) => {
                    if (err) reject("DB transaction error");
                    else resolve();
                });
            });

            //delete the bet
            await new Promise((resolve, reject) => {
                const sql = "DELETE FROM bet WHERE username = ? AND game_id = ?";
                db.run(sql, [username, game.game_id], (err) => {
                    if (err) reject("DB erro2r");
                    else resolve();
                });
            });

            // confirm transaction if everything is ok
            await new Promise((resolve, reject) => {
                db.run("COMMIT", (err) => {
                    if (err) reject("DB transaction error");
                    else resolve();
                });
            });


            return true;
        } catch (error) {
            //rollback if error
            await new Promise((resolve, reject) => {
                db.run("ROLLBACK", (err) => {
                    if (err) reject("DB rollback error");
                    else resolve();
                });
            });

            throw error;
        }
    }

    /**
     * Returns the result of the user's last bet that has a result
     * @param username username of the user 
     * @returns object with the correct numbers, the user's numbers, the number of right numbers and the timestamp of the game
     */
    static async getLastBet(username) {
        try {

            //    //get the current game
            //    const game = await new Promise((resolve, reject) => {
            //     const sql = "SELECT game_id, timestamp FROM game WHERE played = 0 ORDER BY timestamp DESC LIMIT 1";
            //     db.get(sql, [], (err, row) => {
            //         if (err) reject("DB transaction error1");
            //         else if (!row) reject("No game found");
            //         else resolve(row);
            //     });
            // });

            const row = await new Promise((resolve, reject) => {
                const sql = "SELECT timestamp,right_numbers,bet.number_1 as guess_1, bet.number_2 as guess_2, bet.number_3 as guess_3,game.number_1 as correct_1,game.number_2 as correct_2,game.number_3 as correct_3,game.number_4 as correct_4,game.number_5 as correct_5 FROM bet INNER JOIN game ON bet.game_id=game.game_id WHERE username = ? AND played=true ORDER BY bet.game_id DESC LIMIT 1  ";
                db.get(sql, [username], (err, row) => {
                    if (err) reject("DB error");
                    if (!row) resolve([]);
                    else resolve({ correct_numbers: [row.correct_1, row.correct_2, row.correct_3, row.correct_4, row.correct_5], guess_numbers: [row.guess_1, row.guess_2, row.guess_3], right_numbers: row.right_numbers, timestamp: row.timestamp });
                });
            });



            return row;
        } catch (error) {

            throw error;
        }
    }

    /**
     * Get the status of the user's current bet
     * @param username username of the user
     * @returns object with the user's numbers or an empty array if the user has not placed a bet
     */
    static async getCurrentBet(username) {
        try {

            //get the current game
            const game = await new Promise((resolve, reject) => {
                const sql = "SELECT game_id, timestamp FROM game WHERE played = 0 ORDER BY timestamp DESC LIMIT 1";
                db.get(sql, [], (err, row) => {
                    if (err) reject("DB error");
                    else if (!row) reject("No game found");
                    else resolve(row);
                });
            });
            const bet = await new Promise((resolve, reject) => {
                const sql = "SELECT bet.number_1 as guess_1, bet.number_2 as guess_2, bet.number_3 as guess_3 FROM bet INNER JOIN game ON bet.game_id=game.game_id WHERE username = ? AND bet.game_id=?  ORDER BY bet.game_id DESC LIMIT 1";
                db.get(sql, [username, game.game_id], (err, row) => {
                    if (err) reject("DB error");
                    if (!row) resolve({ guess_numbers: [] });
                    else resolve({ guess_numbers: [row.guess_1, row.guess_2, row.guess_3] });
                });
            });

            return bet;
        } catch (error) {

            throw error;
        }
    }

}

export default BetDAO;