export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
}

export interface CreateSubcategoryDTO {
  category_id: string;
  name: string;
}

export interface UpdateSubcategoryDTO {
  name?: string;
}
