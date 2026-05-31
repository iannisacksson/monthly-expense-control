import { Category } from "../domain/entities/category.entity";
import { ICategoryRepository } from "../domain/repositories/category.repository";
import { CategoryModel } from "../models/category.model";

export class CategoryRepository implements ICategoryRepository {
  async create(data: Category): Promise<Category> {
    const category = await CategoryModel.create(data);
    return category.toDomain();
  }

  async findById(id: string): Promise<Category | null> {
    return CategoryModel.findByPk(id);
  }

  async findByUserId(userId: string): Promise<Category[]> {
    return CategoryModel.findAll({ where: { userId: userId } });
  }

  async findAll(): Promise<Category[]> {
    return CategoryModel.findAll();
  }

  async update(data: Partial<Category>): Promise<Category> {
    const category = await CategoryModel.update(data, {
      where: { id: data.id },
      returning: true,
    });
    return category[1][0].toDomain();
  }

  async delete(data: Category): Promise<void> {
    await CategoryModel.destroy({ where: { id: data.id } });
  }
}
