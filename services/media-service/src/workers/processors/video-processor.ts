import { Message } from "@aws-sdk/client-sqs";
import { IProcessor, S3EventInfo } from "./ip-processor";

export class VideoProcessor implements IProcessor {
  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.hasOwnProperty("lessonId");
  }

  public async process(
    message: Message,
    s3Info: S3EventInfo,
    metadata: Record<string, string | undefined>
  ): Promise<void> {
    const lessonId = metadata.lessonId;
    if (!lessonId) {
      throw new Error(`VideoProcessor called without a lessonId in metadata.`);
    }

    //TODO: Implement video transcoding logic
    // TODO: publish a 'video.processed' event with { lessonId, videoUrl }

    return Promise.resolve();
  }
}
