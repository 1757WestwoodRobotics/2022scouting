import "dotenv-safe/config";

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
  teamNotes,
} from "./scout";
import {
  eventData,
  eventMatches,
  matchData,
  teamData,
  teamMatches,
} from "./tba";

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
    const notes = await teamNotes(teamNum);

  const fullData = {
    nickname: teamDat.nickname,
    team_number: teamDat.team_number,
    rookieYear: teamDat.rookie_year,
    city: teamDat.city,
    ...dbDat,
        notes
  };
  return fullData;
};

const main = async () => {
  const app = express();
  const port = 1757;

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://127.0.0.1:8080",
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
    if ([req.params.team].includes("undefined")) {
      res.status(400).json("cannot send UNDEFINED value");
      return;
    }
    const teamNum = req.params.team as unknown as number;
    const teamDat = await teamFullData(teamNum);
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

  app.get("/match/:event/:type/:matchNum", async (req, res) => {
    if (
      [req.params.type, req.params.event, req.params.matchNum].includes(
        "undefined"
      )
    ) {
      res.status(400).json("cannot send UNDEFINED value");
      return;
    }
    let { event, type, matchNum } = req.params;
    let setNum = undefined;
    if (matchNum.includes("m")) {
      const nums = matchNum.split("m");
      matchNum = nums[1];
      setNum = nums[0];
    }
    const dat = await matchData(
      event,
      type,
      matchNum as unknown as number,
      setNum as unknown as number
    );
    const dbDat = await filterDataByMatch(
      event,
      type,
      matchNum as unknown as number
    );
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
          notes: entry.notes,
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
    if (req.params.event === undefined) {
      res.status(400).json("cannot send UNDEFINED value");
      return;
    }
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
    if (event === undefined) {
      res.status(400).json("cannot send UNDEFINED value");
      return;
    }
    const eventTeams: number[] = (await eventData(event)).map(
      (team: any) => team.team_number
    );
    res.json(eventTeams);
  });
  app.get("/event/:event/matches", async (req, res) => {
    const { event } = req.params;
    if (event === undefined) {
      res.status(400).json("cannot send UNDEFINED value");
      return;
    }
    const matches = (await eventMatches(event)).map((match: any) => {
      return {
        match_type: match.comp_level,
        match_number: match.match_number,
        set_number: match.set_number,
        blue: match.alliances.blue.team_keys.map((a: string) => a.substring(3)),
        red: match.alliances.red.team_keys.map((a: string) => a.substring(3)),
      };
    });
    res.json(matches);
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
