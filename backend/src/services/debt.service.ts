import { DebtRepository } from "../repositories/debt.repository"
import { FamilyRepository } from "../repositories/family.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateDebtDTO, UpdateDebtDTO } from "../dtos/debt.dto"

const debtRepository = new DebtRepository()
const familyRepository = new FamilyRepository()
const userRepository = new UserRepository()

export class DebtService {
  async createDebt(data: CreateDebtDTO) {
    if (data.value <= 0) {
      throw new Error("Debt value must be greater than zero")
    }

    if (data.creditor_id === data.debtor_id) {
      throw new Error("Creditor and debtor must be different users")
    }

    const family = await familyRepository.findById(data.family_id)
    if (!family) {
      throw new Error("Family not found")
    }

    const creditor = await userRepository.findById(data.creditor_id)
    if (!creditor) {
      throw new Error("Creditor user not found")
    }

    const debtor = await userRepository.findById(data.debtor_id)
    if (!debtor) {
      throw new Error("Debtor user not found")
    }

    return debtRepository.create(data)
  }

  async findDebtById(id: string) {
    const debt = await debtRepository.findById(id)
    if (!debt) {
      throw new Error("Debt not found")
    }
    return debt
  }

  async listDebtsByFamily(familyId: string) {
    return debtRepository.findByFamilyId(familyId)
  }

  async listDebtsByCreditor(creditorId: string) {
    return debtRepository.findByCreditorId(creditorId)
  }

  async listDebtsByDebtor(debtorId: string) {
    return debtRepository.findByDebtorId(debtorId)
  }

  async updateDebt(id: string, data: UpdateDebtDTO) {
    if (data.value !== undefined && data.value <= 0) {
      throw new Error("Debt value must be greater than zero")
    }

    const debt = await debtRepository.update(id, data)
    if (!debt) {
      throw new Error("Debt not found")
    }
    return debt
  }

  async deleteDebt(id: string) {
    const debt = await debtRepository.delete(id)
    if (!debt) {
      throw new Error("Debt not found")
    }
    return debt
  }
}
