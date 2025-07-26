import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';

const startApiServer = (): void => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Media service API listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the media-service', { error });
    process.exit(1);
  }
};

startApiServer();
