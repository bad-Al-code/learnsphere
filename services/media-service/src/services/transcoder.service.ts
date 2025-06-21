import fs from "node:fs";

import { TranscodeOptions } from "../types";
import path from "node:path";
import { spawn } from "node:child_process";
import logger from "../config/logger";

export class TranscoderService {
  public static transcodeToHls({
    inputPath,
    outputDir,
  }: TranscodeOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdirSync(outputDir, { recursive: true });

      const masterPlaylistPath = path.join(outputDir, "playlist.m3u8");

      const ffmpegArgs = [
        "-i",
        inputPath,
        "-preset",
        "veryfast",
        "-keyint_min",
        "25",
        "-g",
        "25",
        "-sc_threshold",
        "0",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-ar",
        "48000",
        "-b:a",
        "128k",
        "-map",
        "0:v:0",
        "-map",
        "0:a:0", // Stream 1: 1080p
        "-map",
        "0:v:0",
        "-map",
        "0:a:0", // Stream 2: 720p
        "-map",
        "0:v:0",
        "-map",
        "0:a:0", // Stream 3: 480p
        // --- 1080p stream settings ---
        "-filter:v:0",
        "scale=w=1920:h=1080:force_original_aspect_ratio=decrease",
        "-maxrate:v:0",
        "5000k",
        "-bufsize:v:0",
        "10000k",
        // --- 720p stream settings ---
        "-filter:v:1",
        "scale=w=1280:h=720:force_original_aspect_ratio=decrease",
        "-maxrate:v:1",
        "2800k",
        "-bufsize:v:1",
        "5600k",
        // --- 480p stream settings ---
        "-filter:v:2",
        "scale=w=854:h=480:force_original_aspect_ratio=decrease",
        "-maxrate:v:2",
        "1400k",
        "-bufsize:v:2",
        "2800k",
        // HLS settings
        "-hls_time",
        "10", // 10-second segments
        "-hls_playlist_type",
        "vod", // Video on Demand playlist
        "-hls_segment_filename",
        `${outputDir}/segment_%v_%03d.ts`, // Naming pattern for segments
        "-master_pl_name",
        "playlist.m3u8", // Master playlist filename
        "-var_stream_map",
        "v:0,a:0 v:1,a:1 v:2,a:2",
        masterPlaylistPath,
      ];

      const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

      ffmpegProcess.stdout.on("data", (data) => {
        logger.debug(`ffmpeg stdout: ${data}`);
      });

      ffmpegProcess.stderr.on("data", (data) => {
        logger.debug(`ffmpeg strerr: ${data}`);
      });

      ffmpegProcess.on("close", (code) => {
        if (code === 0) {
          logger.info(
            `ffmpeg transcoding finished successfully for ${inputPath}`
          );

          resolve();
        } else {
          logger.error(
            `ffmpeg process exited with code ${code} for ${inputPath}`
          );

          reject(new Error(`ffmpeg exited with code ${code}`));
        }
      });

      ffmpegProcess.on("error", (err) => {
        logger.error("Failed to start ffmpeg process", { error: err });
        reject(err);
      });
    });
  }
}
