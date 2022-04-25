import { Request, Response } from "express";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

import { conn } from "./data-source";

type CargoData = {
  upper: number;
  lower: number;
  miss: number;
};

export enum ClimbLevel {
  None = 0,
  Low = 4,
  Mid = 6,
  High = 10,
  Traverse = 15,
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
};

@Entity()
export class ScoutingData extends BaseEntity {
  @PrimaryColumn({
    type: "jsonb",
  })
  identifier!: DataIdentifier; // comp_TYPENUM_team

  @Column({
    type: "jsonb",
  })
  auto_cargo: CargoData;

  @Column({
    type: "jsonb",
  })
  teleop_cargo: CargoData;

  @Column({
    type: "enum",
    enum: ClimbLevel,
    default: ClimbLevel.None,
  })
  climb_level: ClimbLevel;

  @Column() notes: String;
}

export type TeamStats = {
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

export const dbTeamData = async (team: number): Promise<TeamStats> => {
  const dataRepo = conn.getRepository(ScoutingData);

  let dat = await dataRepo
    .createQueryBuilder("data")
    .where("data.identifier->>'team' = :team", {
      team,
    })
    .getMany();

  let avgTeleopCargo =
    dat
      .map(
        (entry) =>
          (entry.teleop_cargo.lower as number) +
          (entry.teleop_cargo.upper as number)
      )
      .reduce((a, b) => a + b, 0) / dat.length;
  let avgAutoCargo =
    dat
      .map(
        (entry) =>
          (entry.auto_cargo.lower as number) +
          (entry.auto_cargo.upper as number)
      )
      .reduce((a, b) => a + b, 0) / dat.length;

  let teleopConsistency =
    (dat
      .map(
        (entry) =>
          (entry.teleop_cargo.upper as number) +
          (entry.teleop_cargo.lower as number)
      )
      .reduce((a, b) => a + b, 0) /
      dat
        .map(
          (entry) =>
            (entry.teleop_cargo.upper as number) +
            (entry.teleop_cargo.lower as number) +
            (entry.teleop_cargo.miss as number)
        )
        .reduce((a, b) => a + b, 0)) *
    100;

  let autoConsistency =
    (dat
      .map(
        (entry) =>
          (entry.auto_cargo.upper as number) +
          (entry.auto_cargo.lower as number)
      )
      .reduce((a, b) => a + b, 0) /
      dat
        .map(
          (entry) =>
            (entry.auto_cargo.upper as number) +
            (entry.auto_cargo.lower as number) +
            (entry.auto_cargo.miss as number)
        )
        .reduce((a, b) => a + b, 0)) *
    100;

  let highestClimb = dat
    .map((entry) => entry.climb_level as number)
    .reduce((a, b) => (a > b ? a : b), 0);
  let avgClimb =
    dat.map((entry) => entry.climb_level as number).reduce((a, b) => a + b, 0) /
    dat.length;

  let avgUpperCargo =
    dat
      .map((entry) => entry.teleop_cargo.upper + entry.auto_cargo.upper)
      .reduce((a, b) => a + b, 0) / dat.length;
  let avgLowerCargo =
    dat
      .map((entry) => entry.teleop_cargo.lower + entry.auto_cargo.lower)
      .reduce((a, b) => a + b, 0) / dat.length;
  let avgCargoPoints =
    dat
      .map(
        (entry) =>
          entry.teleop_cargo.upper * 2 +
          entry.teleop_cargo.lower +
          entry.auto_cargo.upper * 4 +
          entry.auto_cargo.lower * 2
      )
      .reduce((a, b) => a + b, 0) / dat.length;

  return {
    avgTeleopCargo,
    avgAutoCargo,
    teleopConsistency,
    autoConsistency,
    highestClimb,
    avgClimb,
    avgUpperCargo,
    avgLowerCargo,
    avgCargoPoints,
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
    data.auto_cargo = requ.auto_cargo;
    data.teleop_cargo = requ.teleop_cargo;
    data.climb_level = requ.climb_level;
    data.notes = requ.notes;

    const dataRepo = conn.getRepository(ScoutingData);

    await dataRepo.save(data);
  }
  res.send("OK");
};

export const filterDataByMatch = async (
  event: string,
  level: string,
  matchNum: number
) => {
  let dataRepo = conn.getRepository(ScoutingData);

  let dat = await dataRepo
    .createQueryBuilder("data")
    .where("data.identifier->>'comp' = :event", {
      event,
    })
    .andWhere("data.identifier->>'comp_level' = :level", { level })
    .andWhere("data.identifier->>'match_number' = :matchNum", { matchNum })
    .getMany();

  return dat;
};

export const teamNotes = async(team: number) => {
  let dataRepo = conn.getRepository(ScoutingData);

  let dat = await dataRepo
    .createQueryBuilder("data")
    .where("data.identifier->>'team' = :team", { team })
    .getMany();

    return dat.map((entry) => entry.notes)
}
