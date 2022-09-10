import { eventData, eventMatches } from "./tba";
import { Request, Response } from "express";
import { teamFullData } from "./teamData";

export const eventHandler = async (
  req: Request<{ event: string }, any, any, any, Record<string, any>>,
  res: Response<any, any>
) => {
  if (req.params.event === undefined) {
    res.status(400).json("cannot send UNDEFINED value");
    return;
  }
  const { event } = req.params;
  const eventTeams: number[] = (await eventData(event)).map(
    (team: any) => team.team_number
  );

  const limit = req.query.l ? parseInt(req.query.l as string) : undefined;
  const compLimit = req.query.c ? event : undefined;

  const teamData = await Promise.all(
    eventTeams.map(async (team) => await teamFullData(team, limit, compLimit))
  );

  teamData.sort((a, b) => a.team_number - b.team_number);

  res.json(teamData);
};

export const eventSimple = async (
  req: Request<{ event: string }, any, any, any, Record<string, any>>,
  res: Response<any, any>
) => {
  const { event } = req.params;
  if (event === undefined) {
    res.status(400).json("cannot send UNDEFINED value");
    return;
  }
  const eventTeams: number[] = (await eventData(event)).map(
    (team: any) => team.team_number
  );
  res.json(eventTeams);
};

export const eventMatchHandler = async (
  req: Request<{ event: string }, any, any, any, Record<string, any>>,
  res: Response<any, any>
) => {
  const { event } = req.params;
  if (event === undefined) {
    res.status(400).json("cannot send UNDEFINED value");
    return;
  }

  let infoCache: any = {};

  const genTeamInfo = (team_keys: string[]): Promise<any>[] => {
    return team_keys.map(async (a: string) => {
      const teamNum = a.substring(3);
      if (typeof infoCache[teamNum] !== "undefined") {
        return infoCache[teamNum];
      }
      const teamInfo = await teamFullData(
        parseInt(teamNum),
        undefined,
        event // always filter for event regarding match estimates
      );
      const ret = {
        id: teamNum,
        name: teamInfo.nickname,
        av: teamInfo.avatar,
        cargo: teamInfo.avgCargoPoints,
        climb: teamInfo.avgClimb,
      };
      infoCache[teamNum] = ret;

      return ret;
    });
  };

  const matches = (
    await Promise.all(
      (
        await eventMatches(event)
      ).map(async (match: any) => {
        return {
          match_type: match.comp_level,
          match_number: match.match_number,
          set_number: match.set_number,
          blue: await Promise.all(genTeamInfo(match.alliances.blue.team_keys)),
          red: await Promise.all(genTeamInfo(match.alliances.red.team_keys)),
        };
      })
    )
  ).sort(
    (a, b) =>
      b.match_number -
      a.match_number +
      b.set_number * 1000 -
      a.set_number * 1000
  );
  res.json(matches);
};
