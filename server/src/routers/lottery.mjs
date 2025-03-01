import express from "express";
import { body, query } from "express-validator";
import LotteryDao from "../daos/lottery.mjs";
import ErrorHandler from "../errorHandler.mjs";


// Represents a class that defines the lottery routes for the application: those are the routes that are used to interact with the lottery system, 
// that return the same data for all users.
class LotteryRoutes {
  constructor(authenticator) {
    this.authService = authenticator;
    this.errorHandler = new ErrorHandler();
    this.router = express.Router();
    this.initRoutes();
  }


  getRouter() {
    return this.router;
  }


  initRoutes() {

    /**
     * Fetches last lottery draw
     * @route GET /api/lottery/last
     * @returns Last lottery draw (object defined in dao) - 200
     */
    this.router.get(
      "/last",
      this.authService.isLoggedIn,
      (req, res, next) => {
        LotteryDao.getLastGame(req.query.limit || null, req.query.offset || null).then((row) => {
          res.status(200).json(row);
        }).catch((error) => {
          next(error);
        });
      }
    );

    /**
    * Fetches the next lottery draw timestamp
    * @route GET /api/lottery/next
    * @returns Timestamp of the next lottery draw - 200
    */
    this.router.get(
      "/next",
      this.authService.isLoggedIn,
      (req, res, next) => {
        LotteryDao.getNextGame().then((row) => {
          res.status(200).json(row);
        }).catch((error) => {

          next(error);
        });
      }
    );

    /**
     * Fetches the leaderboard (top 3 users with the most points)
     * @route GET /api/lottery/leaderboard
     * @returns Leaderboard (object defined in dao) - 200
     */
    this.router.get(
      "/leaderboard",
      this.authService.isLoggedIn,
      (req, res, next) => {
        LotteryDao.getLeaderboard().then((row) => {
          res.status(200).json(row);
        }).catch((error) => {
          next(error);
        });
      }
    )

  }
}
export default LotteryRoutes;


