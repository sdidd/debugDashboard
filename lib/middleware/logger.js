function requestLogger(io) {  return (req, res, next) => {
    const logData = {
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
    };
    console.log(`[${logData.timestamp}] ${logData.method} ${logData.url}`);
    io.emit("requestLog", logData);
    next();
  };
}

module.exports = requestLogger;
