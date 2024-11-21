// routes/dashboard.js
const express = require("express");

function dashboardRoutes(app) {
  // Redirect to Vite's dev server on port 3001
  app.use("/dashboard", (req, res) => {
    res.redirect("http://localhost:3001"); // Redirect to Vite server
  });
}

module.exports = dashboardRoutes;
