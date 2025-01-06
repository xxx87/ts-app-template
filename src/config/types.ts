export type AppConfig = {
  appVersion: string;
  serverNodeEnv: string | undefined;
  port: number;
  logger: {
    logLevel: "debug" | "info" | "warn" | "error";
    logRequests: boolean;
  };
  cors: {
    allowedMethods: string[];
    allowedOrigins: string[];
  };
};
