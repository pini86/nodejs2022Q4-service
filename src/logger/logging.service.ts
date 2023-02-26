import 'dotenv/config';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { access, appendFile, mkdir } from 'fs/promises';
import path, { sep } from 'path';
import { cwd } from 'process';
import { statSync } from 'fs';
import { ONE_kb } from '../utils/constants';

const {
  LOGGING_LEVEL,
  LOG_FILE_SIZE_KB,
  LOG_FILENAME = '',
  ERROR_FILENAME = '',
} = process.env;
@Injectable()
export class LoggingService extends ConsoleLogger {
  log(message: string): void {
    if (+LOGGING_LEVEL >= 1) {
      super.log(message);
      this.writeToFile(message, 'log');
    }
  }

  error(message: string): void {
    if (+LOGGING_LEVEL >= 2) {
      super.error(message);
      this.writeToFile(`error ${message}`, 'error');
    }
  }

  warn(message: string): void {
    if (+LOGGING_LEVEL >= 3) {
      super.warn(message);
      this.writeToFile(`warn ${message}`, 'error');
    }
  }

  debug(message: string): void {
    if (+LOGGING_LEVEL >= 4) {
      super.debug(message);
      this.writeToFile(`debug ${message}`, 'error');
    }
  }

  verbose(message: string): void {
    if (+LOGGING_LEVEL >= 5) {
      super.verbose(message);
      this.writeToFile(`verbose ${message}`, 'error');
    }
  }

  private async writeToFile(message: string, method: string): Promise<void> {
    const currentTime = Date.now();
    const log = `'\n'${currentTime} ${message}'\n'`;
    const logFolder = `${cwd()}${sep}loges`;
    await mkdir(logFolder, { recursive: true });
    //const dirname = path.resolve(process.cwd(), `logs/${name}s`);

    if (!process.env.LOG_FILENAME) {
      const newLogFile = `${currentTime}.log`;
      process.env.LOG_FILENAME = newLogFile;
    }

    if (!process.env.ERROR_FILENAME) {
      const newLogFile = `${currentTime}_errors.log`;
      process.env.ERROR_FILENAME = newLogFile;
    }

    let newLogFile: string;

    if (method === 'log') {
      newLogFile = process.env.LOG_FILENAME;

      const pathToLogFile = `${logFolder}${sep}${newLogFile}`;

      let fileSize = 0;

      try {
        await access(pathToLogFile);
        fileSize = statSync(pathToLogFile).size;
      } catch {}

      if (fileSize >= +LOG_FILE_SIZE_KB * ONE_kb) {
        newLogFile = `${currentTime}.log`;
        process.env.LOG_FILENAME = newLogFile;
      }
    } else if (method === 'error') {
      newLogFile = process.env.ERROR_FILENAME;

      const pathToLogFile = `${logFolder}${sep}${newLogFile}`;

      let fileSize = 0;

      try {
        await access(pathToLogFile);
        fileSize = statSync(pathToLogFile).size;
      } catch {}

      if (fileSize >= +LOG_FILE_SIZE_KB * ONE_kb) {
        newLogFile = `${currentTime}.errors.log`;
        process.env.ERROR_FILENAME = newLogFile;
      }
    }

    const pathToLogFile = `${logFolder}${sep}${newLogFile}`;
    appendFile(pathToLogFile, log, 'utf8');
  }
}
