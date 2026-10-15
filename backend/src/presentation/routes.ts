import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { currentTeacher, loginTeacher } from "../application/loginTeacher";
import { continueStep } from "../application/continueStep";
import { createPlan, updatePlanConfiguration } from "../application/createPlan";
import { getPlan, listPlans } from "../application/listPlans";
import { logoutTeacher } from "../application/logoutTeacher";
import { readSessionId, SESSION_COOKIE, sessionCookieOptions } from "./http";

export function apiRouter(prisma: PrismaClient): Router {
  const router = Router();

  router.post("/auth/login", async (req, res, next) => {
    try {
      const result = await loginTeacher(prisma, req.body?.email, req.body?.password);
      res.cookie(SESSION_COOKIE, result.sessionId, sessionCookieOptions());
      res.json(result.profile);
    } catch (error) {
      next(error);
    }
  });

  router.post("/auth/logout", async (req, res, next) => {
    try {
      await logoutTeacher(prisma, readSessionId(req));
      res.clearCookie(SESSION_COOKIE, sessionCookieOptions());
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  router.get("/auth/me", async (req, res, next) => {
    try {
      const profile = await currentTeacher(prisma, readSessionId(req));
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  router.post("/plans", async (req, res, next) => {
    try {
      const plan = await createPlan(prisma, readSessionId(req), req.body ?? {});
      res.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/plans/:planId", async (req, res, next) => {
    try {
      const plan = await updatePlanConfiguration(prisma, readSessionId(req), String(req.params.planId), req.body ?? {});
      res.json(plan);
    } catch (error) {
      next(error);
    }
  });

  router.get("/plans", async (req, res, next) => {
    try {
      res.json(await listPlans(prisma, readSessionId(req)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/plans/:planId/steps/:step/continue", async (req, res, next) => {
    try {
      const plan = await continueStep(prisma, readSessionId(req), String(req.params.planId), String(req.params.step));
      res.json(plan);
    } catch (error) {
      next(error);
    }
  });

  router.get("/plans/:planId", async (req, res, next) => {
    try {
      const planId = String(req.params.planId);
      res.json(await getPlan(prisma, readSessionId(req), planId));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
