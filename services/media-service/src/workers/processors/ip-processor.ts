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
