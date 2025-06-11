import "dotenv/config";

import { app } from "./app";
import logger from "./config/logger";
import { rabbitMQConnection } from "./events/connection";

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      logger.info(
        `Auth sservice listening at port ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });

    process.on("SIGINT", async () => {
      await rabbitMQConnection.close();
      process.exit(0);
    });
    process.on("SIGTERM", async () => {
      await rabbitMQConnection.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to start the server", { error });
    process.exit(1);
  }
};

startServer();
