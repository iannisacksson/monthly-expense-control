export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export interface CreateFamilyMemberDTO {
  family_id: string;
  user_id: string;
  role: string;
}
