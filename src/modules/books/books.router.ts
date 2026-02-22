import path from "node:path";
import { Router } from "express";
import { addBook } from "./books.controller";
import multer from "multer";

const upload = multer({
  dest: path.resolve(__dirname, "../../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

const BookRouter = Router();

BookRouter.post(
  "/add-book",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addBook,
);

export default BookRouter;
