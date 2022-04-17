import "reflect-metadata";
import { DataSource } from "typeorm";
import { ScoutingData } from "./scout";

export const conn = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "frc2022",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [ScoutingData],
});

