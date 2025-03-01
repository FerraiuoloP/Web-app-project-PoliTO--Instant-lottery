'use strict';
import dayjs from 'dayjs';
import sqlite3 from 'sqlite3';
import { extractNumbers, newDraw } from '../daos/periodicDraw.mjs';

// Open the database 
const db = new sqlite3.Database('./src/db/lottery.db', (err) => {
  if (err) throw err;
  else {
    //Create a new draw and extract the numbers every 2 minutes
    newDraw();
    setInterval(extractNumbers, 120000); //2 minutes each draw
  }
});






export default db;