class HttpError extends Error {
  constructor(message, errorCode, data = null) {
    super(message);
    this.code = errorCode;
    this.data = data;
  }
  }
  
  module.exports = HttpError;
  