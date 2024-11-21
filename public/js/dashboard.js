const socket = io("http://localhost:3000", { transports: ["websocket"] });

// Charts setup
const cpuChartCtx = document.getElementById("cpuChart").getContext("2d");
const memoryChartCtx = document.getElementById("memoryChart").getContext("2d");

const cpuChart = new Chart(cpuChartCtx, {
  type: "line",
  data: {
    labels: [], // Timestamps
    datasets: [
      {
        label: "CPU Usage (%)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Usage (%)" }, beginAtZero: true },
    },
  },
});

const memoryChart = new Chart(memoryChartCtx, {
  type: "line",
  data: {
    labels: [], // Timestamps
    datasets: [
      {
        label: "Memory Usage (MB)",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Memory (MB)" }, beginAtZero: true },
    },
  },
});

// Update metrics
socket.on("clientMetrics", (data) => {
  document.getElementById("clientMetrics").innerText =
    `Connected Clients: ${data.connectedClients}, Total Connections: ${data.totalConnections}`;
});

socket.on("uniqueIPs", (data) => {
  const ipList = document.getElementById("uniqueIPsList");
  ipList.innerHTML = data.uniqueIPs.map((ip) => `<li>${ip}</li>`).join("");
  document.getElementById("uniqueIPscount").innerText = data.count;
});

socket.on("requestCount", (data) => {
  document.getElementById("requestCount").innerText = `Total Requests: ${data.totalRequests}`;
});

socket.on("performanceMetrics", (data) => {
  const timestamp = new Date().toLocaleTimeString();
  cpuChart.data.labels.push(timestamp);
  memoryChart.data.labels.push(timestamp);

  cpuChart.data.datasets[0].data.push((data.cpuUsage * 100).toFixed(2));
  memoryChart.data.datasets[0].data.push((data.memoryUsage.heapUsed / 1024 / 1024).toFixed(2));

  cpuChart.update();
  memoryChart.update();

  document.getElementById("performanceMetrics").innerText =
    `CPU Usage: ${(data.cpuUsage * 100).toFixed(2)}%, Memory Usage: ${(data.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB, Uptime: ${data.uptime.toFixed(2)}s`;
});

socket.on("requestLog", (log) => {
  const logContainer = document.getElementById("requestLogs");
  const logEntry = document.createElement("p");
  logEntry.innerText = `[${log.timestamp}] ${log.method} ${log.url}`;
  logContainer.prepend(logEntry);
});

// Enable draggable and resizable widgets
interact(".movable")
  .draggable({
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      },
    },
  })
  .resizable({
    edges: { top: true, left: true, bottom: true, right: true },
    listeners: {
      move(event) {
        const target = event.target;
        let { width, height } = event.rect;

        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
      },
    },
  });
