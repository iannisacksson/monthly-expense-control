import { FamilyMemberRepository } from "../repositories/family-member.repository"
import { FamilyRepository } from "../repositories/family.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateFamilyMemberDTO } from "../dtos/family-member.dto"

const familyMemberRepository = new FamilyMemberRepository()
const familyRepository = new FamilyRepository()
const userRepository = new UserRepository()

export class FamilyMemberService {
  async addMember(data: CreateFamilyMemberDTO) {
    const family = await familyRepository.findById(data.family_id)
    if (!family) {
      throw new Error("Family not found")
    }

    const user = await userRepository.findById(data.user_id)
    if (!user) {
      throw new Error("User not found")
    }

    return familyMemberRepository.create(data)
  }

  async findMemberById(id: string) {
    const member = await familyMemberRepository.findById(id)
    if (!member) {
      throw new Error("Family member not found")
    }
    return member
  }

  async listMembersByFamily(familyId: string) {
    return familyMemberRepository.findByFamilyId(familyId)
  }

  async listFamiliesByUser(userId: string) {
    return familyMemberRepository.findByUserId(userId)
  }

  async removeMember(id: string) {
    const member = await familyMemberRepository.delete(id)
    if (!member) {
      throw new Error("Family member not found")
    }
    return member
  }
}
