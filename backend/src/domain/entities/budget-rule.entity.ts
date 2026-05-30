export class BudgetRuleEntity {
  static validateName(name: string) {
    const normalizedName = name?.trim()

    if (!normalizedName || normalizedName.length < 2 || normalizedName.length > 100) {
      throw new Error("Budget rule name must be between 2 and 100 characters")
    }
  }
}