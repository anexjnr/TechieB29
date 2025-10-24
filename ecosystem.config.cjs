const fs = require("fs");
const path = require("path");

// Prefer mjs build, fall back to .js or main.js if present
const candidates = [
  path.join(__dirname, "dist", "server", "node-build.mjs"),
  path.join(__dirname, "dist", "server", "node-build.js"),
  path.join(__dirname, "dist", "server", "main.js"),
];
let scriptPath = candidates.find((p) => fs.existsSync(p));
if (!scriptPath) {
  // keep the original path so PM2 error is clear
  scriptPath = path.join(__dirname, "dist", "server", "node-build.mjs");
}

module.exports = {
  apps: [
    {
      name: "fusion-starter",
      script: scriptPath,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      error_file: path.join(__dirname, "logs", "pm2-error.log"),
      out_file: path.join(__dirname, "logs", "pm2-out.log"),
      log_file: path.join(__dirname, "logs", "pm2-combined.log"),
      time: true,
      watch: false,
      ignore_watch: ["node_modules", "logs", "dist/spa"],
      max_memory_restart: "500M",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      listen_timeout: 5000,
      kill_timeout: 5000,
    },
  ],
};
