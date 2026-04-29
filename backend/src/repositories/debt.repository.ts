import { Debt } from "../models/index"

export class DebtRepository {
  async create(data: {
    family_id: string
    creditor_id: string
    debtor_id: string
    expense_id?: string
    value: number
    status: string
  }) {
    return Debt.create(data)
  }

  async findById(id: string) {
    return Debt.findByPk(id)
  }

  async findByFamilyId(familyId: string) {
    return Debt.findAll({ where: { family_id: familyId } })
  }

  async findByCreditorId(creditorId: string) {
    return Debt.findAll({ where: { creditor_id: creditorId } })
  }

  async findByDebtorId(debtorId: string) {
    return Debt.findAll({ where: { debtor_id: debtorId } })
  }

  async update(id: string, data: Partial<{ value: number; status: string }>) {
    const debt = await Debt.findByPk(id)
    if (!debt) return null
    return debt.update(data)
  }

  async delete(id: string) {
    const debt = await Debt.findByPk(id)
    if (!debt) return null
    await debt.destroy()
    return debt
  }
}
