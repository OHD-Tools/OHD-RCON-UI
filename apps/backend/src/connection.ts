import { Sequelize } from 'sequelize-typescript';
import chalk from 'chalk';
import { Logger } from '~utils/logger';
import type { Dialect } from 'sequelize';

export const setupModels = (env: {
  DB_DIALECT: Dialect;
  DB_DATABASE: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
}) => {
  const connection = new Sequelize({
    database: env.DB_DATABASE,
    dialect: env.DB_DIALECT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    pool: { min: 0, max: 5 },
    models: [`${__dirname}/**/*.model.ts`],
    modelMatch(a, b) {
      Logger.info(`Loading ${chalk.yellow(b)} from ${chalk.grey(a)}`);
      return true;
    },
    benchmark: true,
    logging(sql) {
      Logger.withType(chalk.bold.bgGreen('[$SQL]'), sql);
    },
  });
  Logger.init();
  return connection;
};
