const express = require("express");
const http = require("http");
const initDebugDashboard = require("./index"); // Import the library

const app = express();
const server = http.createServer(app);

// Initialize the debug dashboard
initDebugDashboard(server, app);

// Sample route
app.get("/", (req, res) => {
  res.send("Hello from your app!");
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
