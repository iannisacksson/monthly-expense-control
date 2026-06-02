import { CreateSubcategoryUseCase } from "../../../../application/use-cases/subcategory/create.use-case";
import { DeleteSubcategoryUseCase } from "../../../../application/use-cases/subcategory/delete.use-case";
import { GetSubcategoryByIdUseCase } from "../../../../application/use-cases/subcategory/get-by-id.use-case";
import { ListSubcategoriesByCategoryUseCase } from "../../../../application/use-cases/subcategory/list-by-category.use-case";
import { UpdateSubcategoryUseCase } from "../../../../application/use-cases/subcategory/update.use-case";
import { CategoryRepository } from "../../../../repositories/category.repository";
import { SubcategoryRepository } from "../../../../repositories/subcategory.repository";
import { CreateSubcategoryController } from "./create.controller";
import { DeleteSubcategoryController } from "./delete.controller";
import { GetSubcategoryByIdController } from "./get-by-id.controller";
import { ListSubcategoriesByCategoryController } from "./list-by-category.controller";
import { UpdateSubcategoryController } from "./update.controller";

const subcategoryRepository = new SubcategoryRepository();
const categoryRepository = new CategoryRepository();

export const subcategoryComposer = {
  create: new CreateSubcategoryController(
    new CreateSubcategoryUseCase(subcategoryRepository, categoryRepository),
  ),
  listByCategory: new ListSubcategoriesByCategoryController(
    new ListSubcategoriesByCategoryUseCase(
      subcategoryRepository,
      categoryRepository,
    ),
  ),
  getById: new GetSubcategoryByIdController(
    new GetSubcategoryByIdUseCase(subcategoryRepository, categoryRepository),
  ),
  update: new UpdateSubcategoryController(
    new UpdateSubcategoryUseCase(subcategoryRepository, categoryRepository),
  ),
  delete: new DeleteSubcategoryController(
    new DeleteSubcategoryUseCase(subcategoryRepository, categoryRepository),
  ),
};
