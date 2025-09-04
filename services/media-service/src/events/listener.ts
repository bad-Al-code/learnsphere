import { ConsumeMessage } from 'amqplib';
import logger from '../config/logger';
import { StudentPerformance } from '../types';
import { ReportProcessor } from '../workers/processors/report-processor';
import { rabbitMQConnection } from './connection';

interface Event {
  topic: string;
  data: object;
}

export abstract class Listener<T extends Event> {
  abstract topic: T['topic'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: ConsumeMessage): void;

  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

  listen(): void {
    const channel = rabbitMQConnection.getChannel();

    const setup = async () => {
      await channel.assertExchange(this.exchange, this.exchangeType, {
        durable: true,
      });
      const q = await channel.assertQueue(this.queueGroupName, {
        durable: true,
      });
      await channel.bindQueue(q.queue, this.exchange, this.topic);

      logger.info(
        `Waiting for messages in queue [${this.queueGroupName}] on topic [${this.topic}]`
      );

      channel.consume(q.queue, (msg: ConsumeMessage | null) => {
        if (msg) {
          logger.debug(`Message received from topic [${this.topic}]`);

          const parsedData = JSON.parse(msg.content.toString());
          this.onMessage(parsedData, msg);

          channel.ack(msg);
        }
      });
    };

    setup().catch((error) => {
      logger.error(`Error setting up listener`, {
        queue: this.queueGroupName,
        topic: this.topic,
        error,
      });
    });
  }
}

interface ReportGenerationRequestedEvent {
  topic: 'report.generation.requested';
  data: {
    jobId: string;
    requesterId: string;
    reportType: string;
    format: 'csv' | 'pdf';
    payload: StudentPerformance[];
  };
}

export class ReportGenerationListener extends Listener<ReportGenerationRequestedEvent> {
  readonly topic = 'report.generation.requested' as const;
  queueGroupName = 'media-service-report-generation';
  private reportProcessor: ReportProcessor;

  constructor(reportProcessor: ReportProcessor) {
    super();
    this.reportProcessor = reportProcessor;
  }

  async onMessage(
    data: ReportGenerationRequestedEvent['data'],
    _msg: ConsumeMessage
  ) {
    await this.reportProcessor.process(data);
  }
}
