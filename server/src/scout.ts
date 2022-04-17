import { BaseEntity, Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";

type CargoData = {
    upper: number,
    lower: number,
    miss: number
}

enum ClimbLevel {
    None = 0,
    Low = 4,
    Mid = 6,
    High = 10,
    Traverse = 15
}


@Entity()
export class ScoutingData extends BaseEntity {
    @PrimaryColumn()
    full_iden!: string; // YYYYcomp_TYPENUM_team

    @JoinColumn()
    auto_cargo: CargoData;

    @JoinColumn()
    teleop_cargo: CargoData;

    @Column({type: "enum", enum: ClimbLevel, default: ClimbLevel.None})
    climb_level: ClimbLevel
}


export const handleScoutUpload = async (req, res) => {
    let data = new ScoutingData()
    data.full_iden = req.body
    console.log(req.body);
    res.send("OK");
}
