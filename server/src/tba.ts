import { API, Match, Match_Simple, Team_Simple } from "tba-api-client";
const api_key = process.env.TBA_KEY as string;

const client = new API(api_key);

const teamCache: any = {};
const matchCache: any = {};
const eventCache: any = {};
const teamMatchCache: any = {};
const eventMatchCache: any = {};

export const teamData = async (team: number) => {
  const team_key = "frc" + team;

  if (typeof teamCache[team_key] !== "undefined") {
    console.log(`using cache for team ${team}`);
    return teamCache[team_key];
  }
  let teamData = await client.Team(team_key);
  let mediaData = await client.TeamMedia(
    team_key,
    process.env.YEAR as unknown as string
  );

  let av = mediaData.filter((a: any) => (a.type = "avatar"));
  av = av[0].details?.base64Image;

  const returnDat = { ...teamData, avatar: av };
  teamCache[team_key] = returnDat;
  return returnDat;
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
  let data = await client.TeamEventMatchesSimple(team_key, event_id);
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

export const eventMatches = async (event: string): Promise<Match_Simple[]> => {
  const event_id = process.env.YEAR + event;

  if (typeof eventMatchCache[event_id] !== "undefined") {
    console.log(`using cache for event ${event}`);
    return eventMatchCache[event_id];
  }

  let data = await client.EventMatchesSimple(event_id);
  eventMatchCache[event_id] = data;

  return data;
};

export const eventData = async (event: string): Promise<Team_Simple[]> => {
  const event_id = process.env.YEAR + event;

  if (typeof eventCache[event_id] !== "undefined") {
    console.log(`using cache for event ${event}`);
    return eventCache[event_id];
  }

  let data = await client.EventTeamsSimple(event_id);
  eventCache[event_id] = data;
  return data;
};
