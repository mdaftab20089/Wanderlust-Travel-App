class ExpressError extends Error {
  constructor(statusCode = 500, message = "Something went wrong") {
    super(message);
    this.statusCode = Number.isInteger(statusCode) ? statusCode : 500;
    this.name = "ExpressError";
    if (Error.captureStackTrace) Error.captureStackTrace(this, ExpressError);
  }
}
module.exports = ExpressError;
