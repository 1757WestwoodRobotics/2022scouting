import { readFileSync } from "fs";
import path, { dirname } from "path";
import { API, Match, Match_Simple, Media, Team_Simple } from "tba-api-client";
const api_key = process.env.TBA_KEY as string;

const client = new API(api_key);

const extraComps = JSON.parse(
  String(
    readFileSync(
      path.join(dirname(__filename), "..", "..", "extraCompInfo.json")
    )
  )
);

let teamCache: any = {};
let matchCache: any = {};
let eventCache: any = {};
let teamMatchCache: any = {};
let eventMatchCache: any = {};

export const teamData = async (team: number) => {
  const team_key = "frc" + team;

  if (typeof teamCache[team_key] !== "undefined") {
    console.log(`using cache for team ${team}`);
    return teamCache[team_key];
  }
  let teamData = await client.Team(team_key);
  let year = parseInt(process.env.YEAR as unknown as string) as number;

  // @ts-ignore
  let mediaData: Media[] = await client.TeamMedia(
    team_key,
    // @ts-ignore
    year,
    undefined,
    false
  );

  let av = mediaData?.filter((a: any) => (a.type = "avatar"));
  if (av && av.length > 0) {
    av = av[0].details?.base64Image;
  }

  const returnDat = { ...teamData, avatar: av };
  teamCache[team_key] = returnDat;
  return returnDat;
};
export const removeCache = () => {
  teamCache = {};
  matchCache = {};
  eventCache = {};
  teamMatchCache = {};
  eventMatchCache = {};
};

export const teamMatches = async (
  team: number,
  event: string
): Promise<Match[]> => {
  const team_key = "frc" + team;
  const event_id = process.env.YEAR + event;
  if (typeof teamMatchCache[team_key + event_id] !== "undefined") {
    console.log(`using cache for team ${team}, event ${event}`);
    return teamMatchCache[team_key + event_id];
  }
  let data;
  if (Object.keys(extraComps).includes(event)) {
    // @ts-ignore
    data = extraComps[event]["matches"]["qm"]
      .map((a: number[], idx: number) => [a, idx])
      .filter((a: [number[], number]) => a[0].includes(parseInt(team as unknown as string)))
      .map((t: [number[], number]) => {
        return {
          key: `${event_id}_qm${t[1] + 1}`,
          comp_level: "qm",
          set_number: "1",
          match_number: t[1] + 1,
          alliances: {
            blue: {
              team_keys: [
                teamToStr(t[0][0]),
                teamToStr(t[0][1]),
                teamToStr(t[0][2]),
              ],
            },
            red: {
              team_keys: [
                teamToStr(t[0][3]),
                teamToStr(t[0][4]),
                teamToStr(t[0][5]),
              ],
            },
          },
        };
      });
  } else {
    data = await client.TeamEventMatchesSimple(team_key, event_id);
  }
  teamMatchCache[team_key] = data;
  return data;
};

export const matchData = async (
  event: string,
  matchType: string,
  matchNumber: number,
  setNumber?: number
): Promise<Match> => {
  if (typeof matchCache[`${event}${matchType}${matchNumber}`] !== "undefined") {
    console.log(`using cache for match`);
    return matchCache[`${event}${matchType}${matchNumber}`];
  }
  const match_id =
    process.env.YEAR +
    event +
    "_" +
    matchType +
    (setNumber ? setNumber + "m" + matchNumber : matchNumber);

  let data = await client.Match(match_id);

  matchCache[`${event}${matchType}${matchNumber}`] = data;
  return data;
};

const teamToStr = (team: number) => {
  return `frc${team}`;
};

export const eventMatches = async (event: string): Promise<Match_Simple[]> => {
  const event_id = process.env.YEAR + event;

  if (typeof eventMatchCache[event_id] !== "undefined") {
    console.log(`using cache for event ${event}`);
    return eventMatchCache[event_id];
  }

  let data;
  if (Object.keys(extraComps).includes(event)) {
    // @ts-ignore
    data = extraComps[event]["matches"]["qm"].map(
      (t: number[], idx: number) => {
        return {
          key: `${event_id}_qm${idx + 1}`,
          comp_level: "qm",
          set_number: "1",
          match_number: idx + 1,
          alliances: {
            blue: {
              team_keys: [teamToStr(t[0]), teamToStr(t[1]), teamToStr(t[2])],
            },
            red: {
              team_keys: [teamToStr(t[3]), teamToStr(t[4]), teamToStr(t[5])],
            },
          },
        };
      }
    );
  } else {
    data = await client.EventMatchesSimple(event_id);
  }
  eventMatchCache[event_id] = data;

  return data;
};

export const eventData = async (event: string): Promise<Team_Simple[]> => {
  const event_id = process.env.YEAR + event;

  if (typeof eventCache[event_id] !== "undefined") {
    console.log(`using cache for event ${event}`);
    return eventCache[event_id];
  }

  let data;
  if (Object.keys(extraComps).includes(event)) {
    // @ts-ignore
    data = extraComps[event]["teams"].map((t: number) => {
      return { key: `frc${t}`, team_number: t, name: "a" };
    });
  } else {
    data = await client.EventTeamsSimple(event_id);
  }
  eventCache[event_id] = data;
  return data;
};
