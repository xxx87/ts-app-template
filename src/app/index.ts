import express, { type Express, type ErrorRequestHandler } from "express";
import { HttpCodes } from "@constants/http-codes";
import { logger } from "@utils/logger";
import router from "../api";
import { type AppConfig } from "../config/types";
import { initApiContext, ns } from "./context";

export const createApp = async (appConfig: AppConfig): Promise<Express> => {
  const app = express();

  app.use((req, _res, next) => {
    ns.run(() => {
      initApiContext(req.url);
      next();
    });
  });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use((req, res, next) => {
    if (!appConfig.logger.logRequests) {
      return next();
    }

    const startTime = Date.now();

    res.on("close", () => {
      const deltaTime = Date.now() - startTime;
      const logMessage = `Request: ${req.ip} -> ${req.method}: ${req.baseUrl + req.path} -> ${
        res.statusCode
      } -> ${deltaTime} ms`;

      if (res.statusCode === 500) {
        logger.error(logMessage);
      } else {
        logger.debug(logMessage);
      }
    });
    next();
  });

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", appConfig.cors.allowedMethods.join(", "));

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Expose-Headers", "Set-Cookie");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Content-Length, Cookie, Host, User-Agent, Origin, X-Requested-With, Baggage, Sentry-Trace"
    );

    res.header("Access-Control-Allow-Origin", "*");
    // const origin = req.get("origin") || "";
    // if (appConfig.cors.allowedOrigins.includes(origin)) {
    //   res.header("Access-Control-Allow-Origin", origin);
    // }

    if (!appConfig.cors.allowedMethods.includes(req.method)) {
      res.status(HttpCodes.MethodNotAllowed).send();
      return;
    }

    if (req.method === "OPTIONS") {
      res.status(HttpCodes.Ok).send();
      return;
    }

    next();
  });

  app.use("/api", router);

  app.all("*", (_, res) => {
    res.status(HttpCodes.NotFound).send();
  });

  const errHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err.isAxiosError) {
      logger.error("Axios error occurred", {
        message: err.message,
        data: err.response?.data
      });
    } else {
      logger.error("Error occurred", err);
    }

    res.status(HttpCodes.InternalServerError).send();
  };

  app.use(errHandler);

  return app;
};
