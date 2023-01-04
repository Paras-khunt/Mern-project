const ErrorHandler = require('../utils/errorhandler')

module.exports = (err, req, resp, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //=========WRONG MONGODB ERROR============================================
    if (err.name === "castError") {
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }


    resp.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}