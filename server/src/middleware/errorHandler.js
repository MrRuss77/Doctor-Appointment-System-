const errorHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed.",
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      message: "A unique field already exists.",
      field: Object.keys(error.keyPattern || {})
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid record id." });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {})
    });
  }

  return res.status(500).json({ message: "Internal server error." });
};

export default errorHandler;
