import "dotenv-safe/config";

import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

import { conn } from "./data-source";
import { eventMatch } from "./eventMatch";
import { handleNotes } from "./notes";
import { dbTeamMatchData, handleScoutUpload } from "./scout";
import { removeCache, teamMatches } from "./tba";
import { eventHandler, eventMatchHandler, eventSimple } from "./event";
import { teamFullData } from "./teamData";

const handleErr = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json({
    msg: err.message,
    success: false,
  });
};

export const main = async (app: Express | undefined = undefined) => {
  if (app === undefined) {
    app = express();
    const port = 1757;
    app.listen(port, () => {
      console.log(`starting app on ${port}`);
    });
  } else {
    app = app as Express;
  }

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://127.0.0.1:8080",
      credentials: true,
    })
  );
  app.use(bodyParser.json());
  app.use(handleErr);

  app.get("/team/:team", async (req, res) => {
    if ([req.params.team].includes("undefined")) {
      res.status(400).json("cannot send UNDEFINED value");
      return;
    }
    const teamNum = req.params.team as unknown as number;
    const teamDat = await teamFullData(
      teamNum,
      req.query.l ? parseInt(req.query.l as string) : undefined
    );
    res.json(teamDat);
  });

  app.get("/team/:team/matches/:event", async (req, res) => {
    if ([req.params.team, req.params.event].includes("undefined")) {
      res.status(400).json("cannot send UNDEFINED value");
      return;
    }
    const teamNum = req.params.team as unknown as number;
    const matches = await teamMatches(teamNum, req.params.event);
    res.json(
      await Promise.all(
        matches.map(async (match: any) => {
          const matchDat = await dbTeamMatchData(
            teamNum,
            req.params.event,
            match.comp_level,
            match.match_number
          );
          return {
            id:
              match.comp_level +
              "_" +
              (match.comp_level != "qm" ? match.set_number + "m" : "") +
              match.match_number,
            matchDat,
          };
        })
      )
    );
  });

  app.post("/refresh", async (_req, res, next) => {
    try {
      removeCache();
      console.log("Refreshing");
      res.json("OK");
    } catch (err) {
      next(err);
    }
  });

  app.get("/match/:event/:type/:matchNum", eventMatch);

  app.get("/event/:event", eventHandler);
  app.get("/event/:event/simple", eventSimple);
  app.get("/event/:event/matches", eventMatchHandler);

  app.post("/scout/upload", handleScoutUpload);
  app.post("/scout/notes", handleNotes);
};

export const start = (app: Express | undefined = undefined) => {
  conn
    .initialize()
    .then(() => {
      main(app).catch((err) => {
        console.error(err);
      });
    })
    .catch((err) => console.error(err));
};

if (typeof require !== "undefined" && require.main === module) {
  start();
}
