import { Router } from "express";
import { addBook } from "./books.controller";

const BookRouter = Router();

BookRouter.post("/add-book", addBook);

export default BookRouter;
