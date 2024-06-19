import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import log from "../utils/logger";
import { ErrorResponse } from "../models/error.model";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join(", ");
        log.error(`validate: ${errorMessage}`);
        res.status(400).send(errorMessage);
      }

      const e = error as ErrorResponse;
      log.error(`validate: ${e}`);
      res.status(400).send(e.message);
    }
  };
