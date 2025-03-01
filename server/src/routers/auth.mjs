import express from "express";
import { body } from "express-validator";
import UserDAO from "../daos/user.mjs";
import ErrorHandler from "../errorHandler.mjs";


/**
 * Represents a class that defines the authentication routes for the application.
 */
class AuthRoutes {



    constructor(authenticator) {
        this.authService = authenticator;
        this.errorHandler = new ErrorHandler();
        this.router = express.Router();
        this.initRoutes();
    }

    getRouter() {
        return this.router
    }

    initRoutes() {

        /**
         * Route for logging in a user.
         * @route POST /api/auth/
         * @params username, password as strings.
         * @returns the logged in user - 200
         */
        this.router.post(
            "/",
            this.authService.isNotLoggedIn,
            body("username").isString().isLength({ min: 1 }),
            body("password").isString().isLength({ min: 1 }),
            this.errorHandler.validateRequest,
            (req, res, next) => this.authService.login(req, res, next)
                .then((user) => res.status(200).json(req.user))
                .catch((err) => { res.status(401).json(err) })
        )


        /**
         * Route for logging out the currently logged in user.
         * @route DELETE /api/auth/current
         * @returns 200 status code
         */
        this.router.delete(
            "/current",
            this.authService.isLoggedIn,
            (req, res, next) => this.authService.logout(req, res, next)
                .then(() => res.status(204).end())
                .catch((err) => next(err))
        )

        /**
         * Route for retrieving the currently logged in user and his points
         * @route GET /api/auth/current
         * @returns logged in user and points - 200 
         */
        this.router.get(
            "/current",
            this.authService.isLoggedIn,
            (req, res) => res.status(200).json(req.user)

        )


    }
}
export default AuthRoutes