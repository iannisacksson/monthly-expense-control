import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { familyMemberService } from "../services";
import type { CreateFamilyMemberDTO } from "../types";

const FAMILY_MEMBERS_KEY = ["family-members"] as const;

export function useFamilyMembers(familyId: string) {
  return useQuery({
    queryKey: [...FAMILY_MEMBERS_KEY, familyId],
    queryFn: () => familyMemberService.listByFamily(familyId),
    enabled: !!familyId,
  });
}

export function useAddFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateFamilyMemberDTO) => familyMemberService.add(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAMILY_MEMBERS_KEY });
    },
  });
}

export function useRemoveFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => familyMemberService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAMILY_MEMBERS_KEY });
    },
  });
}
