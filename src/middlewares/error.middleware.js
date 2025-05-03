import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    // Default error
    let error = err;

    // If error is not an instance of ApiError, create a new one
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], error?.stack);
    }

    // Send error response
    const response = {
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
    };

    // Log error in development
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", error);
    }

    return res.status(error.statusCode).json(response);
};

// Handle 404 errors
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};

// Handle validation errors
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const statusCode = 400;
    const message = "Validation Error";
    return new ApiError(statusCode, message, errors);
};

// Handle duplicate key errors
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const statusCode = 409;
    const message = `${field} already exists`;
    return new ApiError(statusCode, message);
};

// Handle cast errors
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ApiError(400, message);
};

// Handle JWT errors
const handleJWTError = (err) => {
    return new ApiError(401, "Invalid token. Please log in again.");
};

// Handle JWT expired error
const handleJWTExpiredError = (err) => {
    return new ApiError(401, "Your token has expired. Please log in again.");
};

export {
    errorHandler,
    notFound,
    handleValidationError,
    handleDuplicateKeyError,
    handleCastError,
    handleJWTError,
    handleJWTExpiredError
}; 