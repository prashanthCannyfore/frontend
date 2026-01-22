// backend/middlewares/error.js
import ErrorHandler from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  console.log("error");
  
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource Not Found. Invalid: ${err.path}`, 400);
  }

  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} entered`,
      400
    );
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid JWT Token", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JWT Token Expired", 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  }); 
};

export default errorMiddleware;
