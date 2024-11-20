const osUtils = require("os-utils");

function startPerformanceMetrics(io) {
  setInterval(() => {
    osUtils.cpuUsage((cpuPercent) => {
      const data = {
        memoryUsage: process.memoryUsage(),
        cpuUsage: cpuPercent,
        uptime: process.uptime(),
      };
      io.emit("performanceMetrics", data);
    });
  }, 1000); // Update every second
}

module.exports = startPerformanceMetrics;
