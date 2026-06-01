import {
  Category,
  CategoryType,
} from "../../../../domain/entities/category.entity";

export interface CategoryResponse {
  id: string;
  name: string;
  type: CategoryType;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export function toCategoryResponse(category: Category): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    user_id: category.user.id,
    created_at: category.createdAt,
    updated_at: category.updatedAt,
  };
}
