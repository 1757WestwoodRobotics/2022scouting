import { fetchNotes } from "./notes";
import { ChargeStation, dbTeamData, teamNotes } from "./scout";
import { getTeamEventEPA } from "./statbotics";
import { teamData } from "./tba";

export type FullTeamData = {
  nickname: string;
  team_number: number;
  rookieYear: number;
  city: string;
  avatar: string | undefined;
  avgTeleopGP: number;
  avgAutoGP: number;
  teleopConsistency: number;
  autoConsistency: number;
  highestAutoDock: ChargeStation;
  highestTeleopDock: ChargeStation;
  avgAutoDock: number;
  avgTeleopDock: number;
  avgTopGP: number;
  avgMidGP: number;
  avgHybridGP: number;
  avgGPPoints: number;
  avgGPCycledTeleop: number;
  sd: number;
  conePreference: number;
  cubePreference: number;
  mobilityConsistency: number;
  epa?: number;
};

export const teamFullData = async (
  teamNum: number,
  limit: number | undefined = undefined,
  compLimit: string | undefined = undefined
): Promise<FullTeamData> => {
  const teamDat = await teamData(teamNum);
  const dbDat = await dbTeamData(teamNum, limit, compLimit);
  const notes = await teamNotes(teamNum);
  const imp_notes = await fetchNotes(teamNum);
  let epa = undefined;
  if (typeof compLimit === "string") {
    epa = await getTeamEventEPA(compLimit, teamNum).catch();
  }

  const fullData = {
    nickname: teamDat.nickname,
    team_number: teamDat.team_number,
    rookieYear: teamDat.rookie_year,
    city: teamDat.city,
    avatar: teamDat.avatar,
    ...dbDat,
    notes,
    imp_notes,
    epa,
  };
  return fullData;
};
