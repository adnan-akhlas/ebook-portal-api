module.exports = {
  apps: [
    {
      name: "eBook Portal api",
      script: "./dist/server.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
