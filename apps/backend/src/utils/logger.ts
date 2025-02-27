/* eslint-disable no-control-regex */
import chalk from 'chalk';
import { _getCallerFile } from './getCallerFile';
import fs, { type WriteStream } from 'node:fs';

let writer: WriteStream;
const logFile = process.env.LOGFILE;
if (logFile) {
  writer = fs.createWriteStream(logFile.trim());
}

export class Logger {
  private static getTimestamp() {
    return chalk.bgGrey(`[${new Date(Date.now()).toISOString()}]`);
  }
  public static info(...args: Parameters<(typeof console)['info']>) {
    const prefix = `[${_getCallerFile(2)}]`;
    const logInfo = [
      this.getTimestamp(),
      chalk.white.bgBlue.bold('[INFO]'),
      chalk.grey(prefix),
      ...args,
    ];
    console.info(...logInfo);
    writer?.write(logInfo.join(' ').replaceAll(/\[\d*m/gi, '') + '\n');
  }
  public static init() {
    const prefix = `[${_getCallerFile(2)}]`;
    const logInfo = [
      this.getTimestamp(),
      chalk.white.bgGreenBright.bold('[INIT]'),
      chalk.grey(prefix),
      chalk.greenBright('Initialized.'),
    ];
    console.info(...logInfo);

    writer?.write(logInfo.join(' ').replaceAll(/\[\d*m/gi, '') + '\n');
  }
  public static withType(
    type: string | null,
    ...args: Parameters<(typeof console)['info']>
  ) {
    const prefix = `[${_getCallerFile(2)}]`;
    const logInfo = [
      this.getTimestamp(),
      type ?? chalk.white.bgBlue.bold('[DEBUG]'),
      chalk.grey(prefix),
      ...args,
    ];
    console.info(...logInfo);
    writer?.write(logInfo.join(' ').replaceAll(/\[\d*m/gi, '') + '\n');
  }
  public static error(...args: Parameters<(typeof console)['error']>) {
    const prefix = `[${_getCallerFile(2)}]`;
    const logInfo = [
      this.getTimestamp(),
      chalk.black.bgRedBright.bold('[ERR!]'),
      chalk.grey(prefix),
      ...args,
    ];
    console.error(...logInfo);

    writer?.write(logInfo.join(' ').replaceAll(/\[\d*m/gi, '') + '\n');
  }
  public static warn(...args: Parameters<(typeof console)['warn']>) {
    const prefix = `[${_getCallerFile(2)}]`;
    const logInfo = [
      this.getTimestamp(),
      chalk.white.bgYellowBright.bold('[WARN]'),
      chalk.grey(prefix),
      ...args,
    ];
    console.warn(...logInfo);
    writer?.write(logInfo.join(' ').replaceAll(/\[\d*m/gi, '') + '\n');
  }
  public static count(...args: Parameters<(typeof console)['count']>) {
    console.count(...args);
  }
}
