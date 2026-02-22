import { model, Schema } from "mongoose";
import { IBook } from "./books.types";

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const BookModel = model("book", BookSchema);
