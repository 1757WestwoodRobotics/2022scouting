import express from "express";
import "dotenv/config";

import { teamData, matchData } from "./tba";
import { conn } from "./data-source";
import bodyParser from "body-parser";
import { handleScoutUpload } from "./scout";

const main = async () => {
  const app = express();
  const port = 1757;
  app.listen(port, () => {
    console.log(`starting app on ${port}`);
  });
  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.send("You weren't supposed to see this!");
  });

  app.get("/team/:team", async (req, res) => {
    const dat = await teamData(req.params.team as unknown as number);
    console.log(dat);
    res.json(dat);
  });

  app.get("/match/:event/:type/:matchNum", async (req, res) => {
    const { event, type, matchNum } = req.params;
    const dat = await matchData(event, type, matchNum as unknown as number);
    res.json(dat);
  });

  app.post("/scout/upload", handleScoutUpload);
};

conn
  .initialize()
  .then(() => {
    main().catch((err) => {
      console.error(err);
    });
  })
  .catch((err) => console.error(err));
