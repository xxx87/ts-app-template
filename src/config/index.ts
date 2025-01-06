import { type AppConfig } from "./types";

export const appConfig: AppConfig = {
  appVersion: process.env.BE_APP_VERSION ?? "",
  serverNodeEnv: process.env.SERVER_NODE_ENV,
  port: Number(process.env.PORT!),
  logger: {
    logLevel: process.env.LOG_LEVEL! as AppConfig["logger"]["logLevel"],
    logRequests: !!process.env.LOG_REQUESTS
  },
  cors: {
    allowedMethods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
    allowedOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"]
  }
};
