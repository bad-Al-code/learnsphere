import { app } from "./app";
import logger from "./config/logger";

const startServer = () => {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    logger.info(
      `Auth service listening at port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

startServer();
