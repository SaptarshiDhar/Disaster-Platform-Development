import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import type { HealthStatus } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data: HealthStatus = HealthCheckResponse.parse({ status: "ok" });
  return res.json(data);
});

export default router;
