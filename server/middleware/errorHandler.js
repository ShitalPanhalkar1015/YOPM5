// server/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log the error stack for the developer
  console.error(err.stack);

  // Mongoose bad ObjectId (e.g., trip not found)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { statusCode: 404, message };
  }

  // Mongoose duplicate key (e.g., registering with an existing email)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { statusCode: 400, message };
  }

  // Mongoose validation error (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { statusCode: 400, message };
  }

  // Send a generic error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;