import { Router } from "express"
import { CreateSubcategoryController } from "../interfaces/http/controllers/subcategory/create.controller";
import { DeleteSubcategoryController } from "../interfaces/http/controllers/subcategory/delete.controller";
import { GetSubcategoryByIdController } from "../interfaces/http/controllers/subcategory/get-by-id.controller";
import { ListSubcategoriesByCategoryController } from "../interfaces/http/controllers/subcategory/list-by-category.controller";
import { UpdateSubcategoryController } from "../interfaces/http/controllers/subcategory/update.controller";
import {
  CreateSubcategoryUseCase,
  DeleteSubcategoryUseCase,
  GetSubcategoryByIdUseCase,
  ListSubcategoriesUseCase,
  UpdateSubcategoryUseCase,
} from "../application/use-cases/subcategory.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createSubcategoryController = new CreateSubcategoryController(
  new CreateSubcategoryUseCase(),
);
const listSubcategoriesByCategoryController =
  new ListSubcategoriesByCategoryController(new ListSubcategoriesUseCase());
const getSubcategoryByIdController = new GetSubcategoryByIdController(
  new GetSubcategoryByIdUseCase(),
);
const updateSubcategoryController = new UpdateSubcategoryController(
  new UpdateSubcategoryUseCase(),
);
const deleteSubcategoryController = new DeleteSubcategoryController(
  new DeleteSubcategoryUseCase(),
);

router.post(
  "/",
  adaptExpressRoute(
    createSubcategoryController.handle.bind(createSubcategoryController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/category/:categoryId",
  adaptExpressRoute(
    listSubcategoriesByCategoryController.handle.bind(
      listSubcategoriesByCategoryController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getSubcategoryByIdController.handle.bind(getSubcategoryByIdController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateSubcategoryController.handle.bind(updateSubcategoryController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteSubcategoryController.handle.bind(deleteSubcategoryController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
