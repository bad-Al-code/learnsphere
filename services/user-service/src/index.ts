import "dotenv/config";
import { app } from "./app";
import logger from "./config/logger";

const startServer = () => {
  const PORT = process.env.PORT || 8001;

  app.listen(PORT, () => {
    logger.info(
      `User service listening on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

startServer();
