const AppError = require("../utils/appError");

const handleCastErrorDB = error => {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = error => {
    const value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    //console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = error => {
    const errors = Object.values(error.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 401)
}

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired. Please log in again!', 401)
}

const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    });
}

const sendErrorProd = (error, res) => {
    // Operational, trusted error: send message to client
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }
    // Programming or other unknown error: don't leak error details
    else {
        // 1. Log Error
        console.error("ERROR!", error);
        // 2. Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}

module.exports = (error, req, res, next) => {
    //console.log(error.stack);
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error1 = {...error};
        if (error1.name === 'CastError') {
            error1 = handleCastErrorDB(error1);
        }
        if (error1.code === 11000) {
            error1 = handleDuplicateFieldsDB(error1);
        }
        if (error1.name === 'ValidationError') {
            error1 = handleValidationErrorDB(error1);
        }
        if (error1.name === 'JsonWebTokenError') {
            error1 = handleJWTError();
        }
        if (error1.name === 'TokenExpiredError') {
            error1 = handleJWTExpiredError();
        }
        sendErrorProd(error1, res);
    }
}