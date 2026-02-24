import path from "node:path";
import { Router } from "express";
import {
  addBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from "./books.controller";
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
  "/:slug",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook,
);

BookRouter.get("/", getBooks);

BookRouter.get("/:slug", getBook);

BookRouter.delete("/:slug", auth, deleteBook);

export default BookRouter;
