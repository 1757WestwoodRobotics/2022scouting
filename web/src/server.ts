import sirv from "sirv";
import express, { Router } from "express";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

export const start = (app) => {
  const rout = Router();
  if (app === undefined) {
    app = express();
    app.listen(PORT);
  }
  app.use(
    // '/2022',
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  );
};

if (module.parent) {
  start(undefined);
}
