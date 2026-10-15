import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./presentation/http";
import { apiRouter } from "./presentation/routes";

export function createApp(prisma: PrismaClient) {
  const app = express();
  app.use(
    cors({
      origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api", apiRouter(prisma));
  app.use(errorMiddleware);
  return app;
}
