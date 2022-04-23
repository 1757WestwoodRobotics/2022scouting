import fetch from "node-fetch";
const api_key = process.env.TBA_KEY as string;

const teamCache: any = {}

export const teamData = async (team: number) => {
  const team_key = "frc" + team;

    if(typeof teamCache[team_key] !== "undefined"){
        console.log(`using cache for team ${team}`)
        return teamCache[team_key]
    }

  const url = `https://www.thebluealliance.com/api/v3/team/${team_key}`;

  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();
    teamCache[team_key] = data
  return data;
};

export const matchData = async (
  event: string,
  matchType: string,
  matchNumber: number
) => {
  const match_id = process.env.YEAR + event + "_" + matchType + matchNumber;

  const url = `https://www.thebluealliance.com/api/v3/match/${match_id}`;

  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();
  return data;
};

export const eventData = async (event: string) => {
  const event_id = process.env.YEAR + event;

  const url = `https://www.thebluealliance.com/api/v3/event/${event_id}/teams/simple`;
  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();
  return data;
};
