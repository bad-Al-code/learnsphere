import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import logger from './logger';

export function initializeTracing(serviceName: string) {
  const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:14268/v1/traces',
  });

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  logger.info(`Tracing initialized for service: ${serviceName}`);

  process.on('SIGTERM', () => {
    sdk.shutdown().then(() => logger.info('Tracing Terminated.'));
  });
}
