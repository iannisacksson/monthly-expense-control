import { Router } from "express"
import { CreateCategoryController } from "../interfaces/http/controllers/category/create.controller";
import { DeleteCategoryController } from "../interfaces/http/controllers/category/delete.controller";
import { GetCategoryByIdController } from "../interfaces/http/controllers/category/get-by-id.controller";
import { ListCategoriesByUserController } from "../interfaces/http/controllers/category/list-by-user.controller";
import { UpdateCategoryController } from "../interfaces/http/controllers/category/update.controller";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
} from "../interfaces/http/express-route.adapter";
import { CreateCategoryUseCase } from "../application/use-cases/category/create.use-case";
import { DeleteCategoryUseCase } from "../application/use-cases/category/delete.use-case";
import { GetCategoryByIdUseCase } from "../application/use-cases/category/get-by-id.use-case";
import { ListCategoriesByUserUseCase } from "../application/use-cases/category/list-by-user.use-case";
import { UpdateCategoryUseCase } from "../application/use-cases/category/update.use-case";
import { CategoryRepository } from "../repositories/category.repository";

const router = Router()

const categoryRepository = new CategoryRepository();
const createCategoryController = new CreateCategoryController(
  new CreateCategoryUseCase(categoryRepository),
);
const listCategoriesByUserController = new ListCategoriesByUserController(
  new ListCategoriesByUserUseCase(categoryRepository),
);
const getCategoryByIdController = new GetCategoryByIdController(
  new GetCategoryByIdUseCase(categoryRepository),
);
const updateCategoryController = new UpdateCategoryController(
  new UpdateCategoryUseCase(categoryRepository),
);
const deleteCategoryController = new DeleteCategoryController(
  new DeleteCategoryUseCase(categoryRepository),
);

router.post(
  "/",
  adaptExpressRoute(
    createCategoryController.handle.bind(createCategoryController),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.get(
  "/user/:userId",
  adaptExpressRoute(
    listCategoriesByUserController.handle.bind(listCategoriesByUserController),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getCategoryByIdController.handle.bind(getCategoryByIdController),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateCategoryController.handle.bind(updateCategoryController),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteCategoryController.handle.bind(deleteCategoryController),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);

export default router
