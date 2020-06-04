module.exports = {
  apps: [
    {
      script: "lib/index.js",
      name: "birdinv",
      watch: "lib",
      instances: "max",
      exec_mode: "cluster",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      env: {
        ENVIRONMENT: "production",
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: "SSH_USERNAME",
  //     host: "SSH_HOSTMACHINE",
  //     ref: "origin/master",
  //     repo: "GIT_REPOSITORY",
  //     path: "DESTINATION_PATH",
  //     "pre-deploy-local": "",
  //     "post-deploy":
  //       "npm install && pm2 reload ecosystem.config.js --env production",
  //     "pre-setup": "",
  //   },
  // },
};
