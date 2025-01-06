import { createNamespace } from "cls-hooked";
import { randomHash } from "@utils/common";

export const ns = createNamespace("app");

const LOGGER_SCOPE_KEY = "loggerScope";
const REQUEST_ID_KEY = "requestId";

export const initApiContext = (url: string): void => {
  ns.set(LOGGER_SCOPE_KEY, url.slice(1).replace(/\?.*/g, "").replace(/\//g, ":"));
  ns.set(REQUEST_ID_KEY, randomHash());
};

export const getLoggerScope = (): string => {
  const loggerScope = ns.get(LOGGER_SCOPE_KEY);
  return loggerScope ?? "default";
};

export const getRequestId = (): string | null => {
  const requestId = ns.get(REQUEST_ID_KEY);
  return requestId ?? null;
};
