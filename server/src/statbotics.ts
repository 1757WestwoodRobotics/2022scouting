import { get } from "https";

export type MatchPrediction = {
  winner: string;
  difference: number;
};

export const getPredictedWinner = async (
  event: string,
  matchType: string,
  matchNumber: number,
  setNumber?: number
): Promise<MatchPrediction> => {
  const match_id =
    process.env.YEAR +
    event +
    "_" +
    matchType +
    (setNumber ? setNumber + "m" + matchNumber : matchNumber);

  return new Promise((resolve, reject) => {
    let opt = {
      protocol: "https:",
      hostname: "api.statbotics.io",
      path: "/v2/match/" + match_id,
      headers: {
        accept: "application/json",
      },
    };
    get(opt, (res) => {
      res.setEncoding("utf8");
      let raw = "";
      res.on("data", (m) => {
        raw += m;
      });
      res.on("error", (e) => {
        reject(e);
      });
      res.on("end", () => {
        if (res.statusCode === 404) reject(JSON.parse(raw));
        else {
          if (typeof res.statusCode != "number") {
            reject();
          }
          if ((res.statusCode as number) >= 400) return reject(raw);
          const dat = JSON.parse(raw);
          resolve({
            winner: dat.epa_winner,
            difference: Math.abs(dat.red_epa_sum - dat.blue_epa_sum),
          });
        }
      });
    });
  });
};



export const getTeamEventEPA = async (
  event: string,
  team: number,
): Promise<number> => {
  const event_id =
    process.env.YEAR +
    event 

  return new Promise((resolve, reject) => {
    let opt = {
      protocol: "https:",
      hostname: "api.statbotics.io",
      path: `/v2/team_event/${team}/${event_id}`,
      headers: {
        accept: "application/json",
      },
    };
    get(opt, (res) => {
      res.setEncoding("utf8");
      let raw = "";
      res.on("data", (m) => {
        raw += m;
      });
      res.on("error", (e) => {
        reject(e);
      });
      res.on("end", () => {
        if (res.statusCode === 404) reject(JSON.parse(raw));
        else {
          if (typeof res.statusCode != "number") {
            reject();
          }
          if ((res.statusCode as number) >= 400) return reject(raw);
          const dat = JSON.parse(raw);
          resolve(dat.epa_end);
        }
      });
    });
  });
};


