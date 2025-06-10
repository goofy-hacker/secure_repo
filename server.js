require("dotenv").config();

const express = require("express");
const path = require("path");
const { Pool } = require("pg");

// Import route handlers
const apiRoutes = require("./routes/api");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 3000;

const config = {
  jwtSecret: process.env.jwtSecret, //changed the hardcoded value//
  appName: "VulnerableApp",
  // Database connection pool setup
  dbPool: new Pool({
    connectionString: process.env.DATABASE_URL, // Loaded from .env
  }),
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api", apiRoutes(config));

app.use("/admin", adminRoutes(config));

// --- Default/Catch-all Routes ---
// Simple health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// Root path handler
app.get("/", (req, res) => {
  // Maybe serve an index.html file or just send a welcome message
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.send(`Welcome to ${config.appName}!`);
});

// Basic 404 handler for routes not found
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(500).send("Something broke!");
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`${config.appName} listening at http://localhost:${port}`);

  // Check if critical env vars are loaded
  if (!process.env.DATABASE_URL || !process.env.API_KEY) // use environment based logging levels//
    console.warn("WARN: Missing required environment variables");
  If (process.env.NODE_ENV!== 'production') {
    console.log('Configuration loaded);
                };
