import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import httpStatus from "http-status-codes";

export async function addBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // const {} = req.body;
  console.log("files", req.files);
  try {
    res
      .status(httpStatus.CREATED)
      .json({ message: "Book added successfully." });
  } catch (error: unknown) {
    next(
      createHttpError(
        httpStatus.BAD_REQUEST,
        "Error occured while creating book.",
      ),
    );
  }
}
