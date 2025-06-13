import "dotenv/config";
import { app } from "./app";
import logger from "./config/logger";

const start = async () => {
  try {
    const PORT = process.env.PORT || 8002;
    app.listen(PORT, () => {
      logger.info(`Media service API listening on port ${PORT}`);
    });

    // TODO: start the SQS worker here
  } catch (error) {
    logger.error("Failed to start the media-service", { error });
    process.exit(1);
  }
};

start();
