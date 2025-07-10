import fs from 'node:fs';
import path from 'node:path';

import { TranscodeOptions } from '../types';
import logger from '../config/logger';
import { TranscoderClient } from '../clients/transcoder.client';

export class TranscodingService {
  public static async transcodeToHls({
    inputPath,
    outputDir,
  }: TranscodeOptions): Promise<void> {
    fs.mkdirSync(outputDir, { recursive: true });

    const mezzaninePath = path.join(outputDir, 'mezzanine.mp4');

    const normalizeArgs = [
      '-i',
      inputPath,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-profile:v',
      'high',
      '-crf',
      '18',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-y',
      mezzaninePath,
    ];

    await TranscoderClient.execute(normalizeArgs, 'Normalization');

    const hlsArgs = [
      '-i',
      mezzaninePath,
      '-preset',
      'veryfast',
      '-g',
      '48',
      '-keyint_min',
      '48',
      '-sc_threshold',
      '0',
      '-map',
      '0:v:0',
      '-map',
      '0:a:0',
      '-map',
      '0:v:0',
      '-map',
      '0:a:0',
      '-map',
      '0:v:0',
      '-map',
      '0:a:0',
      '-c:v',
      'libx264',
      '-c:a',
      'aac',
      // Stream 0: 480p
      '-filter:v:0',
      'scale=w=854:h=480',
      '-maxrate:v:0',
      '1400k',
      '-bufsize:v:0',
      '2100k',
      '-b:a:0',
      '128k',
      // Stream 1: 720p
      '-filter:v:1',
      'scale=w=1280:h=720',
      '-maxrate:v:1',
      '2800k',
      '-bufsize:v:1',
      '4200k',
      '-b:a:1',
      '128k',
      // Stream 2: 1080p
      '-filter:v:2',
      'scale=w=1920:h=1080',
      '-maxrate:v:2',
      '5000k',
      '-bufsize:v:2',
      '7500k',
      '-b:a:2',
      '192k',
      '-f',
      'hls',
      '-hls_time',
      '10',
      '-hls_playlist_type',
      'vod',
      '-hls_segment_filename',
      path.join(outputDir, '%v/segment%03d.ts'),
      '-master_pl_name',
      'playlist.m3u8',
      '-var_stream_map',
      'v:0,a:0,name:480p v:1,a:1,name:720p v:2,a:2,name:1080p',
      path.join(outputDir, '%v/playlist.m3u8'),
    ];

    await TranscoderClient.execute(hlsArgs, 'HLS Transcoding');

    await fs.promises.unlink(mezzaninePath);

    logger.info(`Cleaned up mezzanine file`);
  }
}
