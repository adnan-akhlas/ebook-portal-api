import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import httpStatus from "http-status-codes";
import fs from "node:fs";
import path from "node:path";
import cloudinary from "../../config/cloudinary.config";
import { BookModel } from "./books.model";

export async function addBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { title, genre } = req.body;
    const userId = req.user.sub as string;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageFile = files?.coverImage?.[0];

    if (!coverImageFile) {
      const error = createHttpError(
        httpStatus.BAD_REQUEST,
        "Cover image is required.",
      );
      return next(error);
    }

    const coverImageFileName = coverImageFile.filename;
    const coverImageFilePath = path.join(
      __dirname,
      "../../../public/data/uploads",
      coverImageFileName,
    );

    const imageFileUploadResult = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "ebook_portal/book_covers",
        format: "webp",
        resource_type: "image",
        overwrite: true,
        unique_filename: true,
        use_filename: true,
      },
    );

    const bookFile = files?.file?.[0];

    if (!bookFile) {
      const error = createHttpError(
        httpStatus.BAD_REQUEST,
        "Book pdf is required",
      );
      return next(error);
    }

    const bookFileName = bookFile.filename;
    const bookFilePath = path.join(
      __dirname,
      "../../../public/data/uploads",
      bookFileName,
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        filename_override: bookFileName,
        resource_type: "raw",
        format: "pdf",
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        folder: "ebook_portal/book_pdfs",
      },
    );

    await fs.promises.unlink(bookFilePath);
    await fs.promises.unlink(coverImageFilePath);

    const newBook = await BookModel.create({
      title,
      genre,
      coverImage: imageFileUploadResult.secure_url,
      coverImagePublicId: imageFileUploadResult.public_id,
      file: bookFileUploadResult.secure_url,
      filePublicId: bookFileUploadResult.public_id,
      author: userId,
    });

    res
      .status(httpStatus.CREATED)
      .json({ message: "Book added successfully.", bookId: newBook.id });
  } catch (error: unknown) {
    console.log(error);
    next(error);
  }
}

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { title, genre } = req.body;
    const { id } = req.params;
    const userId = req.user.sub as string;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const book = await BookModel.findById(id);

    if (!book) {
      const error = createHttpError(httpStatus.NOT_FOUND, "Book not found.");
      return next(error);
    }
    if (book.author.toString() !== userId) {
      const error = createHttpError(
        403,
        "Forbidden. Only authors can update book.",
      );
      return next(error);
    }

    let image: string | File = book.coverImage;
    let imagePublicId: string = book.coverImagePublicId;
    if (files?.coverImage?.[0]) {
      const coverImageFileName = files.coverImage[0].filename;
      const coverImageFilePath = path.join(
        __dirname,
        "../../../public/data/uploads",
        coverImageFileName,
      );
      const imageUploadResult = await cloudinary.uploader.upload(
        coverImageFilePath,
        {
          filename_override: coverImageFileName,
          format: "webp",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
          folder: "ebook_portal/book_covers",
          overwrite: true,
          transformation: [{ quality: "auto" }],
        },
      );
      image = imageUploadResult.secure_url;
      imagePublicId = imageUploadResult.public_id;
      await fs.promises.unlink(coverImageFilePath);
      await cloudinary.uploader.destroy(book.coverImagePublicId, {
        resource_type: "image",
        invalidate: true,
      });
    }

    let pdf: string | File = book.file;
    let pdfPublicId: string = book.filePublicId;
    if (files?.file?.[0]) {
      const pdfFileName = files.file[0].filename;
      const pdfFilePath = path.join(
        __dirname,
        "../../../public/data/uploads",
        pdfFileName,
      );
      const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
        filename_override: pdfFileName,
        resource_type: "raw",
        unique_filename: true,
        use_filename: true,
        folder: "ebook_portal/book_pdfs",
        format: "pdf",
        overwrite: true,
      });
      pdf = pdfUploadResult.secure_url;
      pdfPublicId = pdfUploadResult.public_id;
      await fs.promises.unlink(pdfFilePath);
      await cloudinary.uploader.destroy(book.filePublicId, {
        resource_type: "raw",
        invalidate: true,
      });
    }
    const updateBook = {
      title: title || book.title,
      genre: genre || book.genre,
      coverImage: image,
      coverImagePublicId: imagePublicId,
      file: pdf,
      filePublicId: pdfPublicId,
    };
    const newBook = await BookModel.findOneAndUpdate({ id }, updateBook, {
      new: true,
    }).select("-_id");
    res.json({ message: "Book updated successfully.", data: newBook });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function getBooks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const books = await BookModel.find({})
      .populate("author", "name -_id")
      .select("-coverImagePublicId -filePublicId");
    res.json({ message: "Books retrieved successfully.", data: books });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function getBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id)
      .populate("author", "name -_id")
      .select("-coverImagePublicId -filePublicId");
    if (!book) {
      const error = createHttpError(httpStatus.NOT_FOUND, "Book not found.");
      return next(error);
    }
    res.json({ message: "Book retrieved successfully.", data: book });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user.sub as string;
    const book = await BookModel.findById(id);
    if (!book) {
      const error = createHttpError(httpStatus.NOT_FOUND, "Book not found.");
      return next(error);
    }
    if (book.author.toString() !== userId) {
      const error = createHttpError(
        httpStatus.FORBIDDEN,
        "Only author can delete the book.",
      );
      return next(error);
    }
    await BookModel.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(book.coverImagePublicId, {
      resource_type: "image",
      invalidate: true,
    });
    await cloudinary.uploader.destroy(book.filePublicId, {
      resource_type: "raw",
      invalidate: true,
    });

    res
      .status(httpStatus.NO_CONTENT)
      .json({ message: "Book deleted successfully." });
  } catch (error: unknown) {
    return next(error);
  }
}
