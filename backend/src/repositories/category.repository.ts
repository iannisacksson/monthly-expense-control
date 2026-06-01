import { Category } from "../domain/entities/category.entity";
import { User } from "../domain/entities/user.entity";
import { ICategoryRepository } from "../domain/repositories/category.repository";
import { CategoryModel } from "../models/category.model";

export class CategoryRepository implements ICategoryRepository {
  async create(data: Category): Promise<Category> {
    const category = await CategoryModel.create(data);
    return category.toDomain();
  }

  async findById(id: string): Promise<Category | null> {
    const model = await CategoryModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByUser(user: User): Promise<Category[]> {
    const models = await CategoryModel.findAll({ where: { userId: user.id } });
    return models.map((m) => m.toDomain());
  }

  async findAll(): Promise<Category[]> {
    const models = await CategoryModel.findAll();
    return models.map((m) => m.toDomain());
  }

  async update(data: Category): Promise<Category> {
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
