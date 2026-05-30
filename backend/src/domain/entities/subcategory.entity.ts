export class SubcategoryEntity {
  static normalizeName(name?: string) {
    return name?.trim()
  }

  static validateName(name?: string) {
    const normalizedName = this.normalizeName(name)

    if (!normalizedName || normalizedName.length < 2 || normalizedName.length > 100) {
      throw new Error("Subcategory name must be between 2 and 100 characters")
    }

    return normalizedName
  }
}