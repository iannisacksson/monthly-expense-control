import { Router } from "express"
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  listCategoriesByUserController,
  updateCategoryController,
} from "../interfaces/http/controllers/category";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
} from "../interfaces/http/express-route.adapter";

const router = Router()

router.post(
  "/",
  adaptExpressRoute(createCategoryController, (req) =>
    buildAuthenticatedHttpRequest(req),
  ),
);
router.get(
  "/user/:userId",
  adaptExpressRoute(listCategoriesByUserController, (req) =>
    buildAuthenticatedHttpRequest(req),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(getCategoryByIdController, (req) =>
    buildAuthenticatedHttpRequest(req),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(updateCategoryController, (req) =>
    buildAuthenticatedHttpRequest(req),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(deleteCategoryController, (req) =>
    buildAuthenticatedHttpRequest(req),
  ),
);

export default router
