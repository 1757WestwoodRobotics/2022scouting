import { Request, Response } from "express";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

import { conn } from "./data-source";

type GamepieceData = {
  top: number;
  mid: number;
  hybrid: number;
  miss: number;
};

export enum ChargeStation {
  None = 0,
  Park = 2,
  Docked = 6,
  Engaged = 10,
}

enum MatchType {
  Qualification = "qm",
  Quarterfinal = "qf",
  Semifinal = "sf",
  Final = "f",
}

type DataIdentifier = {
  team: number;
  comp: string;
  comp_level: MatchType;
  match_number: number;
  set_number?: number;
};

type GamepieceScoring = {
  cone: boolean;
  cube: boolean;
};

@Entity()
export class ScoutingData extends BaseEntity {
  @PrimaryColumn({
    type: "jsonb",
  })
  identifier!: DataIdentifier; // comp_TYPENUM_team

  @Column()
  mobility: boolean;

  @Column({
    type: "jsonb",
  })
  auto_gamepiece: GamepieceData;

  @Column({
    type: "jsonb",
  })
  teleop_gamepiece: GamepieceData;

  @Column({
    type: "enum",
    enum: ChargeStation,
    default: ChargeStation.None,
  })
  auto_charge: ChargeStation;

  @Column({
    type: "enum",
    enum: ChargeStation,
    default: ChargeStation.None,
  })
  teleop_charge: ChargeStation;

  @Column({
    type: "jsonb",
  })
  scoring_capabilities: GamepieceScoring;

  @Column() notes: String;
}

export type TeamStats = {
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
};

export const dbTeamMatchData = async (
  team: number,
  event: string,
  matchType: string,
  matchNum: number
) => {
  const dataRepo = conn.getRepository(ScoutingData);

  let dat = await dataRepo
    .createQueryBuilder("data")
    .where("data.identifier->>'team' = :team", {
      team,
    })
    .andWhere("data.identifier->>'comp' = :event", { event })
    .andWhere("data.identifier->>'comp_level' = :matchType", { matchType })
    .andWhere("data.identifier->>'match_number' = :matchNum", { matchNum })
    .getOne();

  return dat;
};

export const dbTeamData = async (
  team: number,
  limit: number = 50,
  compLimit: string | undefined = undefined
): Promise<TeamStats> => {
  const dataRepo = conn.getRepository(ScoutingData);

  let req = dataRepo
    .createQueryBuilder("data")
    .where("data.identifier->>'team' = :team", {
      team,
    })
    .orderBy("data.identifier->>'match_number'", "DESC")
    .take(limit);

  if (compLimit !== undefined) {
    req = req.andWhere("data.identifier->>'comp' = :comp", { comp: compLimit });
  }

  let dat = (await req.getMany()).map((entry: ScoutingData) => {
    const ret = new ScoutingData();
    ret.notes = entry.notes;
    ret.auto_gamepiece = {
      top: parseInt(entry.auto_gamepiece.top as unknown as string),
      mid: parseInt(entry.auto_gamepiece.mid as unknown as string),
      hybrid: parseInt(entry.auto_gamepiece.hybrid as unknown as string),
      miss: parseInt(entry.auto_gamepiece.miss as unknown as string),
    };
    ret.teleop_gamepiece = {
      top: parseInt(entry.teleop_gamepiece.top as unknown as string),
      mid: parseInt(entry.teleop_gamepiece.mid as unknown as string),
      hybrid: parseInt(entry.teleop_gamepiece.hybrid as unknown as string),
      miss: parseInt(entry.teleop_gamepiece.miss as unknown as string),
    };
    ret.identifier = entry.identifier;
    ret.mobility = entry.mobility;
    ret.auto_charge = parseInt(entry.auto_charge as unknown as string);
    ret.teleop_charge = parseInt(entry.teleop_charge as unknown as string);

    ret.scoring_capabilities = entry.scoring_capabilities;
    return ret;
  });

  let avgTeleopGP =
    dat
      .map(
        (entry) =>
          (entry.teleop_gamepiece.top as number) +
          (entry.teleop_gamepiece.mid as number) +
          (entry.teleop_gamepiece.hybrid as number)
      )
      .reduce((a, b) => a + b, 0) / dat.length;
  let avgAutoGP =
    dat
      .map(
        (entry) =>
          (entry.auto_gamepiece.top as number) +
          (entry.auto_gamepiece.mid as number) +
          (entry.auto_gamepiece.hybrid as number)
      )
      .reduce((a, b) => a + b, 0) / dat.length;

  let teleopConsistency =
    (dat
      .map(
        (entry) =>
          (entry.teleop_gamepiece.top as number) +
          (entry.teleop_gamepiece.mid as number) +
          (entry.teleop_gamepiece.hybrid as number)
      )
      .reduce((a, b) => a + b, 0) /
      dat
        .map(
          (entry) =>
            (entry.teleop_gamepiece.top as number) +
            (entry.teleop_gamepiece.mid as number) +
            (entry.teleop_gamepiece.hybrid as number) +
            (entry.teleop_gamepiece.miss as number)
        )
        .reduce((a, b) => a + b, 0)) *
    100;

  let mobilityConsistency =
    (dat.map((entry) => (entry.mobility ? 1 : 0)).reduce((a: number, b: number) => a + b, 0) /
      dat.length) *
    100;

  let autoConsistency =
    (dat
      .map(
        (entry) =>
          (entry.auto_gamepiece.top as number) +
          (entry.auto_gamepiece.mid as number) +
          (entry.auto_gamepiece.hybrid as number)
      )
      .reduce((a, b) => a + b, 0) /
      dat
        .map(
          (entry) =>
            (entry.auto_gamepiece.top as number) +
            (entry.auto_gamepiece.mid as number) +
            (entry.auto_gamepiece.hybrid as number) +
            (entry.auto_gamepiece.miss as number)
        )
        .reduce((a, b) => a + b, 0)) *
    100;

  let highestAutoDock = dat
    .map((entry) => (entry.auto_charge as number) + 2)
    .reduce((a, b) => (a > b ? a : b), 0);

  let highestTeleopDock = dat
    .map((entry) => entry.teleop_charge as number)
    .reduce((a, b) => (a > b ? a : b), 0);

  let autoDocks = dat.map((entry) => (entry.auto_charge as number) + 2);
  let avgAutoDock = autoDocks.reduce((a, b) => a + b, 0) / dat.length;

  let teleopDocks = dat.map((entry) => entry.teleop_charge as number);
  let avgTeleopDock = teleopDocks.reduce((a, b) => a + b, 0) / dat.length;

  let avgTopGP =
    dat
      .map((entry) => entry.teleop_gamepiece.top + entry.auto_gamepiece.top)
      .reduce((a, b) => a + b, 0) / dat.length;
  let avgMidGP =
    dat
      .map((entry) => entry.teleop_gamepiece.mid + entry.auto_gamepiece.mid)
      .reduce((a, b) => a + b, 0) / dat.length;
  let avgHybridGP =
    dat
      .map(
        (entry) => entry.teleop_gamepiece.hybrid + entry.auto_gamepiece.hybrid
      )
      .reduce((a, b) => a + b, 0) / dat.length;

  let gamepiecePoints = dat.map(
    (entry) =>
      entry.teleop_gamepiece.top * 5 +
      entry.teleop_gamepiece.mid * 3 +
      entry.teleop_gamepiece.hybrid * 2 +
      entry.auto_gamepiece.top * 6 +
      entry.auto_gamepiece.mid * 4 +
      entry.auto_gamepiece.hybrid * 3
  );

  let avgGPPoints = gamepiecePoints.reduce((a, b) => a + b, 0) / dat.length;

  let sd = Math.sqrt(
    gamepiecePoints
      .map((a) => (a - avgGPPoints) * (a - avgGPPoints))
      .reduce((a, b) => a + b, 0) / dat.length
  );

  let avgGPCycledTeleop =
    dat
      .map(
        (entry) =>
          entry.teleop_gamepiece.top +
          entry.teleop_gamepiece.mid +
          entry.teleop_gamepiece.hybrid +
          entry.teleop_gamepiece.miss
      )
      .reduce((a, b) => a + b, 0) / dat.length;

  let conePreference =
    (dat
      .map((entry) => +!!entry.scoring_capabilities.cone)
      .reduce((a, b) => a + b, 0) /
      dat.length) *
    100;

  let cubePreference =
    (dat
      .map((entry) => +!!entry.scoring_capabilities.cube)
      .reduce((a, b) => a + b, 0) /
      dat.length) *
    100;

  return {
    avgTeleopGP,
    avgAutoGP,
    teleopConsistency,
    autoConsistency,
    highestAutoDock,
    highestTeleopDock,
    avgAutoDock,
    avgTeleopDock,
    avgTopGP,
    avgMidGP,
    avgHybridGP,
    avgGPPoints,
    avgGPCycledTeleop,
    sd,
    conePreference,
    cubePreference,
    mobilityConsistency
  };
};

export const handleScoutUpload = async (
  req: Request<{}, any, any, any, Record<string, any>>,
  res: Response<any, any>
) => {
  let data = new ScoutingData();
  let requ = req.body;
  if (
    requ.identifier.team != 0 &&
    requ.identifier.comp != "" &&
    requ.identifier.comp_level != "" &&
    requ.identifier.match_number != 0
  ) {
    data.identifier = requ.identifier;
    data.auto_gamepiece = requ.auto_gamepiece;
    data.teleop_gamepiece = requ.teleop_gamepiece;
    data.auto_charge = requ.auto_charge;
    data.teleop_charge = requ.teleop_charge;
    data.scoring_capabilities = requ.scoring_capabilities;
    data.notes = requ.notes;
    data.mobility = requ.mobility;

    const dataRepo = conn.getRepository(ScoutingData);

    await dataRepo.save(data);
  }
  res.send("OK");
};

export const filterDataByMatch = async (
  event: string,
  level: string,
  matchNum: number,
  setNum?: number
) => {
  let dataRepo = conn.getRepository(ScoutingData);

  let req = dataRepo
    .createQueryBuilder("data")
    .where("data.identifier->>'comp' = :event", {
      event,
    })
    .andWhere("data.identifier->>'comp_level' = :level", { level })
    .andWhere("data.identifier->>'match_number' = :matchNum", { matchNum });

  if (setNum !== undefined) {
    req = req.andWhere("data.identifier->>'set_number' = :setNum", { setNum });
  }
  let dat = req.getMany();

  return dat;
};

export const teamNotes = async (team: number) => {
  let dataRepo = conn.getRepository(ScoutingData);

  let dat = await dataRepo
    .createQueryBuilder("data")
    .where("data.identifier->>'team' = :team", { team })
    .getMany();

  return dat.map((entry) => [entry.notes, entry.identifier.comp]);
};
