import { Category } from "../domain/entities/category.entity";
import type { Subcategory } from "../domain/entities/subcategory.entity";
import type { ISubcategoryRepository } from "../domain/repositories/subcategory.repository";
import { SubcategoryModel } from "../models/subcategory.model";

export class SubcategoryRepository implements ISubcategoryRepository {
  async create(data: Subcategory): Promise<Subcategory> {
    const model = await SubcategoryModel.create(data);
    return model.toDomain();
  }

  async findById(id: string): Promise<Subcategory | null> {
    const model = await SubcategoryModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByCategory(category: Category): Promise<Subcategory[]> {
    const models = await SubcategoryModel.findAll({
      where: { categoryId: category.id },
    });
    return models.map((m) => m.toDomain());
  }

  async update(subcategory: Subcategory): Promise<Subcategory> {
    const [_, [model]] = await SubcategoryModel.update(subcategory, {
      where: { id: subcategory.id },
      returning: true,
    });
    return model.toDomain();
  }

  async delete(subcategory: Subcategory): Promise<void> {
    await SubcategoryModel.destroy({ where: { id: subcategory.id } });
  }
}
