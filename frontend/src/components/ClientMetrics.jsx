import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const ClientMetrics = () => {
  const [metrics, setMetrics] = useState({ connectedClients: 0, totalConnections: 0 });

  useEffect(() => {
    socket.on("clientMetrics", (data) => setMetrics(data));
    return () => socket.off("clientMetrics");
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", minWidth: "200px" }}>
      <h3>Client Metrics</h3>
      <p>Connected Clients: {metrics.connectedClients}</p>
      <p>Total Connections: {metrics.totalConnections}</p>
    </div>
  );
};

export default ClientMetrics;
