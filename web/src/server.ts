import sirv from "sirv";
import express, { Router } from "express";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

export const start = (app) => {
  const rout = Router();
  if (app === undefined) {
    app = express().listen(PORT);
    app.use("/", rout);
  } else {
    app.use("/2022", rout);
  }
  rout.use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware(),
  );
};
