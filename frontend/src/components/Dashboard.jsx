import React from "react";
import ClientMetrics from "./ClientMetrics";
import UniqueIPs from "./UniqueIPs";
import PerformanceMetrics from "./PerformanceMetrics";
import RequestLogs from "./RequestLogs";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      <ClientMetrics />
      <UniqueIPs />
      <PerformanceMetrics />
      <RequestLogs />
    </div>
  );
};

export default Dashboard;
