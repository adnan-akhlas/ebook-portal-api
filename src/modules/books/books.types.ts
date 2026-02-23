import { User } from "../users/users.types";

export interface IBook {
  _id: string;
  title: string;
  author: User | string;
  genre: string;
  coverImage: string;
  coverImagePublicId: string;
  file: string;
  filePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}
