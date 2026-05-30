export class MonthEntity {
  static validatePeriod(year: number, month: number) {
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12")
    }

    if (year < 2000 || year > 2100) {
      throw new Error("Year must be between 2000 and 2100")
    }
  }

  static validateStatus(status: string) {
    if (!["open", "closed"].includes(status)) {
      throw new Error("Status must be open or closed")
    }
  }

  static ensureDeletionAllowed() {
    throw new Error("Month deletion is not allowed")
  }
}