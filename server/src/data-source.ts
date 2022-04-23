import "reflect-metadata";
import { DataSource } from "typeorm";
import { ScoutingData } from "./scout";

const {NODE_ENV} = process.env
const dev = NODE_ENV !== 'production';

export const conn = new DataSource({
  type: "postgres",
  host: dev ? "localhost" : "db",
  port: 5432,
  database: "frc2022",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [ScoutingData],
});

