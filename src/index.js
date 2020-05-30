// import env
import "dotenv/config";
// initialize database
import "./utils/database";

import server from "./server";

// initialize server
server().catch(console.error);
