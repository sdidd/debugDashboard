const path = require("path");
const { createServer: createViteServer } = require("vite");
const requestLogger = require("./middleware/logger");
const startPerformanceMetrics = require("./metrics/performance");
const dashboardRoutes = require("./routes/dashboard");
const setupMetricsSocket = require("./sockets/metrics");
const setupLoggerSocket = require("./sockets/logger");
const requestCounter = require("./metrics/requestCounter");
const setupClientTracker = require("./clients/clientTracker");

async function initDebugDashboard(server, app) {
  let uniqueIPs = new Set();

  // Initialize Socket.IO
  const io = require("socket.io")(server, {
    cors: {
      origin: "*", // Adjust to your client URL
      methods: ["GET", "POST"],
    },
    logLevel: 2, // Set log level (optional)
  });

  io.on("connection", (socket) => {
    console.log("A client connected");

    // Emit test message to verify connection
    socket.emit("connected", { message: "You are connected to the debug dashboard!" });

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  // Middleware to track unique IPs
  app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    uniqueIPs.add(ip); // Add IP to the set

    // Convert the Set to an array and emit updated count
    const uniqueIPsArray = Array.from(uniqueIPs);
    io.emit("uniqueIPs", { uniqueIPs: uniqueIPsArray, count: uniqueIPs.size });

    next();
  });

  // Attach other middleware
  app.use(requestLogger(io));
  app.use(requestCounter(io));

  // Setup routes
  dashboardRoutes(app);

  // Start performance metrics
  startPerformanceMetrics(io);

  // Setup Socket.IO handlers
  setupMetricsSocket(io);
  setupLoggerSocket(io);
  setupClientTracker(io);

  // Initialize Vite dev server
  try {
    const frontendPath = path.resolve(__dirname, "../frontend"); // Ensure path is correct
    console.log("Frontend Path:", frontendPath);

    const vite = await createViteServer({
      root: frontendPath, // Set your frontend directory
      server: {
        middlewareMode: true, // Enable middleware mode to work with Express
      },
    });

    // Use Vite's middleware in the Express app
    app.use(vite.middlewares); // Integrate Vite with Express

    console.log("Vite development server initialized.");
  } catch (error) {
    console.error("Failed to start Vite server:", error);
  }

  console.log("Debug dashboard initialized. Access it at /dashboard");
}

module.exports = initDebugDashboard;
