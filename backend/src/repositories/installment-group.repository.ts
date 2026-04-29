import { InstallmentGroup } from "../models/index"

export class InstallmentGroupRepository {
  async create(data: {
    user_id?: string
    family_id?: string
    description: string
    total_value: number
    installments: number
    starting_installment_number: number
    category_id: string
    subcategory_id?: string
    paid_by?: string
    responsible_user_id?: string
    start_month_id: string
  }) {
    return InstallmentGroup.create(data)
  }

  async findById(id: string) {
    return InstallmentGroup.findByPk(id)
  }

  async findByFamilyId(familyId: string) {
    return InstallmentGroup.findAll({ where: { family_id: familyId } })
  }

  async findByUserId(userId: string) {
    return InstallmentGroup.findAll({ where: { user_id: userId } })
  }

  async update(id: string, data: Partial<{
    description: string
    total_value: number
    installments: number
    starting_installment_number: number
    category_id: string
    subcategory_id: string
    paid_by: string
    responsible_user_id: string
    start_month_id: string
  }>) {
    const group = await InstallmentGroup.findByPk(id)
    if (!group) return null
    return group.update(data)
  }

  async delete(id: string) {
    const group = await InstallmentGroup.findByPk(id)
    if (!group) return null
    await group.destroy()
    return group
  }
}
