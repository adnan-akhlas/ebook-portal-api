import path from "node:path";
import { Router } from "express";
import { addBook, updateBook } from "./books.controller";
import multer from "multer";
import { auth } from "../../middleware/auth.middleware";

const upload = multer({
  dest: path.resolve(__dirname, "../../../public/data/uploads"),
  limits: { fileSize: 1e7 },
});

const BookRouter = Router();

BookRouter.post(
  "/",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addBook,
);

BookRouter.put(
  "/:id",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook,
);

export default BookRouter;
