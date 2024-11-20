const socket = io("http://localhost:3000", {transports: ['websocket']}); // Ensure the URL matches your server's

socket.on("connect_error", (err) => {
    console.error("Connection failed: ", err.message);
});

// Update client metrics
socket.on("clientMetrics", (data) => {
  document.getElementById("clientMetrics").innerText =
    `Connected Clients: ${data.connectedClients}, Total Connections: ${data.totalConnections}`;
});

socket.on("uniqueIPs", (data) => {
  console.log("Received uniqueIPs:", data);

  // Safely handle cases where data.uniqueIPs is undefined or not an array
  if (data && Array.isArray(data.uniqueIPs)) {
      document.getElementById("uniqueIPsList").innerText = `Unique IPs: ${data.uniqueIPs.join(", ")}`;
      document.getElementById("uniqueIPscount").innerText = `${data.count}`;
  } else {
      console.error("No valid IP data received", data);
      document.getElementById("uniqueIPsList").innerText = "Error: Could not fetch unique IPs.";
  }
});

// Update request count
socket.on("requestCount", (data) => {
  document.getElementById("requestCount").innerText = `Total Requests: ${data.totalRequests}`;
});

// Update performance metrics
socket.on("performanceMetrics", (data) => {
  document.getElementById("performanceMetrics").innerText =
    `CPU Usage: ${(data.cpuUsage * 100).toFixed(2)}%, Memory Usage: ${(data.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB, Uptime: ${data.uptime.toFixed(2)}s`;
});

// Update request logs
socket.on("requestLog", (log) => {
  const logContainer = document.getElementById("requestLogs");
  const logEntry = document.createElement("p");
  logEntry.innerText = `[${log.timestamp}] ${log.method} ${log.url}`;
  logContainer.prepend(logEntry); // Add new logs at the top
});
