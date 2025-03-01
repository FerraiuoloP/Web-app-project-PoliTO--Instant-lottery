import { validationResult } from "express-validator";


// Represents a class that handles errors in the application.
class ErrorHandler {

    /**
     * Validates the request object and returns an error if the request object is not formatted properly, according to the middlewares used when defining the request.
     * @returns Returns the next function if there are no errors or a response with a status code of 422 if there are errors.
     */
    validateRequest(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let error = "Invalid parameters"
            return res.status(422).json({ message: error })
        }
        return next()
    }

    /**
     * Registers the error handler.
     * @param router - The router object
     */
    static registerErrorHandler(router) {

        router.use((err, req, res, next) => {
            return res.status(500).json({
                message: err.message || "Internal Server Error"
            });
        })
    }
}

export default ErrorHandler
