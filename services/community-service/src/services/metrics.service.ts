import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
} from 'prom-client';

class MetricsService {
  public readonly register: Registry;
  public readonly httpRequestDurationMicroseconds: Histogram<string>;
  public readonly httpRequestsTotal: Counter<string>;
  public readonly websocketConnectionsActive: Gauge<string>;

  constructor() {
    this.register = new Registry();

    this.register.setDefaultLabels({ service: 'community-service' });
    collectDefaultMetrics({ register: this.register });

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestDurationMicroseconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.register],
    });

    this.websocketConnectionsActive = new Gauge({
      name: 'websocket_connections_active',
      help: 'Number of active WebSocket connections',
      registers: [this.register],
    });
  }
}

export const metricsService = new MetricsService();
