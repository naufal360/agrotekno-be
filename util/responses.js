class Error {
  constructor(error, message) {
    this.error = error;
    this.message = message;
  }
}

class Success {
  constructor(error, message, data) {
    this.error = error;
    this.message = message;
    this.data = data;
  }
}
class SuccessCustomDimension {
  constructor(error, message, total, data) {
    this.error = error;
    this.message = message;
    this.total = total;
    this.data = data;
  }
}

module.exports = { Error, Success, SuccessCustomDimension };
