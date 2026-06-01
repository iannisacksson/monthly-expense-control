import { Router } from "express";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
} from "../interfaces/http/express-route.adapter";
import { categoryComposer } from "../interfaces/http/controllers/category";

const router = Router();

router.post(
  "/",
  adaptExpressRoute(
    categoryComposer.create.handle.bind(categoryComposer.create),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.get(
  "/user/:userId",
  adaptExpressRoute(
    categoryComposer.listByUser.handle.bind(categoryComposer.listByUser),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    categoryComposer.getById.handle.bind(categoryComposer.getById),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    categoryComposer.update.handle.bind(categoryComposer.update),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    categoryComposer.delete.handle.bind(categoryComposer.delete),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);

export default router;
