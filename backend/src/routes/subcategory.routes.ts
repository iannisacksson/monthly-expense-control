import { Router } from "express"
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import { subcategoryComposer } from "../interfaces/http/controllers/subcategory";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

router.post(
  "/",
  adaptExpressRoute(
    subcategoryComposer.create.handle.bind(subcategoryComposer.create),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/category/:categoryId",
  adaptExpressRoute(
    subcategoryComposer.listByCategory.handle.bind(
      subcategoryComposer.listByCategory,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    subcategoryComposer.getById.handle.bind(subcategoryComposer.getById),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    subcategoryComposer.update.handle.bind(subcategoryComposer.update),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    subcategoryComposer.delete.handle.bind(subcategoryComposer.delete),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
