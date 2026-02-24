import { User } from "../users/users.types";

export interface IBook {
  _id: string;
  slug: string;
  title: string;
  author: User | string;
  genre: string;
  description: string;
  coverImage: string;
  coverImagePublicId: string;
  file: string;
  filePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}
