const path = require('path');

module.exports = {
  apps: [
    {
      name: "fusion-starter",
      script: "./dist/server/node-build.mjs",
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
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_file: "./logs/pm2-combined.log",
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
