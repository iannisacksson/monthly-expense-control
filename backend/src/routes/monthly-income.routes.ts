import { Router } from "express"
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import { monthlyIncomeComposer } from "../interfaces/http/controllers/monthly-income";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

router.post(
  "/",
  adaptExpressRoute(
    monthlyIncomeComposer.register.handle.bind(monthlyIncomeComposer.register),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/month/:monthId",
  adaptExpressRoute(
    monthlyIncomeComposer.listByMonth.handle.bind(
      monthlyIncomeComposer.listByMonth,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    monthlyIncomeComposer.getById.handle.bind(monthlyIncomeComposer.getById),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    monthlyIncomeComposer.update.handle.bind(monthlyIncomeComposer.update),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    monthlyIncomeComposer.delete.handle.bind(monthlyIncomeComposer.delete),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
