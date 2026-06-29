import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

// Parses & replaces req.body using the given schema. Throws ZodError on failure.
export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
