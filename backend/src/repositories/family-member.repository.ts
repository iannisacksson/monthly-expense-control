import { FamilyMember } from "../models/index"

export class FamilyMemberRepository {
  async create(data: { family_id: string; user_id: string; role: string }) {
    return FamilyMember.create(data)
  }

  async findById(id: string) {
    return FamilyMember.findByPk(id)
  }

  async findByFamilyId(familyId: string) {
    return FamilyMember.findAll({ where: { family_id: familyId } })
  }

  async findByUserId(userId: string) {
    return FamilyMember.findAll({ where: { user_id: userId } })
  }

  async findByFamilyAndUserId(familyId: string, userId: string) {
    return FamilyMember.findOne({ where: { family_id: familyId, user_id: userId } })
  }

  async delete(id: string) {
    const member = await FamilyMember.findByPk(id)
    if (!member) return null
    await member.destroy()
    return member
  }
}
