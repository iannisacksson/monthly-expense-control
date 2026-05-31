import { BadRequestError } from "../../utils/errors";
import { UserEntity } from "./user.entity";

export enum CategoryType {
  NECESSARY = "necessary",
  INVESTMENT = "investment",
  ESSENTIAL = "essential",
  LIFESTYLE = "lifestyle",
}

export interface Category {
  id: string;
  user: UserEntity; // Association to User interface quando criado, mas armazenar user_id no banco.
  name: string;
  type: CategoryType;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryEntity implements Category {
  id: string;
  user: UserEntity;
  name: string;
  type: CategoryType;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Category>) {
    Object.assign(this, data);
  }

  validateName() {
    const normalizedName = this.name?.trim();

    if (
      !normalizedName ||
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      throw new BadRequestError(
        "Category name must be between 2 and 100 characters",
      );
    }
  }

  ensureUserOwnership() {
    if (!this.user) {
      throw new BadRequestError("Category must belong to a user");
    }
  }
}
