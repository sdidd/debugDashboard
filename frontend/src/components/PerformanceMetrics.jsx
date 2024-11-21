import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: { heapUsed: 0, heapTotal: 0 },
    uptime: 0,
  });

  useEffect(() => {
    socket.on("performanceMetrics", (data) => {
      setMetrics(data);
    });

    return () => socket.off("performanceMetrics");
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", minWidth: "200px" }}>
      <h3>Performance Metrics</h3>
      <p>CPU Usage: {(metrics.cpuUsage * 100).toFixed(2)}%</p>
      <p>
        Memory Usage: {(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB /{" "}
        {(metrics.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
      </p>
      <p>Uptime: {metrics.uptime.toFixed(2)} seconds</p>
    </div>
  );
};

export default PerformanceMetrics;
