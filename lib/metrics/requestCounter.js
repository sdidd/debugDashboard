let totalRequests = 0;

function requestCounter(io) {
  return (req, res, next) => {
    totalRequests++;
    io.emit("requestCount", { totalRequests });
    next();
  };
}

module.exports = requestCounter;
