import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const RequestLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("requestLog", (log) => {
      setLogs((prevLogs) => [log, ...prevLogs]);
    });

    return () => socket.off("requestLog");
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", minWidth: "200px" }}>
      <h3>Request Logs</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {logs.map((log, index) => (
          <p key={index}>
            [{log.timestamp}] {log.method} {log.url}
          </p>
        ))}
      </div>
    </div>
  );
};

export default RequestLogs;
