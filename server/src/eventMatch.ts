import { Request, Response } from "express";

import { roundObject } from "./helperFuncs";
import { dbTeamData, filterDataByMatch } from "./scout";
import { matchData } from "./tba";

export const eventMatch = async (
  req: Request<
    { type: string; event: string; matchNum: string },
    any,
    any,
    any,
    Record<string, any>
  >,
  res: Response<any, any>
) => {
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
  if (
    typeof dat.alliances === "undefined" ||
    typeof dat.alliances === "undefined" ||
    typeof dat.alliances.red === "undefined" ||
    typeof dat.alliances.blue === "undefined"
  ) {
    res.status(502).json("could not get relevant information from match");
    return;
  }

  let matchPlayed = true;
  if (
    dat.score_breakdown === undefined ||
    dat.score_breakdown === null ||
    typeof dat.score_breakdown.red === "undefined" ||
    typeof dat.score_breakdown.blue === "undefined"
  ) {
    matchPlayed = false;
  }
  const dbDat = await filterDataByMatch(
    event,
    type,
    matchNum as unknown as number,
    setNum as unknown as number
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

    const individualBlueData = matchPlayed ? dat.alliances.blue.team_keys.map(
      (teamIden: string) => {
        let team = parseInt(teamIden.substring(3));
        return mapTeamPercentContribution(team, dat.score_breakdown!.blue);
      }
    ) : [];

    const individualRedData = matchPlayed ? dat.alliances.red.team_keys.map(
      (teamIden: string) => {
        let team = parseInt(teamIden.substring(3));
        return mapTeamPercentContribution(team, dat.score_breakdown!.red);
      }
    ) : [];

  const redExpectedPoint = (
    await Promise.all(
      dat.alliances.red.team_keys.map(async (team_iden: string) => {
        let team = parseInt(team_iden.substring(3));
        const teamInfo = await dbTeamData(team);
        const teamPoints = teamInfo.avgCargoPoints + teamInfo.avgClimb;
        return teamPoints;
      })
    )
  ).reduce((a, b) => a + b);

  const blueExpectedPoint = (
    await Promise.all(
      dat.alliances.blue.team_keys.map(async (team_iden: string) => {
        let team = parseInt(team_iden.substring(3));
        const teamInfo = await dbTeamData(team);
        const teamPoints = teamInfo.avgCargoPoints + teamInfo.avgClimb;
        return teamPoints;
      })
    )
  ).reduce((a, b) => a + b);

  let teamData: any = {};
  individualBlueData
    .concat(individualRedData)
    .forEach((teams: any) => (teamData = { ...teamData, ...teams }));

  res.json({
    teamData,
    blueExpectedPoint,
    redExpectedPoint,
    ...dat,
  });
};
