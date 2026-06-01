import { CategoryType } from "../domain/entities/category.entity";

export interface CreateCategoryDTO {
  userId?: string;
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryDTO {
  id: string;
  name?: string;
  type?: CategoryType;
  userId?: string;
}
