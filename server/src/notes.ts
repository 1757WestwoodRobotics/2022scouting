import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Request, Response } from "express";
import { conn } from "./data-source";

@Entity()
export class BotNotes extends BaseEntity {
  @PrimaryGeneratedColumn()
  number!: number;

  @Column()
  team: number;

  @Column()
  comp: string;

  @Column()
  note: string;

  @Column()
  author: string;
}

export const handleNotes = async (
  req: Request<{}, any, any, any, Record<string, any>>,
  res: Response<any, any>
) => {
  let data = new BotNotes();
  let requ = req.body;

  if (
    requ.team != 0 &&
    requ.comp != "" &&
    requ.note != "" &&
    requ.key == process.env.SCOUT_SECRET &&
    requ.author != ""
  ) {
    data.team = requ.team;
    data.comp = requ.comp;
    data.note = requ.note;
    data.author = requ.author;

    const dataRepo = conn.getRepository(BotNotes);

    await dataRepo.save(data);
    res.send("OK");
  } else {
    res.status(401);
    res.send("FAIL");
  }
};

export const fetchNotes = async (team: number): Promise<string[]> => {
  let dataRepo = conn.getRepository(BotNotes);

  let dat = await dataRepo
    .createQueryBuilder("data")
    .where("data.team = :team", { team })
    .getMany();

  return dat.map((a) => `${a.note} (${a.author}, ${a.comp})`);
};
