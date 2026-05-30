export class CategoryEntity {
  static validateName(name: string) {
    const normalizedName = name?.trim()

    if (!normalizedName || normalizedName.length < 2 || normalizedName.length > 100) {
      throw new Error("Category name must be between 2 and 100 characters")
    }
  }

  static ensureUserOwnership(userId?: string) {
    if (!userId) {
      throw new Error("Category must belong to a user")
    }
  }
}