module.exports = {
  apps: [{
    name: 'Authentication Backend Template',
    script: './src/index.js',
    watch: true,
    ignore_watch: ['logs/server.log', 'node_modules', 'logs'],
    time: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    restart_delay: 5000,
    kill_timeout: 1600,
    listen_timeout: 60000,
    max_restarts: 10,
    env_development: {
      APP_NAME: "NodeJS JWT Backend",
      NODE_ENV: "development",
      PORT: "8080",
      MONGO_HOST: "localhost",
    },
    env_docker: {
      APP_NAME: "NodeJS JWT Backend",
      NODE_ENV: "development",
      PORT: "8080",
      MONGO_HOST: "db",
    },
    env_staging: {
      APP_NAME: "NodeJS JWT Backend",
      NODE_ENV: "staging",
      PORT: "8080",
      MONGO_HOST: "localhost",
    },
    env_production: {
      APP_NAME: "NodeJS JWT Backend",
      NODE_ENV: "production",
      PORT: "8080",
      MONGO_HOST: "localhost",
    }
  }],
};
