import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", {
    message: err.message,
    code: err.code || 'UNKNOWN_ERROR',
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      message,
      details: err.details || null,
      timestamp: new Date().toISOString(),
    }
  });
};