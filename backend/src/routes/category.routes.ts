import { Router } from "express"
import { CreateCategoryController } from "../interfaces/http/controllers/category/create.controller";
import { DeleteCategoryController } from "../interfaces/http/controllers/category/delete.controller";
import { GetCategoryByIdController } from "../interfaces/http/controllers/category/get-by-id.controller";
import { ListCategoriesByUserController } from "../interfaces/http/controllers/category/list-by-user.controller";
import { UpdateCategoryController } from "../interfaces/http/controllers/category/update.controller";
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryByIdUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from "../application/use-cases/category.use-cases";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createCategoryController = new CreateCategoryController(
  new CreateCategoryUseCase(),
);
const listCategoriesByUserController = new ListCategoriesByUserController(
  new ListCategoriesUseCase(),
);
const getCategoryByIdController = new GetCategoryByIdController(
  new GetCategoryByIdUseCase(),
);
const updateCategoryController = new UpdateCategoryController(
  new UpdateCategoryUseCase(),
);
const deleteCategoryController = new DeleteCategoryController(
  new DeleteCategoryUseCase(),
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
