import { Router } from "express"
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import { incomeTaxComposer } from "../interfaces/http/controllers/income-tax";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

router.post(
  "/",
  adaptExpressRoute(
    incomeTaxComposer.create.handle.bind(incomeTaxComposer.create),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/income/:incomeId",
  adaptExpressRoute(
    incomeTaxComposer.listByIncome.handle.bind(
      incomeTaxComposer.listByIncome,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    incomeTaxComposer.getById.handle.bind(incomeTaxComposer.getById),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    incomeTaxComposer.update.handle.bind(incomeTaxComposer.update),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    incomeTaxComposer.delete.handle.bind(incomeTaxComposer.delete),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
