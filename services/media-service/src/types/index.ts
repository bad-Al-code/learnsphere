import { mediaAssets } from '../db/schema';

export interface UploadUrlParams {
  filename: string;
  uploadType: 'avatar' | 'video' | 'course_thumbnail' | 'course_resource';
  metadata: Record<string, string>;
}

export interface SignedUrlResponse {
  signedUrl: string;
  key: string;
  finalUrl: string;
}

export interface TranscodeOptions {
  inputPath: string;
  outputDir: string;
}

export interface ProcessedAvatarUrls {
  small: string;
  medium: string;
  large: string;
}

export interface S3EventInfo {
  bucket: string;
  key: string;
}

export interface IProcessor {
  canProcess(metadata: Record<string, string | undefined>): boolean;
  process(
    s3Info: S3EventInfo,
    metadata: Record<string, string | undefined>
  ): Promise<void>;
}

export interface ParsedMessage {
  s3Info: S3EventInfo;
  metadata: Record<string, string>;
}

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type NewMediaAsset = typeof mediaAssets.$inferInsert;
export type UpdateMediaAsset = Partial<
  Omit<MediaAsset, 'id' | 'createdAt' | 'updatedAt'>
>;

export interface StudentPerformance {
  userId: string;
  courseId: string;
  progressPercentage: string;
  lastActive: Date;
  averageGrade: number;
}

export interface EnrichedStudentPerformance {
  lastActive: string;
  name: string;
  courseTitle: string;
  progressPercentage: string;
  averageGrade: number | null;
}
