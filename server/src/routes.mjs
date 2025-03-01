import express from "express"
import ErrorHandler from "./errorHandler.mjs"
import Authenticator from "./auth.mjs"
import AuthRoutes from "./routers/auth.mjs"
import LotteryRoutes from "./routers/lottery.mjs"
import BetRoutes from "./routers/bet.mjs"
import morgan from "morgan"
const prefix = "/api"

/**
 * Initializes the routes for the application.
 * 
 * @param app - express application instance
 */
function initRoutes(app) {
    app.use(morgan("dev")) // log requests to the console
    app.use(express.json()); // for parsing json
    app.use(express.urlencoded({ extended: true })); // for parsing x-www-form-urlencoded

    
    const authenticator = new Authenticator(app)
    const authRoutes = new AuthRoutes(authenticator)
    const betRoutes = new BetRoutes(authenticator)
    const lotteryRoutes = new LotteryRoutes(authenticator)

    app.use(`${prefix}/auth`, authRoutes.getRouter())
    app.use(`${prefix}/bet`, betRoutes.getRouter())
    app.use(`${prefix}/lottery`, lotteryRoutes.getRouter())

    ErrorHandler.registerErrorHandler(app)
}

export default initRoutes
