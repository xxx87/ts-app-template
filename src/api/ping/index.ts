import { type Request, type Response } from "express";
import { HttpCodes } from "@constants/http-codes";

export const pingRoute = (_req: Request, res: Response): void => {
  res.status(HttpCodes.Ok).send();
};
