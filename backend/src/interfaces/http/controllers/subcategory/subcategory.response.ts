import { Subcategory } from "../../../../domain/entities/subcategory.entity";

export interface SubcategoryResponse {
  id: string;
  category_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export function toSubcategoryResponse(
  subcategory: Subcategory,
): SubcategoryResponse {
  return {
    id: subcategory.id,
    category_id: subcategory.category.id,
    name: subcategory.name,
    created_at: subcategory.createdAt,
    updated_at: subcategory.updatedAt,
  };
}
