import type { Subcategory } from "../domain/entities/subcategory.entity";
import type { ISubcategoryRepository } from "../domain/repositories/subcategory.repository";
import { SubcategoryModel } from "../models/subcategory.model";

export class SubcategoryRepository implements ISubcategoryRepository {
  async create(
    data: Omit<
      Subcategory,
      "id" | "createdAt" | "updatedAt" | "validateName" | "normalizeName"
    >,
  ): Promise<Subcategory> {
    const model = await SubcategoryModel.create({
      category: data.category,
      name: data.name,
    });
    return model.toDomain();
  }

  async findById(id: string): Promise<Subcategory | null> {
    const model = await SubcategoryModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByCategoryId(categoryId: string): Promise<Subcategory[]> {
    const models = await SubcategoryModel.findAll({ where: { categoryId } });
    return models.map((m) => m.toDomain());
  }

  async update(
    id: string,
    data: Partial<{ name: string }>,
  ): Promise<Subcategory | null> {
    const model = await SubcategoryModel.findByPk(id);
    if (!model) return null;
    await model.update(data);
    return model.toDomain();
  }

  async delete(subcategory: Subcategory): Promise<void> {
    const model = await SubcategoryModel.findByPk(subcategory.id);
    if (!model) return;
    await model.destroy();
  }
}
