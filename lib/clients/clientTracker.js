function setupClientTracker(io) {
    let connectedClients = 0;
    let totalConnections = 0;

    // Track connected clients using a Map (or Set) to avoid counting reconnections
    const activeClients = new Map();

    io.on("connection", (socket) => {
        console.log(`A client connected: ${socket.id}`);
        
        // Check if this socket ID is already tracked
        if (!activeClients.has(socket.id)) {
            // This is a new unique connection
            totalConnections++; // Increment total unique connections
        }

        // Add this socket to the active clients map
        activeClients.set(socket.id, socket);
        connectedClients = activeClients.size;

        // Emit updated metrics to all clients
        io.emit("clientMetrics", { connectedClients, totalConnections });

        // Handle client disconnection
        socket.on("disconnect", () => {
            activeClients.delete(socket.id);  // Remove the socket ID when disconnected
            connectedClients = activeClients.size;
            console.log(`Client disconnected: ${socket.id}`);
            io.emit("clientMetrics", { connectedClients, totalConnections });
        });
    });

    // Optionally emit the connected clients every few seconds to keep it live in real-time
    setInterval(() => {
        io.emit("clientMetrics", { connectedClients, totalConnections });
    }, 5000);  // Update every 5 seconds (adjust this interval as needed)
}

module.exports = setupClientTracker;
