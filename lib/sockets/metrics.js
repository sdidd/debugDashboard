function setupMetricsSocket(io) {  io.on("connection", (socket) => {
    console.log("Client connected for metrics");
    socket.on("disconnect", () => {
      console.log("Client disconnected from metrics");
    });
  });
}

module.exports = setupMetricsSocket;
