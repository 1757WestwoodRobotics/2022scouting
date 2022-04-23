import express from "express";
import "dotenv/config";

import { teamData, matchData, eventData } from "./tba";
import { conn } from "./data-source";
import bodyParser from "body-parser";
import { ClimbLevel, dbTeamData, handleScoutUpload } from "./scout";

import cors from "cors";

type FullTeamData = {
  nickname: string;
  team_number: number;
  rookieYear: number;
  city: string;
  avgTeleopCargo: number;
  avgAutoCargo: number;
  teleopConsistency: number;
  autoConsistency: number;
  highestClimb: ClimbLevel;
  avgClimb: number;
  avgUpperCargo: number;
  avgLowerCargo: number;
  avgCargoPoints: number;
};

const teamFullData = async (teamNum: number): Promise<FullTeamData> => {
  const teamDat = await teamData(teamNum);
  const dbDat = await dbTeamData(teamNum);

  const fullData = {
    nickname: teamDat.nickname,
    team_number: teamDat.team_number,
    rookieYear: teamDat.rookie_year,
    city: teamDat.city,
    ...dbDat,
  };
  return fullData;
};

const main = async () => {
  const app = express();
  const port = 1757;

  app.use(
    cors({
      origin: "http://127.0.0.1:3000",
      credentials: true,
    })
  );
  app.listen(port, () => {
    console.log(`starting app on ${port}`);
  });
  app.use(bodyParser.json());

  app.get("/", (_, res) => {
    res.send("You weren't supposed to see this!");
  });

  app.get("/team/:team", async (req, res) => {
    const teamNum = req.params.team as unknown as number;
    const teamDat = await teamFullData(teamNum);
    res.json(teamDat);
  });

  app.get("/match/:event/:type/:matchNum", async (req, res) => {
    const { event, type, matchNum } = req.params;
    const dat = await matchData(event, type, matchNum as unknown as number);
    res.json(dat);
  });

  app.get("/event/:event", async (req, res) => {
    const { event } = req.params;
    const eventTeams: number[] = (await eventData(event)).map(
      (team: any) => team.team_number
    );

        const teamPromises = eventTeams.map(async (team) => (await teamFullData(team)))

        const teamData: FullTeamData[] = []
        for(let i = 0; i<teamPromises.length; i++){
            teamData[i] = await teamPromises[i]
        }

    res.json(teamData);
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
