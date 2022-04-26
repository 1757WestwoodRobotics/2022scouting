import fetch from "node-fetch";
const api_key = process.env.TBA_KEY as string;

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

  const url = `https://www.thebluealliance.com/api/v3/team/${team_key}`;

  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let teamData = await response.json();

  const url2 = `https://www.thebluealliance.com/api/v3/team/${team_key}/media/${process.env.YEAR}`;
  const response2 = await fetch(url2, {
    headers: { "X-TBA-Auth-Key": api_key },
  });
  let mediaData = await response2.json();
  let av = undefined;
  try {
    av = mediaData.filter((a: any) => (a.type = "avatar"))[0].details
      .base64Image;
  } catch (e) {}

  const returnDat = { ...teamData, avatar: av };
  teamCache[team_key] = returnDat;
  return returnDat;
};

export const teamMatches = async (team: number, event: string) => {
  const team_key = "frc" + team;
  const event_id = process.env.YEAR + event;
  if (typeof teamMatchCache[team_key + event_id] !== "undefined") {
    console.log(`using cache for team ${team}, event ${event}`);
    return teamMatchCache[team_key + event_id];
  }
  const url = `https://www.thebluealliance.com/api/v3/team/${team_key}/event/${event_id}/matches/simple`;

  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();
  teamMatchCache[team_key] = data;
  return data;
};

export const matchData = async (
  event: string,
  matchType: string,
  matchNumber: number,
  setNumber?: number
) => {
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

  const url = `https://www.thebluealliance.com/api/v3/match/${match_id}`;

  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();

  matchCache[`${event}${matchType}${matchNumber}`] = data;
  return data;
};

export const eventMatches = async (event: string) => {
  const event_id = process.env.YEAR + event;

  if (typeof eventMatchCache[event_id] !== "undefined") {
    console.log(`using cache for event ${event}`);
    return eventMatchCache[event_id];
  }

  const url = `https://www.thebluealliance.com/api/v3/event/${event_id}/matches/simple`;
  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();
  eventMatchCache[event_id] = data;
  return data;
};

export const eventData = async (event: string) => {
  const event_id = process.env.YEAR + event;

  if (typeof eventCache[event_id] !== "undefined") {
    console.log(`using cache for event ${event}`);
    return eventCache[event_id];
  }

  const url = `https://www.thebluealliance.com/api/v3/event/${event_id}/teams/simple`;
  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();
  eventCache[event_id] = data;
  return data;
};
