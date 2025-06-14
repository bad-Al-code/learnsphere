import "dotenv/config";

import { app } from "./app";
import logger from "./config/logger";

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 8001;
    app.listen(PORT, () => {
      logger.info(
        `Course service listening on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });

    process.on("SIGINT", async () => {
      process.exit(0);
    });
    process.on("SIGTERM", async () => {
      process.exit(0);
    });
  } catch (error) {
    const err = error as Error;
    logger.error("Failed to start the server: %o", { errMessage: err.message });
    process.exit(1);
  }
};

startServer();
