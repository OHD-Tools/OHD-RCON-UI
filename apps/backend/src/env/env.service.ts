import { injectable } from 'inversify';
import { envConfig, type EnvironmentConfig } from './envConfig';
import colors from 'colors/safe';
import { Logger } from '../utils/logger';

import type { Dialect } from 'sequelize';

let has_warned = false;
@injectable()
export class EnvService implements EnvironmentConfig {
  declare FRONTEND_HOST: string;
  declare BACKEND_HOST: string;

  declare LOGFILE: string | null;

  declare DB_DIALECT: Dialect;
  declare DB_DATABASE: string;
  declare DB_USER: string;
  declare DB_PASSWORD: string;
  declare DB_HOST: string;
  declare DB_PORT: number;

  declare EXPRESS_PORT: number;

  declare AUTH_SECRET: string;
  constructor() {
    const env = process.env;
    this.errorStack = [];
    this.warnStack = [];
    for (const tempProp in envConfig) {
      const prop = tempProp as keyof typeof envConfig;
      const type = envConfig[prop].type;
      const optional = envConfig[prop].optional;
      const defaultValue = envConfig[prop].default;
      const description = envConfig[prop].description as string;
      let envar = env[prop] as string;
      if (envar == undefined) {
        if (optional) {
          this.warnStack.push(
            `${`${colors.green('"')}${colors.bold(colors.cyan(prop))}=${colors.underline(type)}${colors.green('"')}`}${colors.gray(` is missing.`)}`,
          );
          this.warnStack.push(
            `${colors.gray(`${colors.yellow('-')} Defaulting to`)}${`${colors.green('"')}${colors.yellow(defaultValue as unknown as string)}${colors.green('"')}`}`,
          );
          this.warnStack.push('');
          envar = defaultValue as unknown as string;
        } else {
          this.errorStack.push(
            `${colors.green('"')}${colors.cyan(colors.bold(prop))}=${colors.underline(type)}${colors.green('"')}${colors.red(' is missing.')}`,
          );
          this.errorStack.push(
            `${colors.yellow('-')} ${colors.gray(description)}`,
          );
          this.errorStack.push('');
          continue;
        }
      }
      switch (type) {
        case 'string': {
          this[prop] = envar as never;
          break;
        }
        case 'number': {
          this[prop] = Number.parseFloat(envar) as never;
          break;
        }
      }
    }
    if (has_warned) return;
    Logger.init();
    has_warned = true;
    if (this.warnStack.length > 0) {
      for (const warn of this.warnStack) {
        Logger.warn(warn);
      }
    }
    if (this.errorStack.length > 0) {
      for (const error of this.errorStack) {
        Logger.error(error);
      }
      process.exit(1);
    }
  }
  private readonly errorStack: string[];
  private readonly warnStack: string[];
}
