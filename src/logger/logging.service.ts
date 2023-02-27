import 'dotenv/config';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { access, appendFile, mkdir } from 'fs/promises';
import { sep } from 'path';
import { cwd } from 'process';
import { statSync } from 'fs';
import { ONE_kb } from '../utils/constants';

const { LOGGING_LEVEL, LOG_FILE_SIZE_KB } = process.env;

@Injectable()
export class LoggingService extends ConsoleLogger {
  private LOG_FILENAME = `${new Date()}.log`;
  private ERROR_FILENAME = '';

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
    const currentTime = new Date();
    const log = `'\n'${currentTime.toLocaleString()} ${message}'\n'`;
    const logFolder = `${cwd()}${sep}logs`;
    await mkdir(logFolder, { recursive: true });

    if (!this.LOG_FILENAME) {
      this.LOG_FILENAME = `${currentTime}.log`;
    }

    if (!this.ERROR_FILENAME) {
      this.ERROR_FILENAME = `${currentTime}_errors.log`;
    }

    if (method === 'log') {
      const pathToLogFile = `${logFolder}${sep}${this.LOG_FILENAME}`;

      let fileSize = 0;

      try {
        await access(pathToLogFile);
        fileSize = statSync(pathToLogFile).size;
      } catch {}

      if (fileSize >= +LOG_FILE_SIZE_KB * ONE_kb) {
        this.LOG_FILENAME = `${currentTime}.log`;
      }
      appendFile(pathToLogFile, log, 'utf8');
    } else if (method === 'error') {
      const pathToLogFile = `${logFolder}${sep}${this.ERROR_FILENAME}`;

      let fileSize = 0;

      try {
        await access(pathToLogFile);
        fileSize = statSync(pathToLogFile).size;
      } catch {}

      if (fileSize >= +LOG_FILE_SIZE_KB * ONE_kb) {
        this.ERROR_FILENAME = `${currentTime}.errors.log`;
      }
      appendFile(pathToLogFile, log, 'utf8');
    }
  }
}
