import { CategoryType } from "../domain/entities/category.entity";

export interface CreateCategoryDTO {
  userId?: string;
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryDTO {
  name?: string;
  type?: CategoryType;
}
