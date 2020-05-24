// import env
import "dotenv/config";
// initialize database
import "./utils/database";

import server from "./server";
import cluster from "cluster";
import { cpus } from "os";

const numCPUs = cpus().length;

if (cluster.isMaster) {
  cluster.setupMaster({ silent: true });

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.info(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // initialize server
  server()
  
}
