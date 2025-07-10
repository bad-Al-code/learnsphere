import logger from '../config/logger';
import { IProcessor } from './processors/ip-processor';

export class ProcessorFactory {
  private readonly processors: IProcessor[];

  constructor(processors: IProcessor[]) {
    this.processors = processors;
  }

  /**
   * Finds and returns the appropriate processor for the given metadata.
   * @param metadata The metadata from the SQS message (originally S3 object tags).
   * @returns The processor capable of handling the task, or null if no suitable processor is found
   */
  public getProcessor(
    metadata: Record<string, string | undefined>
  ): IProcessor | null {
    const processor = this.processors.find((p) => p.canProcess(metadata));

    if (!processor) {
      logger.warn(`No suitable processor find for metadata`, { metadata });

      return null;
    }

    logger.info(`Selected processor: ${processor.constructor.name}`);

    return processor;
  }
}
