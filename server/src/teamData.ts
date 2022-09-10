import { fetchNotes } from "./notes";
import { ClimbLevel, dbTeamData, teamNotes } from "./scout";
import { teamData } from "./tba";

export type FullTeamData = {
  nickname: string;
  team_number: number;
  rookieYear: number;
  city: string;
  avatar: string | undefined;
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

export const teamFullData = async (
  teamNum: number,
  limit: number | undefined = undefined,
  compLimit: string | undefined = undefined
): Promise<FullTeamData> => {
  const teamDat = await teamData(teamNum);
  const dbDat = await dbTeamData(teamNum, limit, compLimit);
  const notes = await teamNotes(teamNum);
  const imp_notes = await fetchNotes(teamNum);

  const fullData = {
    nickname: teamDat.nickname,
    team_number: teamDat.team_number,
    rookieYear: teamDat.rookie_year,
    city: teamDat.city,
    avatar: teamDat.avatar,
    ...dbDat,
    notes,
    imp_notes,
  };
  return fullData;
};
