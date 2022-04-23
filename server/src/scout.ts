import { BaseEntity, Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";
import { conn } from "./data-source";

type CargoData = {
  upper: number;
  lower: number;
  miss: number;
};

enum ClimbLevel {
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
  @PrimaryColumn({ type: "jsonb" })
  identifier!: DataIdentifier; // comp_TYPENUM_team

  @Column({ type: "jsonb" })
  auto_cargo: CargoData;

  @Column({ type: "jsonb" })
  teleop_cargo: CargoData;

  @Column({ type: "enum", enum: ClimbLevel, default: ClimbLevel.None })
  climb_level: ClimbLevel;

  @Column()
  notes: String;
}

export const handleScoutUpload = async (req, res) => {
  let data = new ScoutingData();
  console.log(req.body);
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

    const savedPhotos = await dataRepo.find();
    console.log(savedPhotos);
  }
  res.send("OK");
};
