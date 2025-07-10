import { spawn } from 'child_process';

import logger from '../config/logger';

export class TranscoderClient {
  /**
   * Executes an ffmpeg command with the given arguments
   * @param args An array of arguments to pass to the ffmoeg command.
   * @param friendlyName A human-readable name for the process for logging.
   * @returnsa A promise that resolves when the process completes successfully.
   */
  public static execute(args: string[], friendlyName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      logger.info(`Starting ffmpeg process: [${friendlyName}]... `, { args });

      const ffmpegProcess = spawn('ffmpeg', args);

      ffmpegProcess.stderr.on('data', (data) => {
        logger.debug(`[${friendlyName}] stderr: ${data}`);
      });

      ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          logger.info(
            `ffmpeg process [${friendlyName}] finished successfully.`
          );
          resolve();
        } else {
          const errorMsg = `ffmpeg process [${friendlyName}] exited with code ${code}`;
          logger.error(errorMsg);
          reject(new Error(errorMsg));
        }
      });

      ffmpegProcess.on('error', (err) => {
        logger.error(`Failed to start ffmpeg process [${friendlyName}]`, {
          error: err,
        });
        reject(err);
      });
    });
  }
}
