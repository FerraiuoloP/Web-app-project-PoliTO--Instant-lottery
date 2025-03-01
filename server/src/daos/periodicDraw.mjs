import db from '../db/db.mjs';
import dayjs from 'dayjs';

/**
 * Create a new draw (with empty numbers and timestamp in 2 mintues)
 */
async function newDraw() {

  const futureTimestamp = dayjs().add(2, 'minute').valueOf();
  try {
    db.run('INSERT INTO game (timestamp, played) VALUES (?, ?)', [futureTimestamp, false]);
  } catch (error) {
    console.error('Error during draw!', error);
  }
}


/**
 * Extract the numbers for the last game that was played and then call newDraw
 */
async function extractNumbers() {
  try {
    //check if there is a game that needs a numbers extraction
    const sql = "SELECT * FROM game WHERE played = ? ORDER BY timestamp DESC LIMIT 1";
    const row = await new Promise((resolve, reject) => {
      db.get(sql, [false], (err, row) => {
        if (err) reject(err);
        if (!row) reject(err);
        else resolve(row);
      });
    });
    const gameid = row.game_id;


    const randomNumbers = getRandomNumbers();
    //  const randomNumbers = [8,12,55,34,90]; //for testing
    //update the game with the extracted numbers
    const sql2 = "UPDATE game SET played = 1, number_1 = ?, number_2 = ?, number_3 = ?, number_4 = ?, number_5 = ? WHERE game_id = ?";
    await new Promise((resolve, reject) => {
      db.run(sql2, [randomNumbers[0], randomNumbers[1], randomNumbers[2], randomNumbers[3], randomNumbers[4], gameid], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });


    const sql3 = "UPDATE bet" +
      " SET right_numbers =" +
      " (CASE WHEN number_1 IN (?,?,?,?,?) THEN 1 ELSE 0 END) +" +
      " (CASE WHEN number_2 IN (?,?,?,?,?) THEN 1 ELSE 0 END) +" +
      " (CASE WHEN number_3 IN (?,?,?,?,?) THEN 1 ELSE 0 END)" +
      "  WHERE game_id = ?";
    await new Promise((resolve, reject) => {
      db.run(sql3, [...randomNumbers, ...randomNumbers, ...randomNumbers, gameid], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    //get the correct bet for each user
    const sql4 = "SELECT username, right_numbers FROM bet WHERE game_id = ?";
    const bets = await new Promise((resolve, reject) => {
      db.all(sql4, [gameid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    //for each user update the points
    const sql5 = " UPDATE user SET points = points + ? WHERE username = ?";
    for (const bet of bets) {
      const { username, right_numbers } = bet;

      if (right_numbers > 0) {
        await new Promise((resolve, reject) => {
          db.run(sql5, [right_numbers * 10, username], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }


    // Create a new draw (with empty numbers and timestamp in 2 mintues)
    await newDraw();

  } catch (error) {
    console.error('Error during draw!', error);
  }
}

function getRandomNumbers() {
  const numbers = [];
  for (let i = 0; i < 5; i++) {
    while (true) {
      const number = Math.floor(Math.random() * 90) + 1;
      if (!numbers.includes(number)) {
        numbers.push(number);
        break;
      }
    }
  }
  return numbers;

}

export { extractNumbers, newDraw };