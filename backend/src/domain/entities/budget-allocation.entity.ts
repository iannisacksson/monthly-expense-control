export class BudgetAllocationEntity {
  static validatePercentage(percentage: number) {
    if (percentage <= 0 || percentage > 100) {
      throw new Error("Percentage must be between 0 and 100")
    }
  }

  static ensureTotalPercentageWithinLimit(currentTotal: number, nextPercentage: number) {
    if (currentTotal + nextPercentage > 100) {
      throw new Error("Total allocation percentage cannot exceed 100%")
    }
  }
}