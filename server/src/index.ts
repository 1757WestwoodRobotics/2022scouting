import "dotenv/config";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { conn } from "./data-source";
import { roundObject } from "./helperFuncs";
import {
  ClimbLevel,
  dbTeamData,
  dbTeamMatchData,
  filterDataByMatch,
  handleScoutUpload,
} from "./scout";
import { eventData, matchData, teamData, teamMatches } from "./tba";

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
      origin: "http://127.0.0.1:8080",
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

  app.get("/team/:team/matches/:event", async (req, res) => {
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
            id: match.comp_level + "_" + match.match_number,
            matchDat,
          };
        })
      )
    );
  });

  app.get("/match/:event/:type/:matchNum", async (req, res) => {
    const { event, type, matchNum } = req.params;
    const dat = await matchData(event, type, matchNum as unknown as number);
    const dbDat = await filterDataByMatch(
      event,
      type,
      matchNum as unknown as number
    );
    console.log(dbDat);
    // woohoo complex match to determine contributions!
    const mapTeamPercentContribution = (team: number, data: any) => {
      const entry = dbDat.filter((entry) => entry.identifier.team == team)[0];
      if (typeof entry === "undefined") {
        return undefined;
      }

      const totalAutoPoints =
        entry.auto_cargo.lower * 2 + entry.auto_cargo.upper * 4;
      const totalTeleopPoints =
        entry.teleop_cargo.upper * 2 + entry.teleop_cargo.lower;
      const totalClimbPoints = entry.climb_level;
      const totalPointsByTeam =
        totalAutoPoints + totalTeleopPoints + totalClimbPoints;

      const totalPercentContributionToMatch =
        totalPointsByTeam / data.totalPoints;
      const totalPercentContributionToAuto = totalAutoPoints / data.autoPoints;
      const totalPercentContributionToTeleop =
        totalTeleopPoints / data.teleopCargoPoints;
      const totalPercentContributionToClimb =
        totalClimbPoints / (data.teleopPoints - data.teleopCargoPoints);

      // I hate this jank
      const teamData = roundObject(
        {
          totalAutoPoints,
          totalTeleopPoints,
          totalClimbPoints,
          totalPointsByTeam,
          autoCargo: entry.auto_cargo,
          teleopCargo: entry.teleop_cargo,
          totalPercentContributionToAuto,
          totalPercentContributionToTeleop,
          totalPercentContributionToClimb,
          totalPercentContributionToMatch,
        },
        3
      );
      let returnData: any = {};
      returnData[team] = teamData;
      return returnData;
    };

    const individualBlueData = dat.alliances.blue.team_keys.map(
      (teamIden: string) => {
        let team = parseInt(teamIden.substring(3));
        return mapTeamPercentContribution(team, dat.score_breakdown.blue);
      }
    );

    const individualRedData = dat.alliances.red.team_keys.map(
      (teamIden: string) => {
        let team = parseInt(teamIden.substring(3));
        return mapTeamPercentContribution(team, dat.score_breakdown.red);
      }
    );

    let teamData: any = {};
    individualBlueData
      .concat(individualRedData)
      .forEach((teams: any) => (teamData = { ...teamData, ...teams }));

    res.json({
      teamData,
      ...dat,
    });
  });

  app.get("/event/:event", async (req, res) => {
    const { event } = req.params;
    const eventTeams: number[] = (await eventData(event)).map(
      (team: any) => team.team_number
    );

    const teamPromises = eventTeams.map(
      async (team) => await teamFullData(team)
    );

    const teamData: FullTeamData[] = [];
    for (let i = 0; i < teamPromises.length; i++) {
      teamData[i] = await teamPromises[i];
    }
    teamData.sort((a, b) => a.team_number - b.team_number);

    res.json(teamData);
  });
  app.get("/event/:event/simple", async (req, res) => {
    const { event } = req.params;
    const eventTeams: number[] = (await eventData(event)).map(
      (team: any) => team.team_number
    );
    res.json(eventTeams);
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
