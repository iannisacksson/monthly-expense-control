export class MonthlyIncomeEntity {
  static validateGrossIncome(grossIncome: number) {
    if (grossIncome <= 0) {
      throw new Error("Income amount must be greater than zero")
    }
  }

  static validateNotes(notes?: string) {
    if (notes && notes.length > 255) {
      throw new Error("Income notes must be at most 255 characters")
    }
  }
}