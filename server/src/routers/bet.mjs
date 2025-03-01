import express from "express";
import { body } from "express-validator";
import BetDAO from "../daos/bet.mjs";
import ErrorHandler from "../errorHandler.mjs";


/**
 * Represents a class that defines the bet routes for the application.
 */
class BetRoutes {
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
     * Place a bet on the lottery
     * @route POST /api/bet/
     * @param numbers - an array of integers between 1 and 90 of length between 1 and 3
     * @returns 200 status code
     */
    this.router.post(
      "/",
      this.authService.isLoggedIn,
      body("numbers").isArray(),
      body("numbers.*").isInt({ min: 1, max: 90 }),
      body("numbers").custom((arr) => { //check if the array has between 1 and 3 elements
        if (arr.length < 1 || arr.length > 3) {
          throw new Error('Select between 1 and 3 numbers');
        }
        return true;
      }),
      body("numbers").custom((arr) => {
        if (new Set(arr).size !== arr.length) { //check if numbers are distinct by converting into a set and comparing the size
          throw new Error('Numbers must be distinct');
        }
        return true;
      }),
      this.errorHandler.validateRequest,
      (req, res, next) => {
        BetDAO.placeBet(req.body.numbers, req.user.username).then((row) => {
          res.status(204).end();
        }).catch((error) => {
          next(error);
        });
      }
    );

    /**
     * Delete current user bet
     * @route DELETE /api/bet/
     * @returns 200 status code
     */
    this.router.delete(
      "/",
      this.authService.isLoggedIn,
      (req, res, next) => {
        BetDAO.deleteBet(req.user.username).then((row) => {
          res.status(204).end();
        }).catch((error) => {
          next(error);
        });
      }
    );


    /**
     * Obtains the result of the user's last bet that has a result
     * @route GET /api/bet/result
     * @returns The result of the user's last bet as an object (defined in the DAO) - 200
     */
    this.router.get(
      "/result",
      this.authService.isLoggedIn,
      (req, res, next) => {
        BetDAO.getLastBet(req.user.username).then((row) => {
          res.status(200).json(row);
        }).catch((error) => {
          next(error);
        });
      }
    );

    /**
     * Obtains the status of the user's current bet
     * @route GET /api/bet/status
     * @returns An object with the user's current bet - 200
     */
    this.router.get(
      "/status",
      this.authService.isLoggedIn,
      (req, res, next) => {
        BetDAO.getCurrentBet(req.user.username).then((row) => {
          res.status(200).json(row);
        }).catch((error) => {
          next(error);
        });
      });

  }
}
export default BetRoutes;


