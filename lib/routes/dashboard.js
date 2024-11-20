const express = require("express");
const path = require("path");

function dashboardRoutes(app) {
  app.use("/dashboard", express.static(path.join(__dirname, "../../public")));
}

module.exports = dashboardRoutes;
