import { Message } from "@aws-sdk/client-sqs";
import { IProcessor, S3EventInfo } from "./ip-processor";
import logger from "../../config/logger";
import { VideoProcessedPublisher } from "../../events/publisher";

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
    // simulation
    const fakeVideoUrl = `https://learnsphere-processed-media-xt9tcab6.s3.ap-south-1.amazonaws.com/videos/${lessonId}/playlist.m3u8`;
    logger.info(
      `[SIMULATED] Video transcoding complete for lesson: ${lessonId}`
    );

    const publisher = new VideoProcessedPublisher();
    await publisher.publish({
      lessonId: lessonId,
      videoUrl: fakeVideoUrl,
    });
  }
}
