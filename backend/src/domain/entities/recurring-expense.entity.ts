export class RecurringExpenseEntity {
  private static readonly allowedExpenseKinds = ["standard", "envelope"] as const

  static validateBaseFields(params: {
    description: string
    value: number
    status: string
    expenseKind?: string
    plannedAmount?: number | null
  }) {
    if (!params.description || params.description.length > 255) {
      throw new Error("Description is required and must be at most 255 characters")
    }

    if (!["active", "inactive"].includes(params.status)) {
      throw new Error("Status must be active or inactive")
    }

    const expenseKind = params.expenseKind ?? "standard"
    if (!this.allowedExpenseKinds.includes(expenseKind as typeof this.allowedExpenseKinds[number])) {
      throw new Error("Recurring expense kind must be standard or envelope")
    }

    if (expenseKind === "envelope") {
      if (params.value < 0) {
        throw new Error("Recurring envelope expenses cannot define a negative current amount")
      }

      if (params.plannedAmount === undefined || params.plannedAmount === null || params.plannedAmount <= 0) {
        throw new Error("Recurring envelope expenses must define a planned amount greater than zero")
      }

      return
    }

    if (params.value <= 0) {
      throw new Error("Recurring expense amount must be greater than zero")
    }

    if (params.plannedAmount !== undefined && params.plannedAmount !== null && params.plannedAmount <= 0) {
      throw new Error("Planned amount must be greater than zero when provided")
    }
  }
}