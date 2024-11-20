const requestLogger = require("./middleware/logger");
const startPerformanceMetrics = require("./metrics/performance");
const dashboardRoutes = require("./routes/dashboard");
const setupMetricsSocket = require("./sockets/metrics");
const setupLoggerSocket = require("./sockets/logger");
const requestCounter = require("./metrics/requestCounter");
const setupClientTracker = require("./clients/clientTracker");

function initDebugDashboard(server, app) {
  let uniqueIPs = new Set();

  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000", // Your client URL
      methods: ["GET", "POST"],
    },
    // Disable logging by setting `logger` to false
    // logger: false,
    // Alternatively, set a logging level
    logLevel: 2, // This will reduce the log level to errors only
  });

  io.on("connection", (socket) => {
    console.log("A client connected");

    // Example of emitting a test message to verify connection
    socket.emit("connected", { message: "You are connected to the debug dashboard!" });

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  // Attach middleware
  // Middleware to track unique IPs and emit count
  app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    uniqueIPs.add(ip); // Add the IP to the set

    // Convert the Set to an array and emit the updated count of unique IPs
    const uniqueIPsArray = Array.from(uniqueIPs);
    io.emit("uniqueIPs", { uniqueIPs: uniqueIPsArray, count: uniqueIPs.size });

    next();
  });

  app.use(requestLogger(io));
  app.use(requestCounter(io)); // Add request counter middleware

  // Setup routes
  dashboardRoutes(app);

  // Start performance metrics
  startPerformanceMetrics(io);

  // Setup Socket.IO handlers
  setupMetricsSocket(io);
  setupLoggerSocket(io);
  setupClientTracker(io);

  console.log("Debug dashboard initialized. Access it at /dashboard");
}

module.exports = initDebugDashboard;
