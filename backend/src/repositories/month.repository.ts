import { Month } from "../models/index"

export class MonthRepository {
  async create(data: { user_id?: string; family_id?: string; year: number; month: number; status: string; budget_rule_id?: string | null }) {
    return Month.create(data)
  }

  async findById(id: string) {
    return Month.findByPk(id)
  }

  async findByFamilyId(familyId: string) {
    return Month.findAll({ where: { family_id: familyId } })
  }

  async findByUserId(userId: string) {
    return Month.findAll({ where: { user_id: userId } })
  }

  async findByFamilyAndPeriod(familyId: string, year: number, month: number) {
    return Month.findOne({ where: { family_id: familyId, year, month } })
  }

  async findByUserAndPeriod(userId: string, year: number, month: number) {
    return Month.findOne({ where: { user_id: userId, year, month } })
  }

  async update(id: string, data: Partial<{ status: string; budget_rule_id: string | null }>) {
    const record = await Month.findByPk(id)
    if (!record) return null
    return record.update(data)
  }

  async delete(id: string) {
    const record = await Month.findByPk(id)
    if (!record) return null
    await record.destroy()
    return record
  }
}
