import { createLogger, format, transports, addColors } from "winston";
import { appConfig } from "@config";
import { getLoggerScope, getRequestId } from "../app/context";

addColors({
  error: "bold red",
  warn: "bold yellow",
  info: "bold cyan",
  debug: "bold green"
});

const stringifyLogParam = (param: any): string | Error => {
  if (param instanceof Error) {
    return `Error: ${param.message}\nStack: ${param.stack}`;
  }

  return JSON.stringify(param, null, 2);
};

const customFormat = format.combine(
  format.timestamp({
    format: "DD.MM.YYYY, HH:mm:ss.SSS"
  }),

  format((info: any) => {
    if (info.data && Array.isArray(info.data)) {
      const [firstParam, ...restParams] = info.data;
      if (typeof firstParam === "string") {
        info.message = `${info.message} ${firstParam}`;
      } else {
        info.message = `${info.message} ${stringifyLogParam(firstParam)}`;
      }

      const formattedParams = restParams.map((p: any) => stringifyLogParam(p)).join(" ");
      info.message = `${info.message} ${formattedParams}`;

      delete info.data;
    }

    return info;
  })(),

  format.printf((info) => `[${info.timestamp}] [${info.level}] : ${info.message}`)
);

const transportsArray: any[] = [
  new transports.Console({
    level: appConfig.logger.logLevel,
    format: format.combine(format.colorize(), customFormat)
  })
];

const winstonLogger = createLogger({
  level: appConfig.logger.logLevel,
  exitOnError: false,
  transports: transportsArray
});

const getLoggerPrefix = (): string => {
  const scope = getLoggerScope();
  const requestId = getRequestId();
  return `(${requestId ? `${requestId}:` : ""}${scope}):`;
};

export const logger = {
  error(...params: any[]) {
    winstonLogger.error(getLoggerPrefix(), { data: params });
  },
  warn(...params: any[]) {
    winstonLogger.warn(getLoggerPrefix(), { data: params });
  },
  info(...params: any[]) {
    winstonLogger.info(getLoggerPrefix(), { data: params });
  },
  debug(...params: any[]) {
    winstonLogger.debug(getLoggerPrefix(), { data: params });
  }
};
