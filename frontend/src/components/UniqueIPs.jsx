import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const UniqueIPs = () => {
  const [uniqueIPs, setUniqueIPs] = useState([]);
  const [ipCount, setIpCount] = useState(0);

  useEffect(() => {
    socket.on("uniqueIPs", (data) => {
      if (data && Array.isArray(data.uniqueIPs)) {
        setUniqueIPs(data.uniqueIPs);
        setIpCount(data.uniqueIPs.length);
      }
    });

    return () => socket.off("uniqueIPs");
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", minWidth: "200px" }}>
      <h3>Unique IPs</h3>
      <p>Total Unique IPs: {ipCount}</p>
      <ul style={{ maxHeight: "100px", overflowY: "auto" }}>
        {uniqueIPs.map((ip, index) => (
          <li key={index}>{ip}</li>
        ))}
      </ul>
    </div>
  );
};

export default UniqueIPs;
