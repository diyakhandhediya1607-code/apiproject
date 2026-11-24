const errorMiddleware = (error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  const status = error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;
  res.status(status).json({ message: status === 500 ? "Internal server error." : error.message });
};
export default errorMiddleware;
