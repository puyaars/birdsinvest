import express from "express";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import sessionStore from "./utils/sessionStore";
import next from "next";

import passport from "./utils/auth";

export default async () => {
  const nextApp = next({ dev: process.env.ENVIRONMENT !== "production" });
  const handle = nextApp.getRequestHandler()

  await nextApp.prepare();

  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(compression());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ extended: true }));

  app.use(
    session({
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure:
          process.env.ENVIRONMENT !== "development" &&
          process.env.ENVIRONMENT !== "test",
        maxAge: 2419200000,
      },
      secret: process.env.SECRET_KEY_BASE,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // app.get("/", (req, res) => {
  //   res.send("Hello World!");
  // });

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(process.env.PORT, () =>
    console.info(`Example app listening on port ${process.env.PORT}!`)
  );
};
