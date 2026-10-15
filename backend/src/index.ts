import "dotenv/config";
import { createApp } from "./app";
import { prisma } from "./infrastructure/prisma";

const port = Number(process.env.PORT ?? 3000);

createApp(prisma).listen(port, "127.0.0.1", () => {
  console.log(`API listening on 127.0.0.1:${port}`);
});
