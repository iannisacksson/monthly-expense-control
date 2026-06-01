import { CategoryRepository } from "../../../../repositories/category.repository";
import { UserRepository } from "../../../../repositories/user.repository";
import { CreateCategoryUseCase } from "../../../../application/use-cases/category/create.use-case";
import { DeleteCategoryUseCase } from "../../../../application/use-cases/category/delete.use-case";
import { GetCategoryByIdUseCase } from "../../../../application/use-cases/category/get-by-id.use-case";
import { ListCategoriesByUserUseCase } from "../../../../application/use-cases/category/list-by-user.use-case";
import { UpdateCategoryUseCase } from "../../../../application/use-cases/category/update.use-case";
import { CreateCategoryController } from "./create.controller";
import { DeleteCategoryController } from "./delete.controller";
import { GetCategoryByIdController } from "./get-by-id.controller";
import { ListCategoriesByUserController } from "./list-by-user.controller";
import { UpdateCategoryController } from "./update.controller";

const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();

export const categoryComposer = {
  create: new CreateCategoryController(
    new CreateCategoryUseCase(categoryRepository, userRepository),
  ),
  listByUser: new ListCategoriesByUserController(
    new ListCategoriesByUserUseCase(categoryRepository),
  ),
  getById: new GetCategoryByIdController(
    new GetCategoryByIdUseCase(categoryRepository),
  ),
  update: new UpdateCategoryController(
    new UpdateCategoryUseCase(categoryRepository),
  ),
  delete: new DeleteCategoryController(
    new DeleteCategoryUseCase(categoryRepository),
  ),
};
