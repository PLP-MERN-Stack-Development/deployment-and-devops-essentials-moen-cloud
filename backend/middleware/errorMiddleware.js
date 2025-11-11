/**
 * Custom error handler middleware
 * Catches all errors and sends consistent error responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Set status code
  const statusCode = err.statusCode || res.statusCode || 500;
  
  // Prepare error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.message = 'Validation Error';
    errorResponse.errors = Object.values(err.errors).map(e => e.message);
  }

  if (err.name === 'CastError') {
    errorResponse.message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    errorResponse.message = 'Duplicate field value entered';
    errorResponse.field = Object.keys(err.keyPattern)[0];
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 handler for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};