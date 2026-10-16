import "dotenv/config";
import { createApp } from "./app";
import { prisma } from "./infrastructure/prisma";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

createApp(prisma).listen(port, host, () => {
  console.log(`API listening on ${host}:${port}`);
});
