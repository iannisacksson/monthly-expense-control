import { Category } from "./category.entity";

export interface Subcategory {
  id: string;
  category: Category;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  validateName(): string;
  normalizeName(): string;
}

export class SubcategoryEntity implements Subcategory {
  id: string;
  category: Category;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Subcategory>) {
    Object.assign(this, data);

    if (this.name) {
      this.name = this.validateName();
      this.name = this.normalizeName();
    }
  }

  normalizeName(): string {
    return this.name?.trim();
  }

  validateName(): string {
    const normalizedName = this.normalizeName();

    if (
      !normalizedName ||
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      throw new Error("Subcategory name must be between 2 and 100 characters");
    }

    return normalizedName;
  }
}
