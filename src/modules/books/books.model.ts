import { model, Schema } from "mongoose";
import { IBook } from "./books.types";

const BookSchema = new Schema<IBook>(
  {
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    coverImagePublicId: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const BookModel = model("book", BookSchema);
