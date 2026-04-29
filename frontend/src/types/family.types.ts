export interface Family {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFamilyDTO {
  name: string;
}

export interface UpdateFamilyDTO {
  name?: string;
}
