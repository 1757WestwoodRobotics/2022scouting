import fetch from "node-fetch";
const api_key = process.env.TBA_KEY;

export const teamData = async (team: number) => {
  const team_key = "frc" + team;

  const url = `https://www.thebluealliance.com/api/v3/team/${team_key}`;

  const response = await fetch(url, { headers: { "X-TBA-Auth-Key": api_key } });
  let data = await response.json();
  console.log(data);
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
  console.log(data);
  return data;
};
