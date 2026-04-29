export interface Category {
  user_id?: string;
  id: string;
  family_id?: string;
  name: string;
  type: string;
}

export interface CreateCategoryDTO {
  user_id?: string;
  name: string;
  type: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  type?: string;
}
