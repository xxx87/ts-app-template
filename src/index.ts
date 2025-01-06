import "dotenv/config";
import * as http from "http";
import { appConfig } from "@config";
import { logger } from "@utils/logger";
import { createApp } from "./app";

process.on("uncaughtException", (err) => logger.error(err));
process.on("unhandledRejection", (err) => logger.error(err));

(async (): Promise<void> => {
  const app = await createApp(appConfig);
  const server = http.createServer(app);

  server.listen(appConfig.port, () => {
    logger.debug(
      `App listening on port ${appConfig.port} [http://localhost:${appConfig.port}/]`,
    );
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received");
    logger.info("Closing http server...");
    server.close(() => {
      logger.info("Http server has been closed");
      process.exit(0);
    });
  });
})();
