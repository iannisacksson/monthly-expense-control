export class RecurringIncomeEntity {
  static validateBaseFields(params: {
    description: string
    grossIncome: number
    incomeType: string
    kind: string
    status: string
  }) {
    if (!params.description || params.description.length > 255) {
      throw new Error("Description is required and must be at most 255 characters")
    }

    if (params.grossIncome <= 0) {
      throw new Error("Recurring income amount must be greater than zero")
    }

    if (!params.incomeType) {
      throw new Error("Income type is required")
    }

    if (!["fixed_salary", "recurring_extra"].includes(params.kind)) {
      throw new Error("Recurring income kind must be fixed_salary or recurring_extra")
    }

    if (!["active", "inactive"].includes(params.status)) {
      throw new Error("Status must be active or inactive")
    }
  }
}