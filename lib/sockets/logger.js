function setupLoggerSocket(io) {
    io.on("connection", (socket) => {
      console.log("Client connected for logs");
      socket.on("disconnect", () => {
        console.log("Client disconnected from logs");
      });
    });
  }
  
  module.exports = setupLoggerSocket;
  